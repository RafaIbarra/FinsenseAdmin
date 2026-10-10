import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const enlaces = [
  { to: '/control-usuario', label: 'Control Usuario' },
  { to: '/empresas', label: 'Control Empresas' },
  { to: '/datos-modelos', label: 'Datos Modelos' },
  { to: '/tareas-pendientes', label: 'Tareas pendientes' },
]

const IconoLogo = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M4 19V9l8-5 8 5v10" />
    <path d="M8 19v-5h8v5M9 10h.01M12 10h.01M15 10h.01" />
  </svg>
)

function Navbar() {
  const { dataUser, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const inicial = dataUser?.nombre
    ?.charAt(0)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:px-5">
          {/* MARCA + SLOT DE ICONO */}
          <Link
            to="/home"
            className="group flex items-center gap-3"
          >
            {/*
              SLOT DE ICONO:
              Reemplaza el contenido de este div por tu logo/imagen.
              También puedes quitar el gradiente y poner un <img src="..." />.
            */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-105">
              {IconoLogo}
            </div>

            <div className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-white">
                WebFinsenseAdmin
              </span>

              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
                Panel administrativo
              </span>
            </div>
          </Link>

          {/* NAVEGACIÓN ESCRITORIO */}
          <nav className="hidden items-center gap-1 lg:flex">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {enlace.label}
              </NavLink>
            ))}
          </nav>

          {/* USUARIO + LOGOUT */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-600 text-xs font-bold text-white">
                {inicial ?? '?'}
              </div>

              <span className="max-w-32 truncate text-sm font-medium text-slate-200">
                {dataUser?.nombre}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5M21 12H9" />
              </svg>
              Cerrar sesión
            </button>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            type="button"
            onClick={() => setMenuAbierto((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Abrir menú"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {menuAbierto ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          {/* MENÚ MÓVIL DESPLEGABLE */}
          {menuAbierto && (
            <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/50 backdrop-blur-xl lg:hidden">
              <nav className="flex flex-col">
                {enlaces.map((enlace) => (
                  <NavLink
                    key={enlace.to}
                    to={enlace.to}
                    onClick={() => setMenuAbierto(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {enlace.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-600 text-xs font-bold text-white">
                    {inicial ?? '?'}
                  </div>

                  <span className="text-sm font-medium text-slate-200">
                    {dataUser?.nombre}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
