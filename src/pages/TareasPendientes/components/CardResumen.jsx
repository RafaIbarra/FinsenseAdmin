export default function CardResumen({
  titulo,
  valor,
  valorClassName = 'text-slate-900',
  icono,
  subtitulo,
  activo,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-2xl
        border
        p-5
        text-left
        transition-all
        duration-200
        ${
          activo
            ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {titulo}
          </p>

          <p className={`mt-2 text-3xl font-bold ${valorClassName}`}>
            {valor}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
          {icono}
        </div>
      </div>

      {subtitulo && (
        <div className="mt-4 text-left text-xs text-slate-500">
          {subtitulo}
        </div>
      )}
    </button>
  )
}
