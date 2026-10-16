export default function BadgeEstado({ estado }) {
  const resuelto = estado === 'Resuelto'

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        resuelto
          ? 'bg-green-50 text-green-600'
          : 'bg-amber-50 text-amber-600'
      }`}
    >
      {estado || '-'}
    </span>
  )
}
