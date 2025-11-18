"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { handleProcessNumberChange } from "@/lib/utils"
import { API_URL } from "@/lib/config"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Trial {
  id: string
  number: string
  typeTrial: {
    id: string
    name: string
  }
}

interface TypeAction {
  id: string
  description: string
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

interface Action {
  id: string
  date: string
  descriptionAction: {
    id: string
    description: string
    typeAction: {
      id: string
      description: string
    }
  }
  trial: {
    id: string
    number: string
    typeTrial: {
      id: string
      name: string
    }
  }
}

export default function ActuacionesModule() {
  const [showForm, setShowForm] = useState(false)
  const [trials, setTrials] = useState<Trial[]>([])
  const [loadingTrials, setLoadingTrials] = useState(false)
  const [actions, setActions] = useState<Action[]>([])
  const [loadingActions, setLoadingActions] = useState(false)
  const [descriptionActions, setDescriptionActions] = useState<DescriptionAction[]>([])
  const [loadingDescriptionActions, setLoadingDescriptionActions] = useState(false)
  const [autoTypeId, setAutoTypeId] = useState<string>("")
  const [sentenciaTypeId, setSentenciaTypeId] = useState<string>("")
  const [loadingTypeActions, setLoadingTypeActions] = useState(false)
  const [trialSearchTerm, setTrialSearchTerm] = useState("")
  const [showTrialResults, setShowTrialResults] = useState(false)
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null)
  const [errorDialog, setErrorDialog] = useState({ open: false, title: "", message: "" })
  const [editingAction, setEditingAction] = useState<Action | null>(null)
  const [formData, setFormData] = useState({
    trialId: "",
    fecha: "",
    descriptionActionId: "",
    typeActionId: "",
    status: "",
    closeDate: "",
  })
  const [changeStatus, setChangeStatus] = useState(false)

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
    if (!trialSearchTerm.trim()) {
      setTrials([])
      setShowTrialResults(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoadingTrials(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/trial/search?searchTerm=${encodeURIComponent(trialSearchTerm)}`,
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
          setTrials(data.trials || [])
          setShowTrialResults(true)
        } else {
          setTrials([])
        }
      } catch (err) {
        console.error("Error al buscar procesos:", err)
        setTrials([])
      } finally {
        setLoadingTrials(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [trialSearchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".trial-search-container")) {
        setShowTrialResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const loadDescriptionActions = async () => {
      setLoadingDescriptionActions(true)
      try {
        const token = localStorage.getItem("token")
        // Si hay un proceso seleccionado, filtrar por su tipo de proceso
        const url = selectedTrial 
          ? `${API_URL}/action/description-actions?typeTrialId=${selectedTrial.typeTrial.id}`
          : `${API_URL}/action/description-actions`
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })

        if (response.ok) {
          const data = await response.json()
          setDescriptionActions(data.descriptionActions || [])
        } else {
          console.error("Error al cargar descripciones de acciones:", response.status)
          setDescriptionActions([])
        }
      } catch (err) {
        console.error("Error al cargar descripciones de acciones:", err)
        setDescriptionActions([])
      } finally {
        setLoadingDescriptionActions(false)
      }
    }

    loadDescriptionActions()
  }, [selectedTrial])

  useEffect(() => {
    const loadActions = async () => {
      setLoadingActions(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/action/search`,
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
          setActions(data.actions || [])
        } else {
          console.error("Error al cargar actuaciones:", response.status)
          setActions([])
        }
      } catch (err) {
        console.error("Error al cargar actuaciones:", err)
        setActions([])
      } finally {
        setLoadingActions(false)
      }
    }

