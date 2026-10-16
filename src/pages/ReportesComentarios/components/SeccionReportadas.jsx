import { useState } from 'react'

import BadgeEstado from './BadgeEstado'

const TH =
  'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'

export default function SeccionReportadas({
  reportadas,
  onVerDetalle,
}) {
  const [busqueda, setBusqueda] = useState('')

  const filtradas = reportadas.filter((r) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      String(r.id).includes(q) ||
      r.user_name?.toLowerCase().includes(q) ||
      r.nombre_usuario?.toLowerCase().includes(q) ||
      r.apellido_usuario?.toLowerCase().includes(q) ||
      r.estado_resolucion?.toLowerCase().includes(q)
    )
  })

  return (
    <>
      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por usuario, nombre o estado..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className={TH}>Id</th>
                <th className={TH}>Usuario</th>
                <th className={TH}>Nombre</th>
                <th className={TH}>Apellido</th>
                <th className={TH}>Fecha de registro</th>
                <th className={TH}>Estado</th>
                <th className={TH}>Fecha de resolución</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    {reportadas.length === 0
                      ? 'Aún no hay reportes registrados.'
                      : 'No se encontraron reportes con esa búsqueda.'}
                  </td>
                </tr>
              ) : (
                filtradas.map((r) => (
                  <tr
                    key={r.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {r.id}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {r.user_name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {r.nombre_usuario}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {r.apellido_usuario}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {r.fecha_registro}
                    </td>
                    <td className="px-5 py-3">
                      <BadgeEstado estado={r.estado_resolucion} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {r.fecha_resolucion || '-'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(r.id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">
          {filtradas.length} de {reportadas.length} reportes
        </div>
      </div>
    </>
  )
}
