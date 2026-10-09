import { useState } from 'react'
import CardResumen from './CardResumen'
import BadgeEstado from './BadgeEstado'
import Paginacion from './Paginacion'
import { REGISTROS_POR_PAGINA } from '../constants'

const TEXTO_FILTRO = {
  todos: 'Mostrando todas las tareas.',
  pendientes: 'Mostrando solamente tareas pendientes.',
  procesados: 'Mostrando solamente tareas procesadas.',
}

export default function SeccionImagenes({
  data,
  procesando,
  onProcesar,
  onVerDetalle,
}) {
  const [filtro, setFiltro] = useState('todos')
  const [pagina, setPagina] = useState(1)

  // -------------------- RESUMEN --------------------

  const resumen = data?.Resumen
  const totalPendientes = resumen?.TotalPendientes

  const totalTareas = totalPendientes?.CantidadTareas ?? 0
  const totalImagenes = totalPendientes?.CantidadImagenes ?? 0
  const totalTamannoImagenes =
    totalPendientes?.TotalTamannoImagen_MB ?? 0

  const totalPorProcesado = resumen?.TotalPorProcesado ?? []

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

  const puedeProcesar = cantidadTareasPendientes > 0

  // -------------------- FILTRO + PAGINACION --------------------

  const detalle = data?.detalle ?? []

  const detalleFiltrado = detalle.filter((tarea) => {
    if (filtro === 'pendientes') return tarea.Procesado === false
    if (filtro === 'procesados') return tarea.Procesado === true
    return true
  })

  const totalPaginas = Math.max(
    1,
    Math.ceil(detalleFiltrado.length / REGISTROS_POR_PAGINA)
  )

  const inicio = (pagina - 1) * REGISTROS_POR_PAGINA

  const filasPagina = detalleFiltrado.slice(
    inicio,
    inicio + REGISTROS_POR_PAGINA
  )

  const seleccionarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro)
    setPagina(1)
  }

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return
    setPagina(nuevaPagina)
  }

  // -------------------- RENDER --------------------

  return (
    <>
      {/* CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardResumen
          titulo="Total de tareas"
          valor={totalTareas}
          icono="📋"
          subtitulo={`${totalImagenes} imágenes · ${totalTamannoImagenes} MB`}
          activo={filtro === 'todos'}
          onClick={() => seleccionarFiltro('todos')}
        />

        <CardResumen
          titulo="Tareas pendientes"
          valor={cantidadTareasPendientes}
          valorClassName="text-amber-600"
          icono="⏳"
          subtitulo={`${cantidadImagenesPendientes} imágenes · ${tamanioImagenesPendientes} MB`}
          activo={filtro === 'pendientes'}
          onClick={() => seleccionarFiltro('pendientes')}
        />

        <CardResumen
          titulo="Tareas procesadas"
          valor={cantidadTareasProcesadas}
          valorClassName="text-emerald-600"
          icono="✓"
          subtitulo={`${cantidadImagenesProcesadas} imágenes · ${tamanioImagenesProcesadas} MB`}
          activo={filtro === 'procesados'}
          onClick={() => seleccionarFiltro('procesados')}
        />
      </div>

      {/* ACCION */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!puedeProcesar || procesando}
          onClick={onProcesar}
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
              {TEXTO_FILTRO[filtro]}
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {detalleFiltrado.length} registros
          </span>
        </div>

        {filasPagina.length === 0 ? (
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
                  <th className="px-5 py-3 text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filasPagina.map((tarea, index) => (
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
                      <BadgeEstado procesado={tarea.Procesado} />
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {tarea.FechaRegistro ?? '-'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(tarea)}
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

        {detalleFiltrado.length > 0 && (
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onCambiarPagina={cambiarPagina}
          />
        )}
      </div>
    </>
  )
}
