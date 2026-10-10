export default function ModalBase({
  titulo,
  subtitulo,
  onClose,
  children,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {titulo}
            </h3>

            {subtitulo && (
              <p className="mt-0.5 text-sm text-gray-500">
                {subtitulo}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
