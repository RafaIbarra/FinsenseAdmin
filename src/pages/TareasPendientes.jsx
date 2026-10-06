
import { useEffect, useState } from 'react'
import request from '../../Api/request'

const REGISTROS_POR_PAGINA = 10

export default function TareasPendientes() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [tabActiva, setTabActiva] = useState('imagenes')

  const [paginaImagenes, setPaginaImagenes] = useState(1)
  const [paginaCorreos, setPaginaCorreos] = useState(1)

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null)

  const carga_datos = async () => {
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
      setPaginaImagenes(1)
      setPaginaCorreos(1)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las tareas pendientes.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    carga_datos()
  }, [])

  /*
   * ============================================================
   * IMAGENES PENDIENTES
   * ============================================================
   */

  const imagenesPendientes = datos?.imagenes_pendientes

  const detalleImagenes =
    imagenesPendientes?.detalle ?? []

  const resumenImagenes =
    imagenesPendientes?.Resumen

  /*
   * Total general de tareas.
   *
   * Se obtiene desde:
   * Resumen.TotalPendientes
   */
  const totalPendientes =
    resumenImagenes?.TotalPendientes

  const totalTareas =
    totalPendientes?.CantidadTareas ?? 0

  const totalImagenes =
    totalPendientes?.CantidadImagenes ?? 0

  /*
   * Resumen separado por estado de procesamiento.
   *
   * Procesado = false -> pendientes
   * Procesado = true  -> procesadas
   */
  const totalPorProcesado =
    resumenImagenes?.TotalPorProcesado ?? []

  const resumenNoProcesado =
    totalPorProcesado.find(
      (item) => item.Procesado === false,
    )

  const resumenProcesado =
    totalPorProcesado.find(
      (item) => item.Procesado === true,
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

  /*
   * El botón Procesar depende exclusivamente
   * de las tareas con Procesado = false.
   */
  const puedeProcesarImagenes =
    cantidadTareasPendientes > 0

  /*
   * Paginación de imágenes
   */
  const totalPaginasImagenes = Math.max(
    1,
    Math.ceil(
      detalleImagenes.length / REGISTROS_POR_PAGINA,
    ),
  )

  const inicioImagenes =
    (paginaImagenes - 1) * REGISTROS_POR_PAGINA

  const imagenesPagina =
    detalleImagenes.slice(
      inicioImagenes,
      inicioImagenes + REGISTROS_POR_PAGINA,
    )

  /*
   * ============================================================
   * ENVIO DE CORREOS
   * ============================================================
   */

  const envioCorreos =
    datos?.envio_correos

  const detalleCorreos =
    envioCorreos?.detalle ?? []

  const resumenCorreos =
    envioCorreos?.Resumen

  const cantidadPorProcesado =
    resumenCorreos?.CantidadPorProcesado ?? []

  const resumenCorreosPendientes =
    cantidadPorProcesado.find(
      (item) => item.Procesado === false,
    )

  const resumenCorreosProcesados =
    cantidadPorProcesado.find(
      (item) => item.Procesado === true,
    )

  const cantidadCorreosPendientes =
    resumenCorreosPendientes?.Cantidad ?? 0

  const cantidadCorreosProcesados =
    resumenCorreosProcesados?.Cantidad ?? 0

  const cantidadCorreosTotal =
    resumenCorreos?.CantidadTotalRegistros ?? 0

  const puedeProcesarCorreos =
    cantidadCorreosPendientes > 0

  /*
   * Paginación de correos
   */
  const totalPaginasCorreos = Math.max(
    1,
    Math.ceil(
      detalleCorreos.length / REGISTROS_POR_PAGINA,
    ),
  )

  const inicioCorreos =
    (paginaCorreos - 1) * REGISTROS_POR_PAGINA

  const correosPagina =
    detalleCorreos.slice(
      inicioCorreos,
      inicioCorreos + REGISTROS_POR_PAGINA,
    )

  /*
   * ============================================================
   * ACCIONES
   * ============================================================
   */

  const procesarImagenes = () => {
    console.log(
      'Procesar imágenes:',
      cantidadTareasPendientes,
    )
  }

  const procesarCorreos = () => {
    console.log(
      'Procesar correos:',
      cantidadCorreosPendientes,
    )
  }

  /*
   * ============================================================
   * PAGINACION
   * ============================================================
   */

  const cambiarPaginaImagenes = (pagina) => {
    if (
      pagina >= 1 &&
      pagina <= totalPaginasImagenes
    ) {
      setPaginaImagenes(pagina)
    }
  }

  const cambiarPaginaCorreos = (pagina) => {
    if (
      pagina >= 1 &&
      pagina <= totalPaginasCorreos
    ) {
      setPaginaCorreos(pagina)
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

            <p className="text-sm text-slate-500">
              Cargando tareas pendientes...
            </p>
          </div>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (error) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Error
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={carga_datos}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ======================================================
          ENCABEZADO
      ======================================================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tareas Pendientes
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Administración y seguimiento de tareas pendientes
        </p>
      </div>

      {/* ======================================================
          TABS
      ======================================================= */}

      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setTabActiva('imagenes')}
            className={`relative pb-3 text-sm font-semibold transition ${
              tabActiva === 'imagenes'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Imágenes pendientes

            {cantidadTareasPendientes > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {cantidadTareasPendientes}
              </span>
            )}

            {tabActiva === 'imagenes' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-slate-900" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setTabActiva('correos')}
            className={`relative pb-3 text-sm font-semibold transition ${
              tabActiva === 'correos'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Envío de correos

            {cantidadCorreosPendientes > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {cantidadCorreosPendientes}
              </span>
            )}

            {tabActiva === 'correos' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          TAB IMAGENES
      ======================================================= */}

      {tabActiva === 'imagenes' && (
        <div className="space-y-6">
          {/* ==================================================
              METRICAS
          =================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* TOTAL GENERAL */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total de tareas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalTareas}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {totalImagenes} imágenes
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <span className="text-xl">
                    📊
                  </span>
                </div>
              </div>
            </div>

            {/* PENDIENTES */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Tareas pendientes
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-900">
                    {cantidadTareasPendientes}
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    {cantidadImagenesPendientes} imágenes
                  </p>

                  {tamanioImagenesPendientes > 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      {tamanioImagenesPendientes} MB
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-amber-100 p-3">
                  <span className="text-xl">
                    ⏳
                  </span>
                </div>
              </div>
            </div>

            {/* PROCESADAS */}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Tareas procesadas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-900">
                    {cantidadTareasProcesadas}
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    {cantidadImagenesProcesadas} imágenes
                  </p>

                  {tamanioImagenesProcesadas > 0 && (
                    <p className="mt-1 text-xs text-emerald-600">
                      {tamanioImagenesProcesadas} MB
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-emerald-100 p-3">
                  <span className="text-xl">
                    ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              ACCION
          =================================================== */}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!puedeProcesarImagenes}
              onClick={procesarImagenes}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                puedeProcesarImagenes
                  ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-700'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              }`}
            >
              Procesar imágenes
            </button>
          </div>

          {/* ==================================================
              DETALLE
          =================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Detalle de tareas
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {detalleImagenes.length} registros
                  </p>
                </div>
              </div>
            </div>

            {detalleImagenes.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-slate-500">
                  No existen registros de tareas.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Código
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Usuario
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Estado
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Fecha
                        </th>

                        <th className="px-5 py-3 text-right font-semibold text-slate-600">
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {imagenesPagina.map((tarea, index) => (
                        <tr
                          key={
                            tarea.CodigoTarea ??
                            tarea.Id ??
                            index
                          }
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {tarea.CodigoTarea ??
                              tarea.Id ??
                              '-'}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {tarea.UserName ??
                              tarea.UserName ??
                              '-'}
                          </td>

                          <td className="px-5 py-4">
                            {tarea.Procesado === true ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                Procesado
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Pendiente
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {tarea.FechaRegistro ?? tarea.FechaRegistro }
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setImagenSeleccionada(
                                  tarea,
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACION */}

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Página {paginaImagenes} de{' '}
                    {totalPaginasImagenes}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={paginaImagenes === 1}
                      onClick={() =>
                        cambiarPaginaImagenes(
                          paginaImagenes - 1,
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Anterior
                    </button>

                    <button
                      type="button"
                      disabled={
                        paginaImagenes ===
                        totalPaginasImagenes
                      }
                      onClick={() =>
                        cambiarPaginaImagenes(
                          paginaImagenes + 1,
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          TAB CORREOS
      ======================================================= */}

      {tabActiva === 'correos' && (
        <div className="space-y-6">
          {/* ==================================================
              METRICAS
          =================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total de correos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {cantidadCorreosTotal}
              </p>
            </div>

            {/* PENDIENTES */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-amber-700">
                Correos pendientes
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-900">
                {cantidadCorreosPendientes}
              </p>
            </div>

            {/* PROCESADOS */}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-emerald-700">
                Correos procesados
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {cantidadCorreosProcesados}
              </p>
            </div>
          </div>

          {/* ==================================================
              ACCION
          =================================================== */}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!puedeProcesarCorreos}
              onClick={procesarCorreos}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                puedeProcesarCorreos
                  ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-700'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              }`}
            >
              Procesar correos
            </button>
          </div>

          {/* ==================================================
              DETALLE
          =================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Detalle de correos
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {detalleCorreos.length} registros
              </p>
            </div>

            {detalleCorreos.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-slate-500">
                  No existen registros de correos.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          ID
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Destinatario
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Estado
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-slate-600">
                          Fecha
                        </th>

                        <th className="px-5 py-3 text-right font-semibold text-slate-600">
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {correosPagina.map((correo, index) => (
                        <tr
                          key={
                            correo.Id ??
                            correo.id ??
                            index
                          }
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {correo.Id ??
                              correo.id ??
                              '-'}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {correo.Correo ??
                              correo.Email ??
                              correo.email ??
                              correo.Destinatario ??
                              '-'}
                          </td>

                          <td className="px-5 py-4">
                            {correo.Procesado === true ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                Procesado
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Pendiente
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {correo.FechaRegistro
                              ? new Date(
                                  correo.FechaRegistro,
                                ).toLocaleString()
                              : '-'}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setCorreoSeleccionado(
                                  correo,
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACION */}

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Página {paginaCorreos} de{' '}
                    {totalPaginasCorreos}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={paginaCorreos === 1}
                      onClick={() =>
                        cambiarPaginaCorreos(
                          paginaCorreos - 1,
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Anterior
                    </button>

                    <button
                      type="button"
                      disabled={
                        paginaCorreos ===
                        totalPaginasCorreos
                      }
                      onClick={() =>
                        cambiarPaginaCorreos(
                          paginaCorreos + 1,
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL IMAGEN
      ======================================================= */}

      {imagenSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Detalle de tarea
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Información de la tarea seleccionada
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setImagenSeleccionada(null)
                }
                className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              {Object.entries(
                imagenSeleccionada,
              ).map(([clave, valor]) => (
                <div
                  key={clave}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {clave}
                  </p>

                  <div className="mt-1 break-words text-sm text-slate-800">
                    {typeof valor === 'object' &&
                    valor !== null ? (
                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                        {JSON.stringify(
                          valor,
                          null,
                          2,
                        )}
                      </pre>
                    ) : (
                      String(valor ?? '-')
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setImagenSeleccionada(null)
                }
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL CORREO
      ======================================================= */}

      {correoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Detalle del correo
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Información del correo seleccionado
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCorreoSeleccionado(null)
                }
                className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6">
              {Object.entries(
                correoSeleccionado,
              ).map(([clave, valor]) => (
                <div
                  key={clave}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {clave}
                  </p>

                  <div className="mt-1 break-words text-sm text-slate-800">
                    {typeof valor === 'object' &&
                    valor !== null ? (
                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                        {JSON.stringify(
                          valor,
                          null,
                          2,
                        )}
                      </pre>
                    ) : (
                      String(valor ?? '-')
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setCorreoSeleccionado(null)
                }
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

