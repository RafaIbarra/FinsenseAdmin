import { useCallback, useEffect, useState } from 'react'

import request from '../../../Api/request'
import SeccionImagenes from './components/SeccionImagenes'
import SeccionCorreos from './components/SeccionCorreos'
import SeccionLogs from './components/SeccionLogs'
import ModalDetalle from './components/ModalDetalle'

export default function TareasPendientes() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('imagenes')

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null)

  const [procesando, setProcesando] = useState(false)
  const [mensajeResultado, setMensajeResultado] = useState(null)

  // NUEVO: logs
  const [logs, setLogs] = useState(null)
  const [cargandoLogs, setCargandoLogs] = useState(true)
  const [errorLogs, setErrorLogs] = useState(null)

  const [logSeleccionado, setLogSeleccionado] = useState(null)
  const [cargandoLog, setCargandoLog] = useState(false)

  // ============================================================
  // CARGA DE DATOS
  // ============================================================

  const carga_datos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: 'tasks/taks-pendientes',
        method: 'GET',
        body: {},
      })

      setDatos(response.data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las tareas pendientes.')
    } finally {
      setCargando(false)
    }
  }, [])

  // NUEVO
  const carga_datos_logs = useCallback(async () => {
    try {
      setCargandoLogs(true)
      setErrorLogs(null)

      const response = await request({
        endpoint: 'tasks/logs',
        method: 'GET',
        body: {},
      })

      setLogs(response.data)
    } catch (err) {
      console.error(err)
      setErrorLogs('No se pudieron cargar los logs.')
    } finally {
      setCargandoLogs(false)
    }
  }, [])

  // NUEVO: detalle de un log
  const verLog = useCallback(async (nombre) => {
    try {
      setCargandoLog(true)

      const response = await request({
        endpoint: `tasks/logs/${nombre}`,
        method: 'GET',
        body: {},
      })

      setLogSeleccionado(response.data)
    } catch (err) {
      console.error(err)
      setMensajeResultado({
        tipo: 'error',
        texto: 'No se pudo cargar el contenido del log.',
      })
    } finally {
      setCargandoLog(false)
    }
  }, [])

  useEffect(() => {
    carga_datos()
    carga_datos_logs()
  }, [carga_datos, carga_datos_logs])

  // ============================================================
  // EJECUTAR TAREAS (POST form-data)
  // ============================================================

  const esperarMinimo = async (inicio) => {
    // Asegurar un mínimo de 1 segundo antes de mostrar la respuesta
    const restante = 1000 - (Date.now() - inicio)
    if (restante > 0) {
      await new Promise((resolve) => setTimeout(resolve, restante))
    }
  }

  const ejecutarTarea = async (scriptTarea) => {
    if (procesando) return

    const inicio = Date.now()

    try {
      setProcesando(true)
      setMensajeResultado(null)

      const formData = new FormData()
      formData.append('tarea', scriptTarea)

      const response = await request({
        endpoint: 'tasks/ejecutar-pendientes',
        method: 'POST',
        body: formData,
      })

      await esperarMinimo(inicio)

      setMensajeResultado({
        tipo: 'exito',
        texto:
          response?.data?.message ??
          response?.data?.Mensaje ??
          'Tarea ejecutada correctamente.',
      })

      await carga_datos()
      await carga_datos_logs() // NUEVO: refrescar logs tras procesar
    } catch (err) {
      console.error(err)
      await esperarMinimo(inicio)

      setMensajeResultado({
        tipo: 'error',
        texto:
          err?.response?.data?.message ??
          err?.response?.data?.Mensaje ??
          'No se pudo ejecutar la tarea.',
      })
    } finally {
      setProcesando(false)
    }
  }

  const procesarImagenes = () =>
    ejecutarTarea('procesar_imagenes_pendientes.py')

  const procesarCorreos = () =>
    ejecutarTarea('ejecutar_envio_correo.py')

  // ============================================================
  // TOTALES PARA LOS TABS
  // ============================================================

  const totalTareas =
    datos?.imagenes_pendientes?.Resumen?.TotalPendientes
      ?.CantidadTareas ?? 0

  const cantidadCorreosTotal =
    datos?.envio_correos?.Resumen?.CantidadTotalRegistros ?? 0

  // NUEVO: total de logs (suma de todas las keys)
  const totalLogs = Object.values(logs ?? {}).reduce(
    (acc, lista) => acc + (lista?.length ?? 0),
    0
  )

  // ============================================================
  // ESTADOS
  // ============================================================

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-sm text-slate-500">
            Cargando tareas pendientes...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error}
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ENCABEZADO */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tareas pendientes
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Control y procesamiento de tareas del sistema.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {[
          { id: 'imagenes', label: 'Imágenes', total: totalTareas },
          {
            id: 'correos',
            label: 'Envío de correos',
            total: cantidadCorreosTotal,
          },
          { id: 'logs', label: 'Logs', total: totalLogs },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabActiva(tab.id)}
            className={`
              relative px-4 py-3 text-sm font-semibold transition
              ${
                tabActiva === tab.id
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }
            `}
          >
            {tab.label}

            <span
              className={`
                ml-2 rounded-full px-2 py-0.5 text-xs
                ${
                  tabActiva === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-500'
                }
              `}
            >
              {tab.total}
            </span>

            {tabActiva === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* MENSAJE DE RESULTADO */}
      {mensajeResultado && (
        <div
          className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border p-4 ${
            mensajeResultado.tipo === 'exito'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`text-lg ${
                mensajeResultado.tipo === 'exito'
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            >
              {mensajeResultado.tipo === 'exito' ? '✓' : '⚠'}
            </span>

            <p
              className={`text-sm font-medium ${
                mensajeResultado.tipo === 'exito'
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {mensajeResultado.texto}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMensajeResultado(null)}
            className={`rounded-lg px-2 py-1 text-xs font-semibold ${
              mensajeResultado.tipo === 'exito'
                ? 'text-emerald-700 hover:bg-emerald-100'
                : 'text-red-700 hover:bg-red-100'
            }`}
          >
            ✕
          </button>
        </div>
      )}

      {/* SECCIONES */}
      {tabActiva === 'imagenes' && (
        <SeccionImagenes
          data={datos?.imagenes_pendientes}
          procesando={procesando}
          onProcesar={procesarImagenes}
          onVerDetalle={setImagenSeleccionada}
        />
      )}

      {tabActiva === 'correos' && (
        <SeccionCorreos
          data={datos?.envio_correos}
          procesando={procesando}
          onProcesar={procesarCorreos}
          onVerDetalle={setCorreoSeleccionado}
        />
      )}

      {tabActiva === 'logs' &&
        (errorLogs ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {errorLogs}
            </p>

            <button
              type="button"
              onClick={carga_datos_logs}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <SeccionLogs
            logs={logs}
            cargandoLogs={cargandoLogs}
            logSeleccionado={logSeleccionado}
            cargandoLog={cargandoLog}
            onVerLog={verLog}
            onCerrarLog={() => setLogSeleccionado(null)}
          />
        ))}

      {/* MODALES */}
      <ModalDetalle
        titulo="Detalle de tarea"
        datos={imagenSeleccionada}
        onClose={() => setImagenSeleccionada(null)}
      />

      <ModalDetalle
        titulo="Detalle del correo"
        datos={correoSeleccionado}
        onClose={() => setCorreoSeleccionado(null)}
      />
    </div>
  )
}
