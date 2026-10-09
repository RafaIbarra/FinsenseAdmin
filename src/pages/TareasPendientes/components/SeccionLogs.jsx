import { useState } from 'react'
import CardResumen from './CardResumen'

const ICONOS = ['📄', '📑', '🗂', '🧾', '📋', '🗃']

const obtenerIcono = (index) => ICONOS[index % ICONOS.length]

export default function SeccionLogs({
  logs,
  cargandoLogs,
  logSeleccionado,
  cargandoLog,
  onVerLog,
  onCerrarLog,
}) {
  const claves = Object.keys(logs ?? {})

  const [claveActiva, setClaveActiva] = useState(claves[0] ?? null)

  // Mientras cargan los logs
  if (cargandoLogs) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <div className="text-sm text-slate-500">
          Cargando logs...
        </div>
      </div>
    )
  }

  if (claves.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No se encontraron logs.
      </div>
    )
  }

  // Clave vigente (por si cambian las keys al recargar)
  const clave = claves.includes(claveActiva)
    ? claveActiva
    : claves[0]

  const registros = logs[clave] ?? []
  const totalRegistros = claves.reduce(
    (acc, k) => acc + (logs[k]?.length ?? 0),
    0
  )

  return (
    <>
      {/* CARDS (una por cada script) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {claves.map((key, index) => (
          <CardResumen
            key={key}
            titulo={key}
            valor={logs[key]?.length ?? 0}
            valorClassName={
              clave === key ? 'text-indigo-600' : 'text-slate-900'
            }
            icono={obtenerIcono(index)}
            subtitulo={`${logs[key]?.length ?? 0} archivos de log`}
            activo={clave === key}
            onClick={() => {
              setClaveActiva(key)
              onCerrarLog()
            }}
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {totalRegistros} logs en total
      </p>

      {/* DETALLE: tabla (izquierda) + terminal (derecha) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* TABLA */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              {clave}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Selecciona un log para ver su contenido.
            </p>
          </div>

          {registros.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No existen logs para este script.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Archivo</th>
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-5 py-3 text-right">
                      Tamaño (KB)
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {registros.map((log) => {
                    const activo =
                      logSeleccionado?.nombre === log.nombre

                    return (
                      <tr
                        key={log.nombre}
                        onClick={() => onVerLog(log.nombre)}
                        className={`cursor-pointer ${
                          activo
                            ? 'bg-indigo-50'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p
                            className={`break-all text-xs font-medium ${
                              activo
                                ? 'text-indigo-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {log.nombre}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                          {log.fecha}
                        </td>

                        <td className="px-5 py-4 text-right text-xs text-slate-600">
                          {log.tamano_kb}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TERMINAL */}
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />

              <span className="ml-3 text-xs font-medium text-slate-400">
                {logSeleccionado
                  ? logSeleccionado.nombre
                  : 'sin selección'}
              </span>
            </div>

            {logSeleccionado && (
              <button
                type="button"
                onClick={onCerrarLog}
                className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="max-h-[60vh] min-h-80 overflow-y-auto p-5">
            {cargandoLog ? (
              <div className="flex min-h-60 items-center justify-center">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
              </div>
            ) : logSeleccionado ? (
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-emerald-400">
                {logSeleccionado.contenido}
              </pre>
            ) : (
              <div className="flex min-h-60 items-center justify-center">
                <p className="text-sm text-slate-500">
                  👈 Selecciona un log de la tabla para ver su
                  contenido.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
