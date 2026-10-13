import { useCallback, useEffect, useState } from 'react'

import request from '../../../Api/request'
import SeccionEmpresas from './components/SeccionEmpresas'
import SeccionTiposMedios from './components/SeccionTiposMedios'
import SeccionCanales from './components/SeccionCanales'

const normalizaRespuesta = (data) => data?.data ?? data

export default function CatalogoBase() {
  const [catalogos, setCatalogos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('empresas')

  const carga_catalogos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: 'data-catalogos-base/lista-catalogos-base',
        method: 'GET',
        body: {},
      })

      setCatalogos(normalizaRespuesta(response.data))
    } catch (err) {
      console.error('Error al cargar catálogos base:', err)
      setError('No se pudieron cargar los catálogos base.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    carga_catalogos()
  }, [carga_catalogos])

  // -------------------- ESTADOS --------------------

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando catálogos base...
          </div>
        </div>
      </div>
    )
  }

  if (error || !catalogos) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error ?? 'No se pudieron cargar los datos.'}
          </p>

          <button
            type="button"
            onClick={carga_catalogos}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // -------------------- DATOS --------------------

  const empresas = catalogos?.Empresas ?? []
  const tiposMedios = catalogos?.TiposMedios ?? []
  const canales = catalogos?.Canales ?? []

  // -------------------- RENDER --------------------

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ENCABEZADO */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Gestión
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Catálogo base
        </h2>

        <p className="mt-2 max-w-2xl text-gray-500">
          Administra las empresas, los tipos de medios de
          pago y los canales del sistema.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          {
            id: 'empresas',
            label: 'Empresas',
            total: empresas.length,
          },
          {
            id: 'tipos-medios',
            label: 'Tipos de medios',
            total: tiposMedios.length,
          },
          {
            id: 'canales',
            label: 'Canales',
            total: canales.length,
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
      {tabActiva === 'empresas' && (
        <SeccionEmpresas
          empresas={empresas}
          onGuardado={carga_catalogos}
        />
      )}

      {tabActiva === 'tipos-medios' && (
        <SeccionTiposMedios
          tiposMedios={tiposMedios}
          onGuardado={carga_catalogos}
        />
      )}

      {tabActiva === 'canales' && (
        <SeccionCanales
          canales={canales}
          onGuardado={carga_catalogos}
        />
      )}
    </div>
  )
}
