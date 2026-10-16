import { useCallback, useEffect, useState } from 'react'

import request from '../../../Api/request'
import SeccionReportadas from './components/SeccionReportadas'
import SeccionComentarios from './components/SeccionComentarios'
import DetalleReporte from './components/DetalleReporte'

const normalizaRespuesta = (data) => data?.data ?? data

// El reporte abierto vive en la URL (?reporte=ID) para que
// sobreviva a un refresh de la página.
const leerReporteDeUrl = () => {
  const valor = new URLSearchParams(window.location.search).get('reporte')
  return valor ? Number(valor) : null
}

const escribirReporteEnUrl = (id) => {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('reporte', String(id))
  else url.searchParams.delete('reporte')
  window.history.pushState({}, '', url)
}

export default function ReportesComentarios() {
  const [reportadas, setReportadas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('reportadas')
  const [reporteId, setReporteId] = useState(leerReporteDeUrl)

  const carga_reportadas = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: 'feedback-usuarios/reportadas',
        method: 'GET',
        body: {},
      })

      const data = normalizaRespuesta(response.data)
      setReportadas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar reportes:', err)
      setError('No se pudieron cargar los reportes.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    carga_reportadas()
  }, [carga_reportadas])

  // Soporte para botón atrás / adelante del navegador
  useEffect(() => {
    const onPop = () => setReporteId(leerReporteDeUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const abrirDetalle = (id) => {
    escribirReporteEnUrl(id)
    setReporteId(id)
  }

  const volverAlListado = () => {
    escribirReporteEnUrl(null)
    setReporteId(null)
    // El estado pudo cambiar al resolver: refresca el listado
    carga_reportadas()
  }

  // -------------------- DETALLE --------------------

  if (reporteId) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <DetalleReporte
          idReporte={reporteId}
          onVolver={volverAlListado}
        />
      </div>
    )
  }

  // -------------------- ESTADOS --------------------

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando reportes...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={carga_reportadas}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // -------------------- RENDER --------------------

  const tabs = [
    { id: 'reportadas', label: 'Reportadas', total: reportadas.length },
    { id: 'comentarios', label: 'Comentarios', total: 0 },
  ]

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ENCABEZADO */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Gestión
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Reportes y comentarios
        </h2>

        <p className="mt-2 max-w-2xl text-gray-500">
          Revisa los registros reportados por los usuarios y
          los comentarios recibidos.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabActiva(tab.id)}
            className={`
              relative px-4 py-3 text-sm font-semibold transition
              ${
                tabActiva === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }
            `}
          >
            {tab.label}

            <span
              className={`
                ml-2 rounded-full px-2 py-0.5 text-xs
                ${
                  tabActiva === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
            >
              {tab.total}
            </span>

            {tabActiva === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* SECCIONES */}
      {tabActiva === 'reportadas' && (
        <SeccionReportadas
          reportadas={reportadas}
          onVerDetalle={abrirDetalle}
        />
      )}

      {tabActiva === 'comentarios' && <SeccionComentarios />}
    </div>
  )
}
