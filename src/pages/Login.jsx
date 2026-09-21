import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import request from '../../Api/request'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const expiredMessage = location.state?.message

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    formData.append('sesion-admin', '1')
    const response = await request({
      endpoint: 'sessions/login',
      method: 'POST',
      body: formData,
      notifyOnSessionExpired: false, // un 401 acá es "credenciales incorrectas", no expiración
    })

    setIsSubmitting(false)

    if (response.isSuccessful) {
      
      const { UserName, nombre, apellido, fecha_registro } = response.data
      
      login({ UserName, nombre, apellido, fecha_registro })
      navigate('/home', { replace: true })
      return
    }

    setError(response.data?.detail || 'Usuario o contraseña incorrectos.')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.28),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.3),_transparent_40%)]" />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-slate-950/50 backdrop-blur-xl lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700 p-10 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 shadow-lg shadow-cyan-950/20 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                <path d="M4 19V9l8-5 8 5v10" />
                <path d="M8 19v-5h8v5M9 10h.01M12 10h.01M15 10h.01" />
              </svg>
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90">Finsense</span>
          </div>

          <div className="max-w-sm">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-50/80">Panel administrativo</p>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">Monitorea tu aplicación con claridad.</h2>
            <p className="mt-5 text-sm leading-6 text-cyan-50/80">Consulta el dashboard, revisa informes y analiza las estadísticas de tu aplicación desde un solo lugar.</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyan-50/70">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(167,243,208,0.9)]" />
            Sistema operativo
          </div>
        </div>

        <div className="bg-white p-7 sm:p-10">
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">Acceso seguro</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Inicia sesión</h1>
              <p className="mt-2 text-sm text-slate-500">Ingresa para acceder al panel de monitoreo.</p>
            </div>

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Usuario
            </label>

            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Ingresa tu usuario"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Contraseña
            </label>

            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-teal-600 hover:shadow-teal-600/20 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login