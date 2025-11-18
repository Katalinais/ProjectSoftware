"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { handleNameChange } from "@/lib/utils"
import { API_URL } from "@/lib/config"

interface PersonaFromBackend {
  id: string
  name: string
  documentType: string
  document: string
}

export default function PersonasModule() {
  const { personas, addPersona, deletePersona } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<PersonaFromBackend[]>([])
  const [editingPerson, setEditingPerson] = useState<PersonaFromBackend | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    tipoDocumento: "Cédula" as "Cédula" | "NIT",
    numeroDocumento: "",
  })

  const handleEdit = (persona: PersonaFromBackend) => {
    setEditingPerson(persona)
    setFormData({
      nombre: persona.name,
      tipoDocumento: persona.documentType as "Cédula" | "NIT",
      numeroDocumento: persona.document,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (formData.nombre && formData.numeroDocumento && formData.tipoDocumento) {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        
        // Si estamos editando, usar el endpoint de edición
        if (editingPerson) {
          const response = await fetch(`${API_URL}/people/edit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              id: editingPerson.id,
              name: formData.nombre,
              documentType: formData.tipoDocumento,
              document: formData.numeroDocumento,
            }),
          })

          const data = await response.json()

          if (response.ok) {
            setFormData({ nombre: "", tipoDocumento: "Cédula", numeroDocumento: "" })
            setEditingPerson(null)
            setShowForm(false)
            
            try {
              const searchResponse = await fetch(`${API_URL}/people/search`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
              })
              if (searchResponse.ok) {
                const searchData = await searchResponse.json()
                setSearchResults(searchData.people || [])
              }
            } catch (err) {
              console.error("Error al recargar personas:", err)
            }
          } else {
            setError(data.message || "Error al actualizar la persona")
          }
        } else {
          // Crear nueva persona
          const response = await fetch(`${API_URL}/people/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              name: formData.nombre,
              documentType: formData.tipoDocumento,
              document: formData.numeroDocumento,
            }),
          })

          const data = await response.json()

          if (response.ok) {
            addPersona({
              nombre: formData.nombre,
              tipoDocumento: formData.tipoDocumento,
              numeroDocumento: formData.numeroDocumento,
            })
            setFormData({ nombre: "", tipoDocumento: "Cédula", numeroDocumento: "" })
            setShowForm(false)
            
            try {
              const searchResponse = await fetch(`${API_URL}/people/search`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
              })
              if (searchResponse.ok) {
                const searchData = await searchResponse.json()
                setSearchResults(searchData.people || [])
              }
            } catch (err) {
              console.error("Error al recargar personas:", err)
            }
          } else {
            setError(data.message || "Error al guardar la persona")
          }
        }
      } catch (err) {
        console.error("Error al guardar persona:", err)
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleNumeroDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData({ ...formData, numeroDocumento: value })
  }

  // Cargar todas las personas al montar el componente
  useEffect(() => {
    const loadAllPeople = async () => {
      setSearchLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_URL}/people/search`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.people || [])
        }
      } catch (err) {
        console.error("Error al cargar personas:", err)
      } finally {
        setSearchLoading(false)
      }
    }

    loadAllPeople()
  }, [])

  // Búsqueda en el backend con debounce cuando cambia el término de búsqueda
  useEffect(() => {
    // Si el término de búsqueda está vacío, cargar todas las personas
    if (searchTerm.trim() === "") {
      setSearchLoading(true)
      const loadAll = async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${API_URL}/people/search`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          })

          if (response.ok) {
            const data = await response.json()
            setSearchResults(data.people || [])
          }
        } catch (err) {
          console.error("Error al cargar personas:", err)
        } finally {
          setSearchLoading(false)
        }
      }
      loadAll()
      return
    }

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${API_URL}/people/search?searchTerm=${encodeURIComponent(searchTerm)}`,
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
          setSearchResults(data.people || [])
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error("Error al buscar personas:", err)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Función para mapear los datos del backend al formato del frontend
  const mapBackendToFrontend = (persona: PersonaFromBackend) => ({
    id: persona.id,
    nombre: persona.name,
    tipoDocumento: persona.documentType as "Cédula" | "NIT",
    numeroDocumento: persona.document,
  })

  // Mapear los resultados del backend al formato del frontend
  const displayedPersonas = searchResults.map(mapBackendToFrontend)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Personas</h2>
          <Button
            onClick={() => {
              if (showForm && editingPerson) {
                setEditingPerson(null)
              }
              setShowForm(!showForm)
              if (!showForm) {
                setFormData({ nombre: "", tipoDocumento: "Cédula", numeroDocumento: "" })
                setError("")
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nueva Persona"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            {editingPerson && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">Modo edición</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: handleNameChange(e.target.value) })}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Documento</label>
                <select
                  value={formData.tipoDocumento}
                  onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as "Cédula" | "NIT" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Cédula">Cédula</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Número de Documento</label>
                <input
                  type="text"
                  value={formData.numeroDocumento}
                  onChange={handleNumeroDocumentoChange}
                  placeholder="Número de documento"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : editingPerson ? "Actualizar Persona" : "Guardar Persona"}
            </Button>
          </form>
        )}

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, tipo de documento o número de documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {searchTerm && !searchLoading && (
            <p className="mt-2 text-sm text-slate-600">
              {searchResults.length > 0 
                ? `Se encontraron ${searchResults.length} persona(s)`
                : "No se encontraron resultados"}
            </p>
          )}
        </div>

        {/* Tabla de Personas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Tipo de Documento</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Número de Documento</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {searchLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Buscando...
                    </div>
                  </td>
                </tr>
              ) : displayedPersonas.length > 0 ? (
                displayedPersonas.map((persona) => {
                  const originalPerson = searchResults.find(p => p.id === persona.id)
                  return (
                    <tr key={persona.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{persona.nombre}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {persona.tipoDocumento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{persona.numeroDocumento}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => originalPerson && handleEdit(originalPerson)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            disabled={!originalPerson}
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={() => deletePersona(persona.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    {searchTerm ? "No se encontraron personas con ese criterio de búsqueda" : "No hay personas registradas"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
