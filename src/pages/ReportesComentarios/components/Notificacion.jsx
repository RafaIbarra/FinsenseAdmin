import { useEffect } from 'react'

// tipo: 'exito' | 'error'
export default function Notificacion({ tipo, mensaje, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [mensaje, onClose])

  const exito = tipo === 'exito'

  return (
    <div className="fixed right-6 top-6 z-[60] max-w-sm">
      <div
        role="status"
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
          exito
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-800'
        }`}
      >
        <p className="flex-1 text-sm font-medium">{mensaje}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 transition hover:opacity-100"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
