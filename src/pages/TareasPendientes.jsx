import { useCallback, useEffect, useState } from 'react'
import request from '../../Api/request'

const REGISTROS_POR_PAGINA = 10

/* ============================================================
   RENDERIZADOR RECURSIVO DE VALORES (arregla [object Object])
   ============================================================ */
function ValorDetalle({ valor, clave }) {
  if (valor === null || valor === undefined || valor === '') {
    return <span className="text-sm text-slate-700">-</span>
  }

  if (typeof valor !== 'object') {
    const texto = String(valor)

    if (
      clave &&
      clave.toLowerCase() === 'url' &&
      /^https?:\/\//i.test(texto)
    ) {
      return (
        <a
          href={texto}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm text-indigo-600 hover:underline"
        >
          {texto}
        </a>
      )
    }

    return (
      <span className="break-words text-sm text-slate-700">
        {texto}
      </span>
    )
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) {
      return <span className="text-sm text-slate-700">-</span>
    }

    return (
      <div className="space-y-3">
        {valor.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <ValorDetalle valor={item} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Object.entries(valor).map(([k, v]) => (
        <div key={k} className="rounded-lg bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {k}
          </p>

          <div className="mt-1">
            <ValorDetalle valor={v} clave={k} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TareasPendientes() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('imagenes')

  const [filtroImagenes, setFiltroImagenes] = useState('todos')
  const [filtroCorreos, setFiltroCorreos] = useState('todos')

  const [paginaImagenes, setPaginaImagenes] = useState(1)
  const [paginaCorreos, setPaginaCorreos] = useState(1)

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null)

  /* NUEVO: estado de proceso y mensaje resultado */
  const [procesando, setProcesando] = useState(false)
  const [mensajeResultado, setMensajeResultado] = useState(null)

  const carga_datos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const endpoint = 'tasks/taks-pendientes'

      const response = await request({
        endpoint,
        method: 'GET',
        body: {},
      })

      console.log(response.data)
      setDatos(response.data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las tareas pendientes.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    carga_datos()
  }, [carga_datos])

  // ============================================================
  // IMAGENES
  // ============================================================

  const imagenesPendientes = datos?.imagenes_pendientes
  const resumenImagenes = imagenesPendientes?.Resumen

  const totalPendientes = resumenImagenes?.TotalPendientes

  const totalTareas = totalPendientes?.CantidadTareas ?? 0
  const totalImagenes = totalPendientes?.CantidadImagenes ?? 0
  const totalTamannoImagenes = totalPendientes?.TotalTamannoImagen_MB ?? 0

  const totalPorProcesado = resumenImagenes?.TotalPorProcesado ?? []

  const resumenNoProcesado = totalPorProcesado.find(
    (item) => item.Procesado === false
  )

  const resumenProcesado = totalPorProcesado.find(
    (item) => item.Procesado === true
  )

  const cantidadTareasPendientes =
    resumenNoProcesado?.CantidadTareas ?? 0

  const cantidadImagenesPendientes =
    resumenNoProcesado?.CantidadImagenes ?? 0

  const tamanioImagenesPendientes =
    resumenNoProcesado?.TotalTamannoImagen_MB ?? 0

  const cantidadTareasProcesadas =
    resumenProcesado?.CantidadTareas ?? 0

  const cantidadImagenesProcesadas =
    resumenProcesado?.CantidadImagenes ?? 0

  const tamanioImagenesProcesadas =
    resumenProcesado?.TotalTamannoImagen_MB ?? 0

  const puedeProcesarImagenes = cantidadTareasPendientes > 0

  const detalleImagenes = imagenesPendientes?.detalle ?? []

  // ============================================================
  // FILTRO DE IMAGENES
  // ============================================================

  const detalleImagenesFiltrado = detalleImagenes.filter((tarea) => {
    if (filtroImagenes === 'pendientes') {
      return tarea.Procesado === false
    }

    if (filtroImagenes === 'procesados') {
      return tarea.Procesado === true
    }

    return true
  })

  const totalPaginasImagenes = Math.max(
    1,
    Math.ceil(
      detalleImagenesFiltrado.length / REGISTROS_POR_PAGINA
    )
  )

  const inicioImagenes =
    (paginaImagenes - 1) * REGISTROS_POR_PAGINA

  const imagenesPagina = detalleImagenesFiltrado.slice(
    inicioImagenes,
    inicioImagenes + REGISTROS_POR_PAGINA
  )

  // ============================================================
  // CORREOS
  // ============================================================

  const envioCorreos = datos?.envio_correos
  const resumenCorreos = envioCorreos?.Resumen

  const cantidadPorProcesado =
    resumenCorreos?.CantidadPorProcesado ?? []

  const resumenCorreosPendientes = cantidadPorProcesado.find(
    (item) => item.Procesado === false
  )

  const resumenCorreosProcesados = cantidadPorProcesado.find(
    (item) => item.Procesado === true
  )

  const cantidadCorreosPendientes =
    resumenCorreosPendientes?.Cantidad ?? 0

  const cantidadCorreosProcesados =
    resumenCorreosProcesados?.Cantidad ?? 0

  const cantidadCorreosTotal =
    resumenCorreos?.CantidadTotalRegistros ?? 0

  const puedeProcesarCorreos = cantidadCorreosPendientes > 0

  const detalleCorreos = envioCorreos?.detalle ?? []

  // ============================================================
  // FILTRO DE CORREOS
  // ============================================================

  const detalleCorreosFiltrado = detalleCorreos.filter((correo) => {
    if (filtroCorreos === 'pendientes') {
      return correo.Procesado === false
    }

    if (filtroCorreos === 'procesados') {
      return correo.Procesado === true
    }

    return true
  })

  const totalPaginasCorreos = Math.max(
    1,
    Math.ceil(
      detalleCorreosFiltrado.length / REGISTROS_POR_PAGINA
    )
  )

  const inicioCorreos =
    (paginaCorreos - 1) * REGISTROS_POR_PAGINA

  const correosPagina = detalleCorreosFiltrado.slice(
    inicioCorreos,
    inicioCorreos + REGISTROS_POR_PAGINA
  )

  // ============================================================
  // FUNCIONES
  // ============================================================

  const seleccionarFiltroImagenes = (filtro) => {
    setFiltroImagenes(filtro)
    setPaginaImagenes(1)
  }

  const seleccionarFiltroCorreos = (filtro) => {
    setFiltroCorreos(filtro)
    setPaginaCorreos(1)
  }

  /* ============================================================
     NUEVO: ejecutar tareas (POST form-data)
     ============================================================ */
  const ejecutarTarea = async (scriptTarea) => {
    if (procesando) return

    try {
      setProcesando(true)
      setMensajeResultado(null)

      const formData = new FormData()
      formData.append('tarea', scriptTarea)

      const inicio = Date.now()

      const response = await request({
        endpoint: 'tasks/ejecutar-pendientes',
        method: 'POST',
        body: formData,
      })

      // Asegurar un mínimo de 1 segundo antes de mostrar la respuesta
      const transcurrido = Date.now() - inicio
      const restante = 1000 - transcurrido
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante))
      }

      setMensajeResultado({
        tipo: 'exito',
        texto:
          response?.data?.message ??
          response?.data?.Mensaje ??
          'Tarea ejecutada correctamente.',
      })

      // Recargar datos
      await carga_datos()
    } catch (err) {
      console.error(err)

      const transcurrido = 0
      const restante = 1000 - transcurrido
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante))
      }

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

  const procesarImagenes = () => {
    ejecutarTarea('procesar_imagenes_pendientes.py')
  }

  const procesarCorreos = () => {
    ejecutarTarea('ejecutar_envio_correo.py')
  }

  const obtenerClaseCard = (activo) => {
    return `
      cursor-pointer
      rounded-2xl
      border
      p-5
      transition-all
      duration-200
      ${
        activo
          ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md'
      }
    `
  }

  const obtenerEstado = (procesado) => {
    return procesado ? (
      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        Procesado
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Pendiente
      </span>
    )
  }

  // ============================================================
  // PAGINACION
  // ============================================================

  const cambiarPaginaImagenes = (pagina) => {
    if (pagina < 1 || pagina > totalPaginasImagenes) {
      return
    }

    setPaginaImagenes(pagina)
  }

  const cambiarPaginaCorreos = (pagina) => {
    if (pagina < 1 || pagina > totalPaginasCorreos) {
      return
    }

    setPaginaCorreos(pagina)
  }

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
        <button
          type="button"
          onClick={() => setTabActiva('imagenes')}
          className={`
            relative px-4 py-3 text-sm font-semibold transition
            ${
              tabActiva === 'imagenes'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }
          `}
        >
          Imágenes

          <span
            className={`
              ml-2 rounded-full px-2 py-0.5 text-xs
              ${
                tabActiva === 'imagenes'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500'
              }
            `}
          >
            {totalTareas}
          </span>

          {tabActiva === 'imagenes' && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('correos')}
          className={`
            relative px-4 py-3 text-sm font-semibold transition
            ${
              tabActiva === 'correos'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }
          `}
        >
          Envío de correos

          <span
            className={`
              ml-2 rounded-full px-2 py-0.5 text-xs
              ${
                tabActiva === 'correos'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500'
              }
            `}
          >
            {cantidadCorreosTotal}
          </span>

          {tabActiva === 'correos' && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>
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

      {/* ====================================================== */}
      {/* IMAGENES */}
      {/* ====================================================== */}

      {tabActiva === 'imagenes' && (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* TOTAL */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroImagenes('todos')
              }
              className={obtenerClaseCard(
                filtroImagenes === 'todos'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total de tareas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalTareas}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  📋
                </div>
              </div>

              <div className="mt-4 text-left text-xs text-slate-500">
                {totalImagenes} imágenes · {totalTamannoImagenes} MB
              </div>
            </button>

            {/* PENDIENTES */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroImagenes('pendientes')
              }
              className={obtenerClaseCard(
                filtroImagenes === 'pendientes'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Tareas pendientes
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    {cantidadTareasPendientes}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  ⏳
                </div>
              </div>

              <div className="mt-4 text-left text-xs text-slate-500">
                {cantidadImagenesPendientes} imágenes ·{' '}
                {tamanioImagenesPendientes} MB
              </div>
            </button>

            {/* PROCESADAS */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroImagenes('procesados')
              }
              className={obtenerClaseCard(
                filtroImagenes === 'procesados'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Tareas procesadas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {cantidadTareasProcesadas}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                  ✓
                </div>
              </div>

              <div className="mt-4 text-left text-xs text-slate-500">
                {cantidadImagenesProcesadas} imágenes ·{' '}
                {tamanioImagenesProcesadas} MB
              </div>
            </button>
          </div>

          {/* ACCION */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={!puedeProcesarImagenes || procesando}
              onClick={procesarImagenes}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {procesando && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {procesando ? 'Procesando...' : 'Procesar imágenes'}
            </button>
          </div>

          {/* DETALLE */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Detalle de tareas
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filtroImagenes === 'todos' &&
                    'Mostrando todas las tareas.'}

                  {filtroImagenes === 'pendientes' &&
                    'Mostrando solamente tareas pendientes.'}

                  {filtroImagenes === 'procesados' &&
                    'Mostrando solamente tareas procesadas.'}
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {detalleImagenesFiltrado.length} registros
              </span>
            </div>

            {imagenesPagina.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No existen registros para este filtro.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-180 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Codigo Tarea</th>
                      <th className="px-5 py-3">Usuario</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3 text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {imagenesPagina.map((tarea, index) => (
                      <tr
                        key={tarea.CodigoTarea ?? index}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {tarea.CodigoTarea ?? '-'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {tarea.UserName ?? '-'}
                        </td>

                        <td className="px-5 py-4">
                          {obtenerEstado(tarea.Procesado)}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {tarea.FechaRegistro ?? '-'}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setImagenSeleccionada(tarea)
                            }
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINACION */}
            {detalleImagenesFiltrado.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                <span className="text-xs text-slate-500">
                  Página {paginaImagenes} de{' '}
                  {totalPaginasImagenes}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      cambiarPaginaImagenes(
                        paginaImagenes - 1
                      )
                    }
                    disabled={paginaImagenes === 1}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      cambiarPaginaImagenes(
                        paginaImagenes + 1
                      )
                    }
                    disabled={
                      paginaImagenes === totalPaginasImagenes
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ====================================================== */}
      {/* CORREOS */}
      {/* ====================================================== */}

      {tabActiva === 'correos' && (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* TOTAL */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroCorreos('todos')
              }
              className={obtenerClaseCard(
                filtroCorreos === 'todos'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total de correos
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {cantidadCorreosTotal}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  ✉
                </div>
              </div>
            </button>

            {/* PENDIENTES */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroCorreos('pendientes')
              }
              className={obtenerClaseCard(
                filtroCorreos === 'pendientes'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Correos pendientes
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    {cantidadCorreosPendientes}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  ⏳
                </div>
              </div>
            </button>

            {/* PROCESADOS */}
            <button
              type="button"
              onClick={() =>
                seleccionarFiltroCorreos('procesados')
              }
              className={obtenerClaseCard(
                filtroCorreos === 'procesados'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Correos procesados
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {cantidadCorreosProcesados}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                  ✓
                </div>
              </div>
            </button>
          </div>

          {/* ACCION */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={!puedeProcesarCorreos || procesando}
              onClick={procesarCorreos}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {procesando && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {procesando ? 'Procesando...' : 'Procesar correos'}
            </button>
          </div>

          {/* DETALLE */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Detalle de correos
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filtroCorreos === 'todos' &&
                    'Mostrando todos los correos.'}

                  {filtroCorreos === 'pendientes' &&
                    'Mostrando solamente correos pendientes.'}

                  {filtroCorreos === 'procesados' &&
                    'Mostrando solamente correos procesados.'}
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {detalleCorreosFiltrado.length} registros
              </span>
            </div>

            {correosPagina.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No existen registros para este filtro.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-220 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Usuario</th>
                      <th className="px-5 py-3">Tipo correo</th>
                      <th className="px-5 py-3">
                        Tipo destinatario
                      </th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3 text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {correosPagina.map((correo, index) => (
                      <tr
                        key={
                          correo.Id ??
                          correo.ID ??
                          correo.Codigo ??
                          index
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {correo.Id ??
                            correo.ID ??
                            correo.Codigo ??
                            '-'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {correo.usuario ?? '-'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {correo.TipoCorreo ?? '-'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {correo.TipoDestinatario ?? '-'}
                        </td>

                        <td className="px-5 py-4">
                          {obtenerEstado(correo.Procesado)}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {correo.FechaRegistro ?? '-'}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setCorreoSeleccionado(correo)
                            }
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINACION */}
            {detalleCorreosFiltrado.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                <span className="text-xs text-slate-500">
                  Página {paginaCorreos} de{' '}
                  {totalPaginasCorreos}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      cambiarPaginaCorreos(
                        paginaCorreos - 1
                      )
                    }
                    disabled={paginaCorreos === 1}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      cambiarPaginaCorreos(
                        paginaCorreos + 1
                      )
                    }
                    disabled={
                      paginaCorreos === totalPaginasCorreos
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ====================================================== */}
      {/* MODAL IMAGEN */}
      {/* ====================================================== */}

      {imagenSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="font-semibold text-slate-900">
                Detalle de tarea
              </h3>

              <button
                type="button"
                onClick={() => setImagenSeleccionada(null)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(imagenSeleccionada).map(
                  ([clave, valor]) => {
                    const esComplejo =
                      valor !== null &&
                      typeof valor === 'object'

                    return (
                      <div
                        key={clave}
                        className={`rounded-xl bg-slate-50 p-4 ${
                          esComplejo ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          {clave}
                        </p>

                        <div className="mt-1">
                          <ValorDetalle
                            valor={valor}
                            clave={clave}
                          />
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* MODAL CORREO */}
      {/* ====================================================== */}

      {correoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="font-semibold text-slate-900">
                Detalle del correo
              </h3>

              <button
                type="button"
                onClick={() => setCorreoSeleccionado(null)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(correoSeleccionado).map(
                  ([clave, valor]) => {
                    const esComplejo =
                      valor !== null &&
                      typeof valor === 'object'

                    return (
                      <div
                        key={clave}
                        className={`rounded-xl bg-slate-50 p-4 ${
                          esComplejo ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          {clave}
                        </p>

                        <div className="mt-1">
                          <ValorDetalle
                            valor={valor}
                            clave={clave}
                          />
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}