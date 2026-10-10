import { useState } from 'react'
import { Icon, formatNumber } from './ui'

const GRUPOS = [
  {
    clave: 'lector_imagen',
    titulo: 'Lector de imágenes',
    descripcion: 'Modelos de Google (Gemini) disponibles.',
    icono: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.16-5.16a2.25 2.25 0 0 1 3.18 0l5.16 5.16m-1.5-1.5 1.41-1.41a2.25 2.25 0 0 1 3.18 0l2.91 2.91M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        />
      </Icon>
    ),
  },
  {
    clave: 'clasificador',
    titulo: 'Clasificador',
    descripcion: 'Modelos de Groq disponibles.',
    icono: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.6 3.9 3.4 6.6a.9.9 0 0 0 0 1.65l6.2 2.7a2.7 2.7 0 0 0 2.16 0l6.2-2.7a.9.9 0 0 0 0-1.65l-6.2-2.7a2.7 2.7 0 0 0-2.16 0ZM3 11.1l6.2 2.7c.7.3 1.5.3 2.16 0l6.2-2.7M3 15.6l6.2 2.7c.7.3 1.5.3 2.16 0l6.2-2.7"
        />
      </Icon>
    ),
  },
]

export default function SeccionDisponibilidad({
  disponibilidad,
}) {
  const [busqueda, setBusqueda] = useState('')

  const filtrar = (modelos = []) => {
    const termino = busqueda.trim().toLowerCase()

    if (!termino) return modelos

    return modelos.filter((modelo) =>
      modelo.toLowerCase().includes(termino),
    )
  }

  const totalModelos = GRUPOS.reduce(
    (total, grupo) =>
      total + (disponibilidad?.[grupo.clave]?.length ?? 0),
    0,
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {formatNumber(totalModelos)} modelos disponibles
          en total.
        </p>

        <input
          type="text"
          value={busqueda}
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
          placeholder="Buscar modelo..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {GRUPOS.map((grupo) => {
          const modelos = filtrar(
            disponibilidad?.[grupo.clave],
          )

          return (
            <div
              key={grupo.clave}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {grupo.icono}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {grupo.titulo}
                    </h3>

                    <p className="text-xs text-gray-400">
                      {grupo.descripcion}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {formatNumber(modelos.length)}
                </span>
              </div>

              <div className="mt-5 max-h-[480px] overflow-y-auto pr-1">
                {modelos.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No hay modelos que coincidan con la
                    búsqueda.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {modelos.map((modelo) => (
                      <span
                        key={modelo}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                      >
                        {modelo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
