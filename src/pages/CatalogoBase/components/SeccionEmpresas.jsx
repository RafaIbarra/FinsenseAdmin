import { useState } from 'react'
import ModalEmpresa from './ModalEmpresa'

function LogoEmpresa({ src, nombre, size = 'h-10 w-10' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={nombre}
        className={`${size} rounded-lg border border-gray-200 bg-white object-contain`}
      />
    )
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600`}
    >
      {nombre?.trim()?.charAt(0)?.toUpperCase() || '?'}
    </div>
  )
}

const obtenerCantidad = (empresa) =>
  empresa.CantidadRegistros ??
  empresa.cantidad_movimientos ??
  0

export default function SeccionEmpresas({
  empresas,
  onGuardado,
}) {
  const [busqueda, setBusqueda] = useState('')

  // null = cerrado | 0 = nueva | id = editar
  const [modal, setModal] = useState(null)

  const filtradas = empresas.filter((e) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      e.NombreEmpresa?.toLowerCase().includes(q) ||
      e.Rubro?.toLowerCase().includes(q) ||
      e.Ruc?.toLowerCase().includes(q)
    )
  })

  return (
    <>
      {/* BUSCADOR + AGREGAR */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, RUC o rubro..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setModal(0)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Agregar empresa
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Id
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Logo
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nombre
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  RUC
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rubro
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Fecha de registro
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Registros
                </th>
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
                    {empresas.length === 0
                      ? 'Aún no hay empresas registradas.'
                      : 'No se encontraron empresas con esa búsqueda.'}
                  </td>
                </tr>
              ) : (
                filtradas.map((empresa) => (
                  <tr
                    key={empresa.Id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {empresa.Id}
                    </td>

                    <td className="px-5 py-3">
                      <LogoEmpresa
                        src={empresa.UrlLogo}
                        nombre={empresa.NombreEmpresa}
                      />
                    </td>

                    <td className="px-5 py-3 font-medium text-gray-900">
                      {empresa.NombreEmpresa}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {empresa.Ruc}
                    </td>

                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {empresa.Rubro || '-'}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {empresa.FechaRegistro}
                    </td>

                    <td className="px-5 py-3 text-gray-600">
                      {obtenerCantidad(empresa)}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setModal(empresa.Id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">
          {filtradas.length} de {empresas.length} empresas
        </div>
      </div>

      {/* MODAL */}
      {modal !== null && (
        <ModalEmpresa
          empresaId={modal}
          cantidadInicial={obtenerCantidad(
            empresas.find((e) => e.Id === modal) ?? {},
          )}
          onClose={() => setModal(null)}
          onGuardado={onGuardado}
        />
      )}
    </>
  )
}
