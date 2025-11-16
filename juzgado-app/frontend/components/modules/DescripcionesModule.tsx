"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"

export default function DescripcionesModule() {
  const { descripciones, addDescripcion, deleteDescripcion } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nombre && formData.descripcion) {
      addDescripcion(formData)
      setFormData({ nombre: "", descripcion: "" })
      setShowForm(false)
    }
  }

  const filteredDescripciones = descripciones.filter((d) => {
    return (
      d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Descripciones de Actuaciones</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nueva Descripción"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Demanda Civil"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada de la actuación"
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Guardar Descripción
            </Button>
          </form>
        )}

        {/* Búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista de Descripciones */}
        <div className="space-y-4">
          {filteredDescripciones.length > 0 ? (
            filteredDescripciones.map((desc) => (
              <div key={desc.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{desc.nombre}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{desc.descripcion}</p>
                  </div>
                  <Button
                    onClick={() => deleteDescripcion(desc.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-4"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">No hay descripciones registradas</div>
          )}
        </div>
      </div>
    </div>
  )
}
