export default function Paginacion({
  pagina,
  totalPaginas,
  onCambiarPagina,
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
      <span className="text-xs text-slate-500">
        Página {pagina} de {totalPaginas}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onCambiarPagina(pagina - 1)}
          disabled={pagina === 1}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => onCambiarPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
