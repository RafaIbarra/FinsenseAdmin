export default function BadgeEstado({ procesado }) {
  return procesado ? (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      Procesado
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      Pendiente
    </span>
  )
}
