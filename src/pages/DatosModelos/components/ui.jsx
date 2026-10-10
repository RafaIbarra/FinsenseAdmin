export function formatNumber(value = 0) {
  return Number(value || 0).toLocaleString()
}

export function formatBytes(bytes = 0) {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`
}

export function Icon({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {children}
    </svg>
  )
}

export function StatCard({ label, value, description, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function ProgressBar({ percentage }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-700"
        style={{
          width: `${Math.min(percentage || 0, 100)}%`,
        }}
      />
    </div>
  )
}

export function TooltipGrafico({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-gray-900">
        {label}
      </p>

      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <span className="text-gray-500">
              {item.name}
            </span>

            <span className="font-semibold text-gray-900">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
