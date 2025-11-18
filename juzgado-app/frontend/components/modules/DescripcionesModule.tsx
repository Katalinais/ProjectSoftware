"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { API_URL } from "@/lib/config"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TypeAction {
  id: string
  description: string
}

interface TypeTrial {
  id: string
  name: string
}

interface DescriptionAction {
  id: string
  description: string
  typeAction: {
    id: string
    description: string
  }
  typeTrial?: {
    id: string
    name: string
  } | null
}

export default function DescripcionesModule() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [autoTypeId, setAutoTypeId] = useState<string>("")
  const [sentenciaTypeId, setSentenciaTypeId] = useState<string>("")
  const [loadingTypeActions, setLoadingTypeActions] = useState(false)
  const [trialTypes, setTrialTypes] = useState<TypeTrial[]>([])
  const [loadingTrialTypes, setLoadingTrialTypes] = useState(false)
  const [descriptionActions, setDescriptionActions] = useState<DescriptionAction[]>([])
  const [loadingDescriptionActions, setLoadingDescriptionActions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorDialog, setErrorDialog] = useState({ open: false, title: "", message: "" })
  const [editingDescription, setEditingDescription] = useState<DescriptionAction | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    typeActionId: "",
    typeTrialId: "",
  })

  useEffect(() => {
    const loadTypeActions = async () => {
      setLoadingTypeActions(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/action/type-actions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const typeActions = data.typeActions || []
          
          const auto = typeActions.find((ta: TypeAction) => 
            ta.description.toLowerCase() === "auto"
          )
          const sentencia = typeActions.find((ta: TypeAction) => 
            ta.description.toLowerCase() === "sentencia"
          )
          
          if (auto) setAutoTypeId(auto.id)
          if (sentencia) setSentenciaTypeId(sentencia.id)
        } else {
          console.error("Error al cargar tipos de acción:", response.status)
        }
      } catch (err) {
        console.error("Error al cargar tipos de acción:", err)
      } finally {
        setLoadingTypeActions(false)
      }
    }

    loadTypeActions()
  }, [])

  useEffect(() => {
    const loadTrialTypes = async () => {
      setLoadingTrialTypes(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/trial/types`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setTrialTypes(data.types || [])
        } else {
          console.error("Error al cargar tipos de proceso:", response.status)
        }
      } catch (err) {
        console.error("Error al cargar tipos de proceso:", err)
      } finally {
        setLoadingTrialTypes(false)
      }
    }

    loadTrialTypes()
  }, [])

  useEffect(() => {
    const loadDescriptionActions = async () => {
      setLoadingDescriptionActions(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/action/description-actions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setDescriptionActions(data.descriptionActions || [])
        } else {
          console.error("Error al cargar descripciones:", response.status)
          setDescriptionActions([])
        }
      } catch (err) {
        console.error("Error al cargar descripciones:", err)
        setDescriptionActions([])
      } finally {
        setLoadingDescriptionActions(false)
      }
    }

    loadDescriptionActions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.description.trim()) {
      setError("La descripción es requerida")
      return
    }

    if (!formData.typeActionId) {
      setError("Debes seleccionar un tipo de acción")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      // Si estamos editando, usar el endpoint de edición
      if (editingDescription) {
        const response = await fetch(
          `${API_URL}/action/description-action/edit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              id: editingDescription.id,
              description: formData.description.trim(),
              typeActionId: formData.typeActionId,
              typeTrialId: formData.typeTrialId || null,
            }),
          }
        )

        const data = await response.json()

        if (response.ok) {
          const reloadResponse = await fetch(
            `${API_URL}/action/description-actions`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          )
          if (reloadResponse.ok) {
            const reloadData = await reloadResponse.json()
            setDescriptionActions(reloadData.descriptionActions || [])
          }
          
          setFormData({ description: "", typeActionId: "", typeTrialId: "" })
          setEditingDescription(null)
          setShowForm(false)
          setError("")
          setErrorDialog({
            open: true,
            title: "Éxito",
            message: data.message || "Descripción actualizada correctamente"
          })
        } else {
          setError(data.message || "Error al actualizar la descripción")
        }
      } else {
        // Crear nueva descripción
        const response = await fetch(`${API_URL}/action/description-action/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            description: formData.description.trim(),
            typeActionId: formData.typeActionId,
            typeTrialId: formData.typeTrialId || null,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          const reloadResponse = await fetch(
            `${API_URL}/action/description-actions`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          )
          if (reloadResponse.ok) {
            const reloadData = await reloadResponse.json()
            setDescriptionActions(reloadData.descriptionActions || [])
          }
          
          setFormData({ description: "", typeActionId: "", typeTrialId: "" })
          setShowForm(false)
          setError("")
        } else {
          setError(data.message || "Error al crear la descripción")
        }
      }
    } catch (err) {
      console.error("Error al guardar descripción:", err)
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (desc: DescriptionAction) => {
    setEditingDescription(desc)
    setFormData({
      description: desc.description,
      typeActionId: desc.typeAction.id,
      typeTrialId: desc.typeTrial?.id || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta descripción?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/action/description-action/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (response.ok) {
        const reloadResponse = await fetch(
          `${API_URL}/action/description-actions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json()
          setDescriptionActions(reloadData.descriptionActions || [])
        }
      } else {
        const data = await response.json()
        setErrorDialog({
          open: true,
          title: "Error al eliminar la descripción",
          message: data.message || "Ocurrió un error al intentar eliminar la descripción. Por favor intente nuevamente."
        })
      }
    } catch (err) {
      console.error("Error al eliminar descripción:", err)
      setErrorDialog({
        open: true,
        title: "Error de conexión",
        message: "Error al conectar con el servidor. Por favor intente nuevamente."
      })
    }
  }

  const filteredDescripciones = descriptionActions.filter((d) => {
    return (
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.typeAction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <>
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-2 ${errorDialog.title === "Éxito" ? "text-green-600" : "text-red-600"}`}>
              {errorDialog.title === "Éxito" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {errorDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setErrorDialog({ ...errorDialog, open: false })}
              className={errorDialog.title === "Éxito" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Descripciones de Actuaciones</h2>
          <Button
            onClick={() => {
              if (showForm && editingDescription) {
                setEditingDescription(null)
              }
              setShowForm(!showForm)
              if (!showForm) {
                setFormData({ description: "", typeActionId: "", typeTrialId: "" })
                setError("")
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nueva Descripción"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            {editingDescription && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">Modo edición</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Actuación <span className="text-red-500">*</span>
                </label>
                {loadingTypeActions ? (
                  <p className="text-sm text-slate-500">Cargando tipos de acción...</p>
                ) : (
                  <ToggleGroup
                    type="single"
                    value={formData.typeActionId}
                    onValueChange={(value) => {
                      if (value) {
                        setFormData({ ...formData, typeActionId: value })
                        setError("")
                      }
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <ToggleGroupItem
                      value={autoTypeId}
                      aria-label="Auto"
                      className="flex-1 text-base font-medium data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:hover:bg-blue-700"
                      disabled={!autoTypeId}
                    >
                      Auto
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={sentenciaTypeId}
                      aria-label="Sentencia"
                      className="flex-1 text-base font-medium data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:hover:bg-blue-700"
                      disabled={!sentenciaTypeId}
                    >
                      Sentencia
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Proceso (Opcional)
                </label>
                {loadingTrialTypes ? (
                  <p className="text-sm text-slate-500">Cargando tipos de proceso...</p>
                ) : (
                  <select
                    value={formData.typeTrialId}
                    onChange={(e) => setFormData({ ...formData, typeTrialId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas (Descripción general)</option>
                    {trialTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Si no seleccionas un tipo, la descripción será válida para todos los tipos de proceso
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción detallada de la actuación"
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : editingDescription ? "Actualizar Descripción" : "Guardar Descripción"}
            </Button>
          </form>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {loadingDescriptionActions ? (
            <div className="text-center py-8 text-slate-500">Cargando descripciones...</div>
          ) : filteredDescripciones.length > 0 ? (
            filteredDescripciones.map((desc) => (
              <div key={desc.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {desc.typeAction.description}
                      </span>
                      {desc.typeTrial && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          {desc.typeTrial.name}
                        </span>
                      )}
                      {!desc.typeTrial && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                          General
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{desc.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(desc)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(desc.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? "No se encontraron descripciones" : "No hay descripciones registradas"}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