    loadActions()
  }, [])

  const handleTrialSelect = (trial: Trial) => {
    setSelectedTrial(trial)
    setFormData({ ...formData, trialId: trial.id, descriptionActionId: "", typeActionId: "" })
    setTrialSearchTerm(trial.number)
    setShowTrialResults(false)
  }

  const filteredDescriptionActions = formData.typeActionId
    ? descriptionActions.filter((desc) => desc.typeAction.id === formData.typeActionId)
    : []

  const handleEdit = (action: Action) => {
    setEditingAction(action)
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const dateObj = new Date(action.date)
    const formattedDate = dateObj.toISOString().split('T')[0]
    
    setFormData({
      trialId: action.trial.id,
      fecha: formattedDate,
      descriptionActionId: action.descriptionAction.id,
      typeActionId: action.descriptionAction.typeAction.id,
      status: "",
      closeDate: "",
    })
    setTrialSearchTerm(action.trial.number)
    setSelectedTrial({
      id: action.trial.id,
      number: action.trial.number,
      typeTrial: {
        id: action.trial.typeTrial.id || "",
        name: action.trial.typeTrial.name
      }
    })
    setChangeStatus(false)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.trialId || !formData.fecha || !formData.descriptionActionId) {
      setErrorDialog({
        open: true,
        title: "Campos incompletos",
        message: "Por favor completa todos los campos requeridos"
      })
      return
    }

    // Validar que si se cambia el estado y es ARCHIVADO, tenga fecha de cierre
    if (changeStatus && formData.status === "ARCHIVADO" && !formData.closeDate) {
      setErrorDialog({
        open: true,
        title: "Fecha de cierre requerida",
        message: "Si el estado es ARCHIVADO, debes seleccionar una fecha de cierre"
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      
      // Si estamos editando, usar el endpoint de edición
      if (editingAction) {
        const response = await fetch(
          `${API_URL}/action/edit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              id: editingAction.id,
              descriptionActionId: formData.descriptionActionId,
              date: new Date(formData.fecha).toISOString(),
              trialId: formData.trialId,
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          setErrorDialog({
            open: true,
            title: "Éxito",
            message: data.message || "Actuación actualizada correctamente"
          })
          setFormData({ trialId: "", fecha: "", descriptionActionId: "", typeActionId: "", status: "", closeDate: "" })
          setChangeStatus(false)
          setTrialSearchTerm("")
          setSelectedTrial(null)
          setEditingAction(null)
          setShowForm(false)
          
          const loadActions = async () => {
            const token = localStorage.getItem("token")
            const response = await fetch(
              `${API_URL}/action/search`,
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
              setActions(data.actions || [])
            }
          }
          loadActions()
        } else {
          const errorData = await response.json().catch(() => ({}))
          setErrorDialog({
            open: true,
            title: "Error al actualizar la actuación",
            message: errorData.message || "Ocurrió un error al intentar actualizar la actuación. Por favor intente nuevamente."
          })
        }
      } else {
        // Crear nueva actuación
        const actionId = crypto.randomUUID()
        
        const requestBody: any = {
          id: actionId,
          descriptionActionId: formData.descriptionActionId,
          date: new Date(formData.fecha).toISOString(),
          trialId: formData.trialId,
        }

        // Si se marca cambiar estado, incluir status y closeDate si es ARCHIVADO
        if (changeStatus && formData.status) {
          requestBody.status = formData.status
          if (formData.status === "ARCHIVADO" && formData.closeDate) {
            requestBody.closeDate = new Date(formData.closeDate).toISOString()
          }
        }
        
        const response = await fetch(
          `${API_URL}/action/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(requestBody),
          }
        )

        if (response.ok) {
          const data = await response.json()
          setErrorDialog({
            open: true,
            title: "Éxito",
            message: data.message || "Actuación creada correctamente"
          })
          setFormData({ trialId: "", fecha: "", descriptionActionId: "", typeActionId: "", status: "", closeDate: "" })
          setChangeStatus(false)
          setTrialSearchTerm("")
          setSelectedTrial(null)
          setShowForm(false)
          const loadActions = async () => {
            const token = localStorage.getItem("token")
            const response = await fetch(
              `${API_URL}/action/search`,
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
              setActions(data.actions || [])
            }
          }
          loadActions()
        } else {
          const errorData = await response.json().catch(() => ({}))
          setErrorDialog({
            open: true,
            title: "Error al crear la actuación",
            message: errorData.message || "Ocurrió un error al intentar crear la actuación. Por favor intente nuevamente."
          })
        }
      }
    } catch (err) {
      console.error("Error al guardar actuación:", err)
      setErrorDialog({
        open: true,
        title: "Error de conexión",
        message: "Error al guardar la actuación. Por favor intente nuevamente."
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta actuación?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${API_URL}/action/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setErrorDialog({
          open: true,
          title: "Éxito",
          message: data.message || "Actuación eliminada correctamente"
        })
        setActions(actions.filter((action) => action.id !== id))
      } else {
        const errorData = await response.json().catch(() => ({}))
        setErrorDialog({
          open: true,
          title: "Error al eliminar la actuación",
          message: errorData.message || "Ocurrió un error al intentar eliminar la actuación. Por favor intente nuevamente."
        })
      }
    } catch (err) {
      console.error("Error al eliminar actuación:", err)
      setErrorDialog({
        open: true,
        title: "Error de conexión",
        message: "Error al eliminar la actuación. Por favor intente nuevamente."
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

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
              onClick={() => {
                setErrorDialog({ ...errorDialog, open: false })
                if (errorDialog.title === "Éxito") {
                  setFormData({ trialId: "", fecha: "", descriptionActionId: "", typeActionId: "", status: "", closeDate: "" })
                  setChangeStatus(false)
                  setTrialSearchTerm("")
                  setSelectedTrial(null)
                  setShowForm(false)
                }
              }}
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
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Actuaciones</h2>
          <Button
            onClick={() => {
              if (showForm && editingAction) {
                setEditingAction(null)
              }
              setShowForm(!showForm)
              if (!showForm) {
                setFormData({ trialId: "", fecha: "", descriptionActionId: "", typeActionId: "", status: "", closeDate: "" })
                setChangeStatus(false)
                setTrialSearchTerm("")
                setSelectedTrial(null)
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nueva Actuación"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            {editingAction && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">Modo edición</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative trial-search-container">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Proceso
                </label>
                <input
                  type="text"
                  value={trialSearchTerm}
                  onChange={(e) => {
                    const formattedValue = handleProcessNumberChange(e.target.value)
                    setTrialSearchTerm(formattedValue)
                    setShowTrialResults(true)
                    if (!formattedValue) {
                      setSelectedTrial(null)
                      setFormData({ ...formData, trialId: "" })
                    }
                  }}
                  onFocus={() => {
                    if (trials.length > 0) setShowTrialResults(true)
                  }}
                  placeholder="Buscar por número de proceso (ej: 2024-00123)"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {loadingTrials && (
                  <p className="text-xs text-slate-500 mt-1">Buscando...</p>
                )}
                {showTrialResults && trials.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {trials.map((trial) => (
                      <div
                        key={trial.id}
                        onClick={() => handleTrialSelect(trial)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-slate-900">{trial.number}</div>
                        <div className="text-sm text-slate-600">{trial.typeTrial.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                {showTrialResults && !loadingTrials && trialSearchTerm && trials.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-4 text-center text-slate-500">
                    No se encontraron procesos
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
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
                        setFormData({ ...formData, typeActionId: value, descriptionActionId: "" })
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

              {formData.typeActionId && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de la Acción <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.descriptionActionId}
                    onChange={(e) => setFormData({ ...formData, descriptionActionId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={filteredDescriptionActions.length === 0}
                  >
                    <option value="">
                      {filteredDescriptionActions.length === 0
                        ? "No hay descripciones disponibles para este tipo"
                        : "Seleccionar descripción..."}
                    </option>
                    {filteredDescriptionActions.map((desc) => (
                      <option key={desc.id} value={desc.id}>
                        {desc.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="changeStatus"
                    checked={changeStatus}
                    onChange={(e) => {
                      setChangeStatus(e.target.checked)
                      if (!e.target.checked) {
                        setFormData({ ...formData, status: "", closeDate: "" })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="changeStatus" className="text-sm font-medium text-slate-700">
                    Cambiar estado del proceso
                  </label>
                </div>
              </div>

              {changeStatus && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          status: e.target.value,
                          closeDate: e.target.value !== "ARCHIVADO" ? "" : formData.closeDate
                        })
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={changeStatus}
                    >
                      <option value="">Seleccionar estado...</option>
                      <option value="PRIMERA_INSTANCIA">Primera Instancia</option>
                      <option value="SEGUNDA_INSTANCIA">Segunda Instancia</option>
                      <option value="ARCHIVADO">Archivado</option>
                    </select>
                  </div>

                  {formData.status === "ARCHIVADO" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fecha de Cierre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.closeDate}
                        onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={formData.status === "ARCHIVADO"}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

                        <Button
                          type="submit"
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
                        >
                          {editingAction ? "Actualizar Actuación" : "Guardar Actuación"}
                        </Button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Proceso</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Tipo</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Descripción</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingActions ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Cargando actuaciones...
                  </td>
                </tr>
              ) : actions.length > 0 ? (
                actions.map((action) => (
                  <tr key={action.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {action.trial?.number || "N/A"} - {action.trial?.typeTrial?.name || ""}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(action.date)}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        {action.descriptionAction?.typeAction?.description || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {action.descriptionAction?.description || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(action)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(action.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No hay actuaciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}
