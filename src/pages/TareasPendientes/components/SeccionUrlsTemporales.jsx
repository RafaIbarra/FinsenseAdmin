import { useState } from 'react'
import CardResumen from './CardResumen'
import Paginacion from './Paginacion'
import { REGISTROS_POR_PAGINA } from '../constants'

const TEXTO_FILTRO = {
  todos: 'Mostrando todos los procesos.',
  pendientes: 'Mostrando procesos pendientes de eliminación.',
  eliminados: 'Mostrando procesos ya eliminados.',
}

const BadgePendienteEliminacion = ({ pendiente }) =>
  pendiente ? (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      Pendiente eliminación
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      Eliminado
    </span>
  )

export default function SeccionUrlsTemporales({
  data,
  procesando,
  onProcesar,
  onVerDetalle,
}) {
  const [filtro, setFiltro] = useState('todos')
  const [pagina, setPagina] = useState(1)

  // -------------------- RESUMEN --------------------

  const resumen = data?.Resumen

  const totalProcesos = resumen?.CantidadProcesos ?? 0
  const totalImagenes = resumen?.CantidadImagenes ?? 0
  const totalTamannoMB = resumen?.TotalTamannoImagen_MB ?? 0

  const totalPorPendiente =
    resumen?.TotalPorPendienteEliminacion ?? []

  const resumenEliminados = totalPorPendiente.find(
    (item) => item.PendienteEliminacion === false
  )

  const resumenPendientes = totalPorPendiente.find(
    (item) => item.PendienteEliminacion === true
  )

  const cantidadPendientes =
    resumen?.CantidadPendientesEliminacion ??
    resumenPendientes?.CantidadProcesos ??
    0

  const cantidadEliminados =
    resumenEliminados?.CantidadProcesos ?? 0

  const imagenesPendientes =
    resumenPendientes?.CantidadImagenes ?? 0

  const tamannoPendientes =
    resumenPendientes?.TotalTamannoImagen_MB ?? 0

  const imagenesEliminados =
    resumenEliminados?.CantidadImagenes ?? 0

  const tamannoEliminados =
    resumenEliminados?.TotalTamannoImagen_MB ?? 0

  const puedeProcesar = cantidadPendientes > 0

  // -------------------- FILTRO + PAGINACION --------------------

  const detalle = data?.detalle ?? []

  const detalleFiltrado = detalle.filter((proceso) => {
    if (filtro === 'pendientes') {
      return proceso.PendienteEliminacion === true
    }

    if (filtro === 'eliminados') {
      return proceso.PendienteEliminacion === false
    }

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
          titulo="Total de procesos"
          valor={totalProcesos}
          icono="🔗"
          subtitulo={`${totalImagenes} imágenes · ${totalTamannoMB} MB`}
          activo={filtro === 'todos'}
          onClick={() => seleccionarFiltro('todos')}
        />

        <CardResumen
          titulo="Pendientes de eliminación"
          valor={cantidadPendientes}
          valorClassName="text-amber-600"
          icono="⏳"
          subtitulo={`${imagenesPendientes} imágenes · ${tamannoPendientes} MB`}
          activo={filtro === 'pendientes'}
          onClick={() => seleccionarFiltro('pendientes')}
        />

        <CardResumen
          titulo="Eliminados"
          valor={cantidadEliminados}
          valorClassName="text-emerald-600"
          icono="🗑"
          subtitulo={`${imagenesEliminados} imágenes · ${tamannoEliminados} MB`}
          activo={filtro === 'eliminados'}
          onClick={() => seleccionarFiltro('eliminados')}
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

          {procesando
            ? 'Procesando...'
            : 'Eliminar URLs temporales'}
        </button>
      </div>

      {/* DETALLE */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Detalle de procesos
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
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Código proceso</th>
                  <th className="px-5 py-3">Usuario</th>
                  <th className="px-5 py-3">Imágenes</th>
                  <th className="px-5 py-3">Tamaño MB</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha registro</th>
                  <th className="px-5 py-3 text-right">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filasPagina.map((proceso, index) => (
                  <tr
                    key={proceso.CodigoProceso ?? index}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {proceso.CodigoProceso ?? '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {proceso.UserName ?? '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {proceso.CantidadRegistros ?? '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {proceso.TotalTamannoImagen_MB ?? '-'}
                    </td>

                    <td className="px-5 py-4">
                      <BadgePendienteEliminacion
                        pendiente={proceso.PendienteEliminacion}
                      />
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {proceso.FechaRegistro ?? '-'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(proceso)}
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
