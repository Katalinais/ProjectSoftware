"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { LogOut, Menu, X } from "lucide-react"
import ProcesosModule from "@/components/modules/ProcesosModule"
import PersonasModule from "@/components/modules/PersonasModule"
import ActuacionesModule from "@/components/modules/ActuacionesModule"
import DescripcionesModule from "@/components/modules/DescripcionesModule"
import EstadisticasModule from "@/components/modules/EstadisticasModule"

type ModuleType = "inicio" | "procesos" | "personas" | "actuaciones" | "descripciones" | "estadisticas"

export default function Dashboard() {
  const { user, logout } = useApp()
  const [currentModule, setCurrentModule] = useState<ModuleType>("inicio")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const modules: { id: ModuleType; label: string; icon: string }[] = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { id: "procesos", label: "Procesos", icon: "📋" },
    { id: "personas", label: "Personas", icon: "👥" },
    { id: "actuaciones", label: "Actuaciones", icon: "📝" },
    { id: "descripciones", label: "Descripciones", icon: "📄" },
    { id: "estadisticas", label: "Estadísticas", icon: "📊" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-lg flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">Sistema Legal</h2>
          <p className="text-sm text-slate-400 mt-1">{user?.name}</p>
        </div>

        <nav className="p-4 flex-grow overflow-y-auto">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => {
                setCurrentModule(module.id)
                setSidebarOpen(false) // Cerrar sidebar en mobile al seleccionar
              }}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentModule === module.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="mr-2">{module.icon}</span>
              {module.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="inline-block mr-2 w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 min-h-screen">
        {currentModule === "inicio" && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Bienvenido, {user?.name}</h1>
            <p className="text-slate-600 text-lg mb-6">
              Selecciona un módulo del menú lateral para comenzar a trabajar con el sistema de gestión de procesos
              legales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.slice(1).map((module) => (
                <button
                  key={module.id}
                  onClick={() => setCurrentModule(module.id)}
                  className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all text-left"
                >
                  <span className="text-3xl mb-3 block">{module.icon}</span>
                  <h3 className="font-bold text-xl text-slate-900">{module.label}</h3>
                  <p className="text-slate-500 text-sm mt-2">Gestiona y administra {module.label.toLowerCase()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentModule === "procesos" && <ProcesosModule />}
        {currentModule === "personas" && <PersonasModule />}
        {currentModule === "actuaciones" && <ActuacionesModule />}
        {currentModule === "descripciones" && <DescripcionesModule />}
        {currentModule === "estadisticas" && <EstadisticasModule />}
      </main>
    </div>
  )
}
