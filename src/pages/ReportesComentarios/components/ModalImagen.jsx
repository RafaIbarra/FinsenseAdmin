import { useEffect } from 'react'

// Modal amplio para ver una imagen (con navegación si hay varias)
export default function ModalImagen({
  urls,
  indice,
  onCambiar,
  onClose,
}) {
  const total = urls.length
  const url = urls[indice]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && indice < total - 1)
        onCambiar(indice + 1)
      if (e.key === 'ArrowLeft' && indice > 0)
        onCambiar(indice - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [indice, total, onCambiar, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Imagen {indice + 1} de {total}
          </h3>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Abrir en pestaña nueva
            </a>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Cerrar"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-gray-50 p-4">
          <img
            src={url}
            alt={`Imagen ${indice + 1}`}
            className="max-h-[75vh] max-w-full rounded-lg object-contain"
          />

          {total > 1 && (
            <>
              <button
                type="button"
                disabled={indice === 0}
                onClick={() => onCambiar(indice - 1)}
                className="absolute left-4 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-white disabled:opacity-40"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                disabled={indice === total - 1}
                onClick={() => onCambiar(indice + 1)}
                className="absolute right-4 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-white disabled:opacity-40"
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
