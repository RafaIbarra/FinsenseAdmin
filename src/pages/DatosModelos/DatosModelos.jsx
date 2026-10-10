import { useCallback, useEffect, useState } from 'react'

import request from '../../../Api/request'
import SeccionConsumo from './components/SeccionConsumo'
import SeccionErrores from './components/SeccionErrores'
import SeccionDisponibilidad from './components/SeccionDisponibilidad'
import { formatNumber } from './components/ui'

export default function DatosModelos() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('consumo')

  const carga_datos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: 'models/datos-modelos',
        method: 'GET',
        body: {},
      })

      setDatos(response.data)
    } catch (err) {
      console.error('Error al cargar datos de modelos:', err)
      setError('No se pudieron cargar los datos de modelos.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    carga_datos()
  }, [carga_datos])

  // -------------------- TOTALES PARA LOS TABS --------------------

  const estadisticas = datos?.estadisticas
  const estadisticasErrores = datos?.estadisticas_errores
  const disponibilidad = datos?.disponibilidad

  const totalTokens =
    estadisticas?.data_tokens?.total_general?.TotalTokens ??
    0

  const totalErrores =
    estadisticasErrores?.total_general ?? 0

  const totalDisponibles =
    (disponibilidad?.lector_imagen?.length ?? 0) +
    (disponibilidad?.clasificador?.length ?? 0)

  // -------------------- ESTADOS --------------------

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            Cargando datos de modelos...
          </div>
        </div>
      </div>
    )
  }

  if (error || !datos) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error ?? 'No se pudieron cargar los datos.'}
          </p>

          <button
            type="button"
            onClick={carga_datos}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // -------------------- RENDER --------------------

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ENCABEZADO */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Monitoreo
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Datos de modelos
        </h2>

        <p className="mt-2 max-w-2xl text-gray-500">
          Monitoreo del consumo de modelos de inteligencia
          artificial y operaciones realizadas.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          {
            id: 'consumo',
            label: 'Consumo',
            total: formatNumber(totalTokens),
          },
          {
            id: 'errores',
            label: 'Errores',
            total: formatNumber(totalErrores),
          },
          {
            id: 'disponibilidad',
            label: 'Disponibilidad',
            total: formatNumber(totalDisponibles),
          },
        ].map((tab) => (
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
      {tabActiva === 'consumo' && (
        <SeccionConsumo datos={estadisticas} />
      )}

      {tabActiva === 'errores' && (
        <SeccionErrores errores={estadisticasErrores} />
      )}

      {tabActiva === 'disponibilidad' && (
        <SeccionDisponibilidad
          disponibilidad={disponibilidad}
        />
      )}
    </div>
  )
}
