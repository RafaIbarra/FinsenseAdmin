import { useState } from 'react'
import {
  Icon,
  StatCard,
  ProgressBar,
  formatNumber,
} from './ui'
import ModalBase from './ModalBase'

const REGISTROS_POR_PAGINA = 10

export default function SeccionErrores({ errores }) {
  const [pagina, setPagina] = useState(1)
  const [errorSeleccionado, setErrorSeleccionado] =
    useState(null)

  // -------------------- DATOS DERIVADOS --------------------

  const totalErrores = errores?.total_general ?? 0
  const porTipo = errores?.por_tipo_error ?? []
  const porProceso = errores?.por_proceso ?? []
  const porModelo = errores?.por_modelo ?? []
  const detalles = errores?.detalles_registros ?? []

  const modelosAfectados = new Set(
    porModelo.map((item) => item.NombreModelo),
  ).size

  const tipoMasFrecuente =
    [...porTipo].sort(
      (a, b) => b.cantidad - a.cantidad,
    )[0] ?? null

  const procesoMasAfectado =
    [...porProceso].sort(
      (a, b) => b.cantidad - a.cantidad,
    )[0] ?? null

  // -------------------- PAGINACIÓN --------------------

  const totalPaginas = Math.max(
    1,
    Math.ceil(detalles.length / REGISTROS_POR_PAGINA),
  )

  const paginaActual = Math.min(pagina, totalPaginas)

  const inicio =
    (paginaActual - 1) * REGISTROS_POR_PAGINA

  const detallesPagina = detalles.slice(
    inicio,
    inicio + REGISTROS_POR_PAGINA,
  )

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return
    }
    setPagina(nuevaPagina)
  }

  // -------------------- RENDER --------------------

  return (
    <>
      {/* RESUMEN */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total errores"
          value={formatNumber(totalErrores)}
          description="Registros de error acumulados"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
              />
            </Icon>
          }
        />

        <StatCard
          label="Tipos de error"
          value={formatNumber(porTipo.length)}
          description={
            tipoMasFrecuente
              ? `Más frecuente: ${tipoMasFrecuente.TipoError}`
              : undefined
          }
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h10"
              />
            </Icon>
          }
        />

        <StatCard
          label="Procesos afectados"
          value={formatNumber(porProceso.length)}
          description={
            procesoMasAfectado
              ? `Más afectado: ${procesoMasAfectado.Proceso}`
              : undefined
          }
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-9-9m9 0-9 9"
              />
            </Icon>
          }
        />

        <StatCard
          label="Modelos afectados"
          value={formatNumber(modelosAfectados)}
          description="Modelos con al menos un error"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.1a2.25 2.25 0 0 1 4.5 0m-4.5 0a2.25 2.25 0 0 0-2.1 1.5M9.75 3.1 3.6 5.7a2.25 2.25 0 0 0 .3 4.2m6.15-6.8 6.15 2.6a2.25 2.25 0 0 1 .3 4.2m-12.9-2.6a2.25 2.25 0 0 0 .3 4.2m12.9-4.2a2.25 2.25 0 0 1-2.1 1.5m-8.7 0a2.25 2.25 0 0 0 2.1 1.5m0 0 3.45 3.3m0 0a2.25 2.25 0 0 1 .3 4.2m-.3-4.2a2.25 2.25 0 0 0-.3 4.2"
              />
            </Icon>
          }
        />
      </div>

      {/* TIPOS DE ERROR (cards con barra) */}
      {porTipo.length > 0 && (
        <section className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Errores por tipo
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Clasificación de los errores registrados.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {porTipo.map((tipo) => (
              <div
                key={tipo.TipoError}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-medium text-gray-900">
                    {tipo.TipoError}
                  </h4>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    {formatNumber(tipo.cantidad)}
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    percentage={tipo.porcentaje}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {tipo.porcentaje}% del total
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POR PROCESO (cards) + POR MODELO (tabla) */}
      <div className="mb-8 grid gap-6 xl:grid-cols-5">
        {porProceso.length > 0 && (
          <section className="xl:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Errores por proceso
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Distribución según el proceso que falló.
              </p>
            </div>

            <div className="space-y-4">
              {porProceso.map((proceso) => (
                <div
                  key={proceso.Proceso}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium text-gray-900">
                      {proceso.Proceso}
                    </h4>

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      {formatNumber(proceso.cantidad)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      percentage={proceso.porcentaje}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {proceso.porcentaje}% del total
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {porModelo.length > 0 && (
          <section className="xl:col-span-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Errores por modelo
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Modelos y procesos donde ocurrieron errores.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="max-h-[420px] overflow-x-auto overflow-y-auto">
                <table className="w-full min-w-[500px] text-left">
                  <thead className="sticky top-0 border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Modelo
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Proceso
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Cantidad
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        %
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {porModelo.map((item, index) => (
                      <tr
                        key={`${item.NombreModelo}-${item.Proceso}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                          {item.NombreModelo}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                            {item.Proceso}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatNumber(item.cantidad)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                          {item.porcentaje}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* DETALLE DE ERRORES */}
      {detalles.length > 0 && (
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detalle de errores
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Registros individuales de error. Selecciona
                uno para ver el mensaje completo.
              </p>
            </div>

            <div className="text-sm text-gray-400">
              {formatNumber(detalles.length)} registros
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Fecha
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Proceso
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Modelo
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Tipo de error
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {detallesPagina.map((error) => (
                    <tr
                      key={error.Id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        #{error.Id}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {error.FechaRegistro}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                          {error.Proceso}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {error.NombreModelo}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          {error.TipoError}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setErrorSeleccionado(error)
                          }
                          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          Ver →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                <span className="text-xs text-gray-500">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() =>
                      cambiarPagina(paginaActual - 1)
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: totalPaginas },
                    (_, index) => index + 1,
                  ).map((numero) => (
                    <button
                      key={numero}
                      type="button"
                      onClick={() =>
                        cambiarPagina(numero)
                      }
                      className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        numero === paginaActual
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {numero}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      paginaActual === totalPaginas
                    }
                    onClick={() =>
                      cambiarPagina(paginaActual + 1)
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MODAL ERROR */}
      {errorSeleccionado && (
        <ModalBase
          titulo={`Error #${errorSeleccionado.Id}`}
          subtitulo={`${errorSeleccionado.Proceso} · ${errorSeleccionado.NombreModelo}`}
          onClose={() => setErrorSeleccionado(null)}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              {errorSeleccionado.TipoError}
            </span>

            <span className="text-xs text-gray-400">
              {errorSeleccionado.FechaRegistro}
            </span>
          </div>

          <pre className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-700">
            {errorSeleccionado.RespuestaError}
          </pre>
        </ModalBase>
      )}
    </>
  )
}
