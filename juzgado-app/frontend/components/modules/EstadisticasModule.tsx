"use client"

import { useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"

interface MatrixData {
  categoryName: string
  typeTrialName: string
  entryTypes: Record<string, number>
  autoDescriptions: Record<string, number>
  totalSentencias: number
}

interface PreviewData {
  matrixData: Record<string, MatrixData>
  entryTypes: Array<{ id: string; description: string }>
  autoDescriptions: Array<{ id: string; description: string }>
}

export default function EstadisticasModule() {
  const { procesos, personas, actuaciones, descripciones } = useApp()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [generatingReport, setGeneratingReport] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

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

  const handlePreview = async () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona ambas fechas (inicio y fin)")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin")
      return
    }

    setLoadingPreview(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:4000/statistics?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al obtener la vista previa")
      }

      const data = await response.json()
      setPreviewData({
        matrixData: data.matrixData || {},
        entryTypes: data.entryTypes || [],
        autoDescriptions: data.autoDescriptions || [],
      })
    } catch (error) {
      console.error("Error al obtener vista previa:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener la vista previa"
      alert(`Error al obtener la vista previa: ${errorMessage}`)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona ambas fechas (inicio y fin)")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin")
      return
    }

    setGeneratingReport(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:4000/statistics/report?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al generar el reporte")
      }

      // Obtener el blob del archivo
      const blob = await response.blob()
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte_estadisticas_${startDate}_${endDate}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error al generar reporte:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar el reporte"
      alert(`Error al generar el reporte: ${errorMessage}`)
    } finally {
      setGeneratingReport(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Panel de generación de reporte */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Generar Reporte Excel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              disabled={loadingPreview || !startDate || !endDate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPreview ? "Cargando..." : "Vista Previa"}
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={generatingReport || !startDate || !endDate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingReport ? "Generando..." : "Generar Reporte"}
            </Button>
          </div>
        </div>
      </div>

      {/* Vista Previa de la Matriz */}
      {previewData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Vista Previa - Matriz de Categorías
          </h3>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-left border border-slate-300 min-w-[200px]">
                    Categoría
                  </th>
                  {previewData.entryTypes.map((entryType) => (
                    <th
                      key={entryType.id}
                      className="px-4 py-3 font-semibold text-center border border-slate-300 min-w-[120px]"
                    >
                      {entryType.description}
                    </th>
                  ))}
                  {previewData.autoDescriptions.map((autoDesc) => (
                    <th
                      key={autoDesc.id}
                      className="px-4 py-3 font-semibold text-center border border-slate-300 min-w-[150px]"
                    >
                      {autoDesc.description}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-center border border-slate-300 min-w-[120px]">
                    Total Sentencias
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(previewData.matrixData).length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        1 +
                        previewData.entryTypes.length +
                        previewData.autoDescriptions.length +
                        1
                      }
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No hay datos disponibles para el rango de fechas seleccionado
                    </td>
                  </tr>
                ) : (
                  Object.values(previewData.matrixData)
                    .sort((a, b) => {
                      if (a.typeTrialName === "Ordinario" && b.typeTrialName === "Ejecutivo") return -1
                      if (a.typeTrialName === "Ejecutivo" && b.typeTrialName === "Ordinario") return 1
                      return 0
                    })
                    .map((categoryData, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 border border-slate-200">
                          {categoryData.typeTrialName} - {categoryData.categoryName}
                        </td>
                        {previewData.entryTypes.map((entryType) => (
                          <td
                            key={entryType.id}
                            className="px-4 py-3 text-center text-slate-700 border border-slate-200"
                          >
                            {categoryData.entryTypes[entryType.id] || 0}
                          </td>
                        ))}
                        {previewData.autoDescriptions.map((autoDesc) => (
                          <td
                            key={autoDesc.id}
                            className="px-4 py-3 text-center text-slate-700 border border-slate-200"
                          >
                            {categoryData.autoDescriptions[autoDesc.id] || 0}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-semibold text-slate-900 border border-slate-200">
                          {categoryData.totalSentencias || 0}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
