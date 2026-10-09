import ValorDetalle from './ValorDetalle'

export default function ModalDetalle({ titulo, datos, onClose }) {
  if (!datos) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            {titulo}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(datos).map(([clave, valor]) => {
              const esComplejo =
                valor !== null && typeof valor === 'object'

              return (
                <div
                  key={clave}
                  className={`rounded-xl bg-slate-50 p-4 ${
                    esComplejo ? 'sm:col-span-2' : ''
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    {clave}
                  </p>

                  <div className="mt-1">
                    <ValorDetalle valor={valor} clave={clave} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
