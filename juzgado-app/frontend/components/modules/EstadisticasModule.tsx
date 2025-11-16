"use client"

import { useApp } from "@/contexts/AppContext"

export default function EstadisticasModule() {
  const { procesos, personas, actuaciones, descripciones } = useApp()

  // Estadísticas por tipo de proceso
  const procesosPorTipo = procesos.reduce(
    (acc, p) => {
      const existing = acc.find((item) => item.name === p.tipo)
      if (existing) {
        existing.value++
      } else {
        acc.push({ name: p.tipo, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Estadísticas por tipo de documento
  const personasPorTipoDocumento = personas.reduce(
    (acc, p) => {
      const existing = acc.find((item) => item.name === p.tipoDocumento)
      if (existing) {
        existing.value++
      } else {
        acc.push({ name: p.tipoDocumento, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Actuaciones por tipo
  const actuacionesPorTipo = actuaciones.reduce(
    (acc, a) => {
      const existing = acc.find((item) => item.name === a.tipo)
      if (existing) {
        existing.value++
      } else {
        acc.push({ name: a.tipo, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const ProgressBar = ({ label, value, max }: { label: string; value: number; max: number }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  const maxProcesos = Math.max(...procesosPorTipo.map((p) => p.value), 1)
  const maxPersonas = Math.max(...personasPorTipoDocumento.map((p) => p.value), 1)
  const maxActuaciones = Math.max(...actuacionesPorTipo.map((a) => a.value), 1)

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total de Procesos</p>
          <p className="text-3xl font-bold text-blue-600">{procesos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total de Personas</p>
          <p className="text-3xl font-bold text-green-600">{personas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total de Actuaciones</p>
          <p className="text-3xl font-bold text-purple-600">{actuaciones.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Descripciones</p>
          <p className="text-3xl font-bold text-orange-600">{descripciones.length}</p>
        </div>
      </div>

      {/* Gráficos con barras de progreso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procesos por tipo */}
        {procesosPorTipo.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Procesos por Tipo</h3>
            {procesosPorTipo.map((item) => (
              <ProgressBar key={item.name} label={item.name} value={item.value} max={maxProcesos} />
            ))}
          </div>
        )}

        {/* Personas por tipo de documento */}
        {personasPorTipoDocumento.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Personas por Tipo de Documento</h3>
            {personasPorTipoDocumento.map((item) => (
              <ProgressBar key={item.name} label={item.name} value={item.value} max={maxPersonas} />
            ))}
          </div>
        )}
      </div>

      {/* Actuaciones por tipo */}
      {actuacionesPorTipo.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Actuaciones por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actuacionesPorTipo.map((item) => (
              <ProgressBar key={item.name} label={item.name} value={item.value} max={maxActuaciones} />
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas generales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-4">Tipos de Procesos</h4>
            <div className="space-y-2">
              {procesosPorTipo.length > 0 ? (
                procesosPorTipo.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name}:</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sin datos</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-4">Personas por Tipo de Documento</h4>
            <div className="space-y-2">
              {personasPorTipoDocumento.length > 0 ? (
                personasPorTipoDocumento.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name}:</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sin datos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
