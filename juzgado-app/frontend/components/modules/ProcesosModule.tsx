"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { handleNameChange } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Category {
  id: string
  description: string
}

interface Person {
  id: string
  name: string
  document: string
  documentType: string
}

interface TrialType {
  id: string
  name: string
}

interface TrialFromBackend {
  id: string
  number: string
  arrivalDate: string
  typeTrial: {
    id: string
    name: string
  }
  category?: {
    id: string
    description: string
  } | null
  plaintiff: {
    id: string
    name: string
    document: string
  }
  defendant: {
    id: string
    name: string
    document: string
  }
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
}

export default function ProcesosModule() {
  const { procesos, addProceso, deleteProceso } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [trials, setTrials] = useState<TrialFromBackend[]>([])
  const [loadingTrials, setLoadingTrials] = useState(false)
  const [trialTypes, setTrialTypes] = useState<TrialType[]>([])
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [entryTypes, setEntryTypes] = useState<{ id: string; description: string }[]>([])
  const [loadingEntryTypes, setLoadingEntryTypes] = useState(false)
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    fecha: "",
    categoria: "",
    categoriaDescripcion: "",
    entryTypeId: "",
    plaintiffId: "",
    plaintiffName: "",
    defendantId: "",
    defendantName: "",
  })
  const [plaintiffSearch, setPlaintiffSearch] = useState("")
  const [defendantSearch, setDefendantSearch] = useState("")
  const [plaintiffResults, setPlaintiffResults] = useState<Person[]>([])
  const [defendantResults, setDefendantResults] = useState<Person[]>([])
  const [showPlaintiffResults, setShowPlaintiffResults] = useState(false)
  const [showDefendantResults, setShowDefendantResults] = useState(false)
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [errorDialog, setErrorDialog] = useState({ open: false, title: "", message: "" })
  const [editingTrial, setEditingTrial] = useState<TrialFromBackend | null>(null)
  const [observingTrial, setObservingTrial] = useState<TrialFromBackend | null>(null)
  const [trialActions, setTrialActions] = useState<Action[]>([])
  const [loadingActions, setLoadingActions] = useState(false)

  useEffect(() => {
    const loadTrialTypes = async () => {
      setLoadingTypes(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:4000/trial/types`,
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
          console.log("Tipos de proceso recibidos:", data)
          setTrialTypes(data.types || [])
          if (data.types && data.types.length > 0 && !formData.tipo) {
            setFormData((prev) => ({ ...prev, tipo: data.types[0].name }))
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error en respuesta:", response.status, errorData)
          setTrialTypes([])
        }
      } catch (err) {
        console.error("Error al cargar tipos de proceso:", err)
        setTrialTypes([])
      } finally {
        setLoadingTypes(false)
      }
    }

    loadTrialTypes()
  }, [])

  // Cargar tipos de entrada desde el backend
  useEffect(() => {
    const loadEntryTypes = async () => {
      setLoadingEntryTypes(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:4000/trial/entry-types`,
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
          console.log("Tipos de entrada recibidos:", data)
          setEntryTypes(data.entryTypes || [])
          if (data.entryTypes && data.entryTypes.length > 0 && !formData.entryTypeId) {
            setFormData((prev) => ({ ...prev, entryTypeId: data.entryTypes[0].id }))
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error en respuesta:", response.status, errorData)
          setEntryTypes([])
        }
      } catch (err) {
        console.error("Error al cargar tipos de entrada:", err)
        setEntryTypes([])
      } finally {
        setLoadingEntryTypes(false)
      }
    }

    loadEntryTypes()
  }, [])

  useEffect(() => {
    const loadTrials = async () => {
      setLoadingTrials(true)
      try {
        const token = localStorage.getItem("token")
        const params = new URLSearchParams()
        if (searchTerm) params.append("searchTerm", searchTerm)
        if (filterType) params.append("filterType", filterType)

        const response = await fetch(
          `http://localhost:4000/trial/search?${params.toString()}`,
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
          console.log("Procesos recibidos:", data)
          setTrials(data.trials || [])
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error en respuesta:", response.status, errorData)
          setTrials([])
        }
      } catch (err) {
        console.error("Error al cargar procesos:", err)
        setTrials([])
      } finally {
        setLoadingTrials(false)
      }
    }

    const timeoutId = setTimeout(() => {
      loadTrials()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, filterType])

  useEffect(() => {
    const loadCategories = async () => {
      if (!formData.tipo) {
        setCategories([])
        return
      }

      const selectedTypeTrial = trialTypes.find(t => t.name === formData.tipo)
      const isPagoPorConsignacion = selectedTypeTrial?.name.toLowerCase() === "pagos por consignación" || selectedTypeTrial?.name.toLowerCase() === "pagos por consignacion"
      
      if (isPagoPorConsignacion) {
        setCategories([])
        setFormData((prev) => ({ ...prev, categoria: "", categoriaDescripcion: "" }))
        return
      }

      setLoadingCategories(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:4000/trial/categories?trialType=${encodeURIComponent(formData.tipo)}`,
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
          console.log("Categorías recibidas:", data)
          setCategories(data.categories || [])
          setFormData((prev) => ({ ...prev, categoria: "", categoriaDescripcion: "" }))
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error en respuesta:", response.status, errorData)
          setCategories([])
        }
      } catch (err) {
        console.error("Error al cargar categorías:", err)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [formData.tipo, trialTypes])

  useEffect(() => {
    const searchPeople = async () => {
      if (plaintiffSearch.trim().length < 2) {
        setPlaintiffResults([])
        setShowPlaintiffResults(false)
        return
      }

      setLoadingPeople(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:4000/people/search?searchTerm=${encodeURIComponent(plaintiffSearch)}`,
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
          setPlaintiffResults(data.people || [])
          setShowPlaintiffResults(true)
        } else {
          setPlaintiffResults([])
        }
      } catch (err) {
        console.error("Error al buscar personas:", err)
        setPlaintiffResults([])
      } finally {
        setLoadingPeople(false)
      }
    }

    const timeoutId = setTimeout(() => {
      searchPeople()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [plaintiffSearch])

  useEffect(() => {
    const searchPeople = async () => {
      if (defendantSearch.trim().length < 2) {
        setDefendantResults([])
        setShowDefendantResults(false)
        return
      }

      setLoadingPeople(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:4000/people/search?searchTerm=${encodeURIComponent(defendantSearch)}`,
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
          setDefendantResults(data.people || [])
          setShowDefendantResults(true)
        } else {
          setDefendantResults([])
        }
      } catch (err) {
        console.error("Error al buscar personas:", err)
        setDefendantResults([])
      } finally {
        setLoadingPeople(false)
      }
    }

    const timeoutId = setTimeout(() => {
      searchPeople()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [defendantSearch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedTypeTrial = trialTypes.find(t => t.name === formData.tipo)
    const isPagoPorConsignacion = selectedTypeTrial?.name.toLowerCase() === "pagos por consignación" || selectedTypeTrial?.name.toLowerCase() === "pagos por consignacion"
    
    if (!formData.numero || !formData.fecha || !formData.plaintiffId || !formData.defendantId || !formData.tipo) {
      setErrorDialog({
        open: true,
        title: "Campos incompletos",
        message: "Por favor complete todos los campos requeridos"
      })
      return
    }

    const selectedDate = new Date(formData.fecha)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate > today) {
      setErrorDialog({
        open: true,
        title: "Fecha inválida",
        message: "La fecha de entrada del proceso no puede ser futura. Por favor seleccione una fecha igual o anterior a la fecha actual."
      })
      return
    }

    if (!isPagoPorConsignacion && !formData.categoria) {
      setErrorDialog({
        open: true,
        title: "Campos incompletos",
        message: "La categoría es requerida para este tipo de proceso"
      })
      return
    }

    try {
      if (!selectedTypeTrial) {
        setErrorDialog({
          open: true,
          title: "Tipo de proceso inválido",
          message: "El tipo de proceso seleccionado no es válido"
        })
        return
      }

      const token = localStorage.getItem("token")
      if (editingTrial) {
        const response = await fetch("http://localhost:4000/trial/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            id: editingTrial.id,
            typeTrialId: selectedTypeTrial.id,
            categoryId: isPagoPorConsignacion ? null : formData.categoria,
            plaintiffId: formData.plaintiffId,
            defendantId: formData.defendantId,
            arrivalDate: new Date(formData.fecha).toISOString(),
            status: "PRIMERA_INSTANCIA", // Mantener el estado actual o permitir cambiarlo
            entryTypeId: formData.entryTypeId,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setErrorDialog({
            open: true,
            title: "Éxito",
            message: data.message || "Proceso actualizado correctamente"
          })
          
          // Recargar la lista
          const params = new URLSearchParams()
          if (searchTerm) params.append("searchTerm", searchTerm)
          if (filterType) params.append("filterType", filterType)
          
          const trialsResponse = await fetch(
            `http://localhost:4000/trial/search?${params.toString()}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          )
          
          if (trialsResponse.ok) {
            const trialsData = await trialsResponse.json()
            setTrials(trialsData.trials || [])
          }

          // Limpiar formulario
          const defaultType = trialTypes.length > 0 ? trialTypes[0].name : ""
          setFormData({ 
            numero: "", 
            tipo: defaultType, 
            fecha: "", 
            categoria: "", 
            categoriaDescripcion: "", 
            entryTypeId: entryTypes.length > 0 ? entryTypes[0].id : "",
            plaintiffId: "",
            plaintiffName: "",
            defendantId: "",
            defendantName: "",
          })
          setPlaintiffSearch("")
          setDefendantSearch("")
          setEditingTrial(null)
          setShowForm(false)
          return
        } else {
          const errorData = await response.json().catch(() => ({}))
          setErrorDialog({
            open: true,
            title: "Error al actualizar el proceso",
            message: errorData.message || "Ocurrió un error al intentar actualizar el proceso. Por favor intente nuevamente."
          })
          return
        }
      }

      // Si no estamos editando, crear nuevo proceso
      const response = await fetch("http://localhost:4000/trial/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          number: formData.numero,
          typeTrialId: selectedTypeTrial.id,
          categoryId: isPagoPorConsignacion ? null : formData.categoria,
          plaintiffId: formData.plaintiffId,
          defendantId: formData.defendantId,
          arrivalDate: new Date(formData.fecha).toISOString(),
          status: "PRIMERA_INSTANCIA",
          entryTypeId: formData.entryTypeId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Proceso creado:", data)
        
        const params = new URLSearchParams()
        if (searchTerm) params.append("searchTerm", searchTerm)
        if (filterType) params.append("filterType", filterType)
        
        const trialsResponse = await fetch(
          `http://localhost:4000/trial/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )
        
        if (trialsResponse.ok) {
          const trialsData = await trialsResponse.json()
          setTrials(trialsData.trials || [])
        }

        const defaultType = trialTypes.length > 0 ? trialTypes[0].name : ""
        setFormData({ 
          numero: "", 
          tipo: defaultType, 
          fecha: "", 
          categoria: "", 
          categoriaDescripcion: "", 
          entryTypeId: entryTypes.length > 0 ? entryTypes[0].id : "",
          plaintiffId: "",
          plaintiffName: "",
          defendantId: "",
          defendantName: "",
        })
        setPlaintiffSearch("")
        setDefendantSearch("")
        setEditingTrial(null)
        setShowForm(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setErrorDialog({
          open: true,
          title: "Error al crear el proceso",
          message: errorData.message || "Ocurrió un error al intentar crear el proceso. Por favor intente nuevamente."
        })
      }
    } catch (err) {
      console.error("Error al crear proceso:", err)
      setErrorDialog({
        open: true,
        title: "Error de conexión",
        message: "Error al crear el proceso. Por favor intente nuevamente."
      })
    }
  }

  const handleEdit = (trial: TrialFromBackend) => {
    setEditingTrial(trial)
    setFormData({
      numero: trial.number,
      tipo: trial.typeTrial.name,
      fecha: new Date(trial.arrivalDate).toISOString().split('T')[0],
      categoria: trial.category?.id || "",
      categoriaDescripcion: trial.category?.description || "",
      entryTypeId: "", // Necesitaríamos cargar esto desde el backend
      plaintiffId: trial.plaintiff.id,
      plaintiffName: trial.plaintiff.name,
      defendantId: trial.defendant.id,
      defendantName: trial.defendant.name,
    })
    setPlaintiffSearch(trial.plaintiff.name)
    setDefendantSearch(trial.defendant.name)
    setShowForm(true)
  }

  const handleObserve = async (trial: TrialFromBackend) => {
    setObservingTrial(trial)
    setLoadingActions(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:4000/action/trial/${trial.id}`,
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
        setTrialActions(data.actions || [])
      } else {
        setTrialActions([])
        setErrorDialog({
          open: true,
          title: "Error",
          message: "No se pudieron cargar las actuaciones del proceso"
        })
      }
    } catch (err) {
      console.error("Error al cargar actuaciones:", err)
      setTrialActions([])
      setErrorDialog({
        open: true,
        title: "Error de conexión",
        message: "Error al cargar las actuaciones. Por favor intente nuevamente."
      })
    } finally {
      setLoadingActions(false)
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

  const mapTypeName = (dbName: string): string => {
    return dbName
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
              onClick={() => setErrorDialog({ ...errorDialog, open: false })}
              className={errorDialog.title === "Éxito" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={observingTrial !== null} onOpenChange={(open) => !open && setObservingTrial(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Actuaciones del Proceso: {observingTrial?.number}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Tipo: {observingTrial && mapTypeName(observingTrial.typeTrial.name)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {loadingActions ? (
              <div className="text-center py-8 text-slate-500">Cargando actuaciones...</div>
            ) : trialActions.length > 0 ? (
              <div className="space-y-4">
                {trialActions.map((action) => (
                  <div key={action.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                            {action.descriptionAction.typeAction.description}
                          </span>
                          <span className="text-sm text-slate-500">
                            {formatDate(action.date)}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{action.descriptionAction.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No hay actuaciones registradas para este proceso
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Procesos</h2>
          <Button
            onClick={() => {
              if (showForm && editingTrial) {
                setEditingTrial(null)
              }
              setShowForm(!showForm)
              if (!showForm) {
                const defaultType = trialTypes.length > 0 ? trialTypes[0].name : ""
                setFormData({ 
                  numero: "", 
                  tipo: defaultType, 
                  fecha: "", 
                  categoria: "", 
                  categoriaDescripcion: "", 
                  entryTypeId: entryTypes.length > 0 ? entryTypes[0].id : "",
                  plaintiffId: "",
                  plaintiffName: "",
                  defendantId: "",
                  defendantName: "",
                })
                setPlaintiffSearch("")
                setDefendantSearch("")
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nuevo Proceso"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            {editingTrial && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">Modo edición: {editingTrial.number}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Número de Proceso</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => {
                    if (!editingTrial) {
                      const value = e.target.value.replace(/\D/g, '')
                      let formattedValue = value
                      if (value.length > 4) {
                        formattedValue = value.slice(0, 4) + '-' + value.slice(4)
                      }
                      
                      setFormData({ ...formData, numero: formattedValue })
                    }
                  }}
                  placeholder="Ej: 2024-001"
                  maxLength={10}
                  disabled={!!editingTrial}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                {editingTrial && (
                  <p className="text-xs text-slate-500 mt-1">El número de proceso no se puede modificar</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo {loadingTypes && "(Cargando...)"}
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingTypes || trialTypes.length === 0}
                >
                  <option value="">
                    {loadingTypes ? "Cargando tipos..." : trialTypes.length === 0 ? "No hay tipos disponibles" : "Seleccione un tipo"}
                  </option>
                  {trialTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value
                    const today = new Date().toISOString().split('T')[0]
                    if (selectedDate <= today) {
                      setFormData({ ...formData, fecha: selectedDate })
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(() => {
                const selectedTypeTrial = trialTypes.find(t => t.name === formData.tipo)
                const isPagoPorConsignacion = selectedTypeTrial?.name.toLowerCase() === "pagos por consignación" || selectedTypeTrial?.name.toLowerCase() === "pagos por consignacion"
                
                if (isPagoPorConsignacion) {
                  return null
                }
                
                return (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría <span className="text-red-500">*</span> {loadingCategories && "(Cargando...)"}
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => {
                        const selectedCategory = categories.find(cat => cat.id === e.target.value)
                        setFormData({ 
                          ...formData, 
                          categoria: e.target.value,
                          categoriaDescripcion: selectedCategory?.description || ""
                        })
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loadingCategories || categories.length === 0}
                      required
                    >
                      <option value="">
                        {loadingCategories 
                          ? "Cargando categorías..." 
                          : categories.length === 0 && formData.tipo
                          ? "No hay categorías disponibles para este tipo" 
                          : categories.length === 0
                          ? "Seleccione un tipo primero" 
                          : "Seleccione una categoría"}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })()}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Entrada {loadingEntryTypes && "(Cargando...)"}
                </label>
                <select
                  value={formData.entryTypeId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryTypeId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingEntryTypes || entryTypes.length === 0}
                >
                  <option value="">
                    {loadingEntryTypes ? "Cargando tipos..." : entryTypes.length === 0 ? "No hay tipos disponibles" : "Seleccione un tipo"}
                  </option>
                  {entryTypes.map((entryType) => (
                    <option key={entryType.id} value={entryType.id}>
                      {entryType.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Demandante</label>
                <input
                  type="text"
                  value={plaintiffSearch}
                  onChange={(e) => {
                    const value = e.target.value
                    const filteredValue = /^\d/.test(value) 
                      ? value.replace(/\D/g, '') 
                      : handleNameChange(value)
                    setPlaintiffSearch(filteredValue)
                    if (!filteredValue) {
                      setFormData({ ...formData, plaintiffId: "", plaintiffName: "" })
                    }
                  }}
                  onFocus={() => {
                    if (plaintiffResults.length > 0) setShowPlaintiffResults(true)
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowPlaintiffResults(false), 200)
                  }}
                  placeholder="Buscar por nombre o documento..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showPlaintiffResults && plaintiffResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {plaintiffResults.map((person) => (
                      <div
                        key={person.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setFormData({
                            ...formData,
                            plaintiffId: person.id,
                            plaintiffName: person.name,
                          })
                          setPlaintiffSearch(person.name)
                          setShowPlaintiffResults(false)
                        }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-slate-900">{person.name}</div>
                        <div className="text-sm text-slate-500">
                          {person.documentType}: {person.document}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {formData.plaintiffName && (
                  <div className="mt-1 text-sm text-green-600">
                    Seleccionado: {formData.plaintiffName}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Demandado</label>
                <input
                  type="text"
                  value={defendantSearch}
                  onChange={(e) => {
                    const value = e.target.value
                    const filteredValue = /^\d/.test(value) 
                      ? value.replace(/\D/g, '') 
                      : handleNameChange(value)
                    setDefendantSearch(filteredValue)
                    if (!filteredValue) {
                      setFormData({ ...formData, defendantId: "", defendantName: "" })
                    }
                  }}
                  onFocus={() => {
                    if (defendantResults.length > 0) setShowDefendantResults(true)
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDefendantResults(false), 200)
                  }}
                  placeholder="Buscar por nombre o documento..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showDefendantResults && defendantResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {defendantResults.map((person) => (
                      <div
                        key={person.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setFormData({
                            ...formData,
                            defendantId: person.id,
                            defendantName: person.name,
                          })
                          setDefendantSearch(person.name)
                          setShowDefendantResults(false)
                        }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-slate-900">{person.name}</div>
                        <div className="text-sm text-slate-500">
                          {person.documentType}: {person.document}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {formData.defendantName && (
                  <div className="mt-1 text-sm text-green-600">
                    Seleccionado: {formData.defendantName}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
            >
              {editingTrial ? "Actualizar Proceso" : "Guardar Proceso"}
            </Button>
          </form>
        )}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por número o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingTypes || trialTypes.length === 0}
          >
            <option value="">Todos los tipos</option>
            {trialTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Número</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Tipo</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Categoría</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingTrials ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Cargando procesos...
                  </td>
                </tr>
              ) : trials.length > 0 ? (
                trials.map((trial) => (
                  <tr key={trial.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{trial.number}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {mapTypeName(trial.typeTrial.name)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(trial.arrivalDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {trial.category?.description || (trial.typeTrial.name.toLowerCase() === "pagos por consignación" || trial.typeTrial.name.toLowerCase() === "pagos por consignacion" ? "N/A" : "-")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(trial)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleObserve(trial)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Observar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    {searchTerm || filterType ? "No se encontraron procesos con los filtros aplicados" : "No hay procesos registrados"}
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
