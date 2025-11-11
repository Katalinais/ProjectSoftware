"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"

export default function PersonasModule() {
  const { personas, addPersona, deletePersona } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    rol: "",
    email: "",
    telefono: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nombre && formData.cedula && formData.rol) {
      addPersona(formData)
      setFormData({ nombre: "", cedula: "", rol: "", email: "", telefono: "" })
      setShowForm(false)
    }
  }

  const filteredPersonas = personas.filter((p) => {
    return (
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cedula.includes(searchTerm) ||
      p.rol.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Personas</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancelar" : "+ Nueva Persona"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cédula</label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  placeholder="Número de cédula"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
                <input
                  type="text"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  placeholder="Ej: Abogado, Demandante, Demandado"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Número de teléfono"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Guardar Persona
            </Button>
          </form>
        )}

        {/* Búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabla de Personas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Rol</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Teléfono</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonas.length > 0 ? (
                filteredPersonas.map((persona) => (
                  <tr key={persona.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{persona.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{persona.cedula}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {persona.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{persona.email || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{persona.telefono || "-"}</td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={() => deletePersona(persona.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No hay personas registradas
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
