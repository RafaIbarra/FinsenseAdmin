import { useCallback, useEffect, useState } from 'react'

import request from '../../../../Api/request'
import BadgeEstado from './BadgeEstado'
import ModalImagen from './ModalImagen'
import Notificacion from './Notificacion'
import VisorJson from './VisorJson'

const normalizaRespuesta = (data) => data?.data ?? data

// El endpoint puede devolver el objeto o una lista con un único registro
const extraeReporte = (data) => {
  const d = normalizaRespuesta(data)
  return Array.isArray(d) ? (d[0] ?? null) : (d ?? null)
}

// El mensaje (éxito o error) viene en la key "detail"
const extraeDetail = (payload) => {
  const d = payload?.detail ?? payload?.data?.detail
  if (typeof d === 'string') return d
  if (d) return JSON.stringify(d)
  return null
}

function Campo({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  )
}

function Tarjeta({ titulo, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">
          {titulo}
        </h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  )
}

export default function DetalleReporte({ idReporte, onVolver }) {
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [imagenIndice, setImagenIndice] = useState(null)

  const [textoResolucion, setTextoResolucion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorResolucion, setErrorResolucion] = useState(null)
  const [notificacion, setNotificacion] = useState(null)

  const carga_detalle = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: `feedback-usuarios/reportadas?id_reporte=${idReporte}`,
        method: 'GET',
        body: {},
      })

      const data = extraeReporte(response.data)
      if (!data) {
        setError('No se encontró el reporte.')
        setReporte(null)
        return
      }

      setReporte(data)
    } catch (err) {
      console.error('Error al cargar detalle del reporte:', err)
      setError('No se pudo cargar el detalle del reporte.')
    } finally {
      setCargando(false)
    }
  }, [idReporte])

  useEffect(() => {
    carga_detalle()
  }, [carga_detalle])

  const cerrarNotificacion = useCallback(
    () => setNotificacion(null),
    [],
  )

  const handleResolver = async (e) => {
    e.preventDefault()

    if (!textoResolucion.trim()) {
      setErrorResolucion('Escribe la resolución antes de enviar.')
      return
    }

    try {
      setGuardando(true)
      setErrorResolucion(null)

      const formData = new FormData()
      formData.append('id', String(idReporte))
      formData.append('respuesta', textoResolucion.trim())

      const response = await request({
        endpoint: 'feedback-usuarios/resolver-reporte',
        method: 'POST',
        body: formData,
      })

      // Status 200 = registrado
      setNotificacion({
        tipo: 'exito',
        mensaje:
          extraeDetail(response?.data) ?? 'Reporte resuelto',
      })
      setTextoResolucion('')

      // Recarga el detalle (no vuelve al listado)
      await carga_detalle()
    } catch (err) {
      console.error('Error al resolver reporte:', err)
      setNotificacion({
        tipo: 'error',
        mensaje:
          extraeDetail(err?.response?.data) ??
          extraeDetail(err?.data) ??
          extraeDetail(err) ??
          'No se pudo resolver el reporte.',
      })
    } finally {
      setGuardando(false)
    }
  }

  const botonVolver = (
    <button
      type="button"
      onClick={onVolver}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
          clipRule="evenodd"
        />
      </svg>
      Volver al listado
    </button>
  )

  const toast = notificacion && (
    <Notificacion
      tipo={notificacion.tipo}
      mensaje={notificacion.mensaje}
      onClose={cerrarNotificacion}
    />
  )

  // -------------------- ESTADOS --------------------

  if (cargando && !reporte) {
    return (
      <>
        {toast}
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando reporte...
          </div>
        </div>
      </>
    )
  }

  if (error || !reporte) {
    return (
      <>
        {toast}
        <div className="mb-4">{botonVolver}</div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error ?? 'No se pudo cargar el reporte.'}
          </p>
          <button
            type="button"
            onClick={carga_detalle}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </>
    )
  }

  // -------------------- DATOS --------------------

  const imagenes = Array.isArray(reporte.url_imagen)
    ? reporte.url_imagen
    : reporte.url_imagen
      ? [reporte.url_imagen]
      : []

  const pendiente = reporte.estado_resolucion === 'Pendiente'

  // -------------------- RENDER --------------------

  return (
    <>
      {toast}

      {/* ENCABEZADO */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Reporte
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Reporte #{reporte.id}
            </h2>
            <BadgeEstado estado={reporte.estado_resolucion} />
          </div>
        </div>

        {botonVolver}
      </div>

      <div className="space-y-6">
        {/* DATOS GENERALES */}
        <Tarjeta titulo="Datos del reporte">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="Id">{reporte.id}</Campo>
            <Campo label="Usuario">{reporte.user_name}</Campo>
            <Campo label="Nombre completo">
              {[reporte.nombre_usuario, reporte.apellido_usuario]
                .filter(Boolean)
                .join(' ') || '-'}
            </Campo>
            <Campo label="Id de usuario">
              {reporte.id_usuario ?? reporte.usuario_id ?? '-'}
            </Campo>
            <Campo label="Fecha de registro">
              {reporte.fecha_registro}
            </Campo>
            <Campo label="Fecha de resolución">
              {reporte.fecha_resolucion || '-'}
            </Campo>
          </dl>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Observación del usuario
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
              {reporte.observacion || '-'}
            </dd>
          </div>
        </Tarjeta>

        {/* IMÁGENES */}
        <Tarjeta titulo={`Imágenes (${imagenes.length})`}>
          {imagenes.length === 0 ? (
            <p className="text-sm text-gray-500">
              Este reporte no tiene imágenes.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {imagenes.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setImagenIndice(i)}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition hover:border-blue-300 hover:shadow"
                  title="Ver imagen ampliada"
                >
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="h-40 w-40 object-cover transition group-hover:opacity-90"
                  />
                </button>
              ))}
            </div>
          )}
        </Tarjeta>

        {/* RESPUESTA (JSON variable) */}
        <Tarjeta titulo="Respuesta del sistema">
          <VisorJson data={reporte.respuesta} />
        </Tarjeta>

        {/* RESOLUCIÓN */}
        <Tarjeta titulo="Resolución">
          {pendiente ? (
            <form onSubmit={handleResolver} className="space-y-4">
              {errorResolucion && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorResolucion}
                </div>
              )}

              <div>
                <label
                  htmlFor="resolucion"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Explica la resolución
                </label>
                <textarea
                  id="resolucion"
                  value={textoResolucion}
                  onChange={(e) =>
                    setTextoResolucion(e.target.value)
                  }
                  rows={10}
                  disabled={guardando}
                  placeholder="Describe qué se encontró, qué se hizo y cualquier detalle relevante..."
                  className="min-h-48 w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {guardando && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-white" />
                  )}
                  Resolver
                </button>
              </div>
            </form>
          ) : (
            <dl className="space-y-4">
              <Campo label="Fecha de resolución">
                {reporte.fecha_resolucion || '-'}
              </Campo>
              <Campo label="Resolución">
                <span className="whitespace-pre-wrap">
                  {reporte.resolucion || '-'}
                </span>
              </Campo>
            </dl>
          )}
        </Tarjeta>
      </div>

      {/* VISOR DE IMAGEN */}
      {imagenIndice !== null && (
        <ModalImagen
          urls={imagenes}
          indice={imagenIndice}
          onCambiar={setImagenIndice}
          onClose={() => setImagenIndice(null)}
        />
      )}
    </>
  )
}
