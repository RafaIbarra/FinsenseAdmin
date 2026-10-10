function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden bg-slate-950">
      {/* Brillos sutiles heredados del Login */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.12),_transparent_40%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text font-semibold text-transparent">
            WebFinsenseAdmin
          </span>
          . Todos los derechos reservados.
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(167,243,208,0.9)]" />
          Sistema operativo
        </div>
      </div>
    </footer>
  )
}

export default Footer
