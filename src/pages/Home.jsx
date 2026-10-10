import { Link } from 'react-router'

const accesos = [
  {
    to: '/control-usuario',
    title: 'Control Usuario',
    description: 'Gestión de usuarios del sistema.',
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.955M15 19.128v-3.64m0 3.64a9.35 9.35 0 0 1-2.625.372 9.337 9.337 0 0 1-4.125-.955M15 15.488a6.75 6.75 0 0 0-6-3.488m6 3.488a6.75 6.75 0 0 1 6-3.488M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
      </svg>
    ),
  },
  {
    to: '/empresas',
    title: 'Control Empresas',
    description: 'Gestión empresas registradas.',
    icon: ( 
      <svg 
        className="h-7 w-7" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="1.8" 
      > 
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01M15 12v.01M15 15v.01M15 18v.01" 
          /> 
      </svg> 
      ),
  },
  {
    to: '/datos-modelos',
    title: 'Datos Modelos',
    description: 'Consulta y administración de modelos.',
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 8h8M8 12h8M8 16h5"
        />
      </svg>
    ),
  },
  {
    to: '/tareas-pendientes',
    title: 'Tareas pendientes',
    description: 'Seguimiento de tareas asignadas.',
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 11.5 11 13l4-4"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 4V3h6v1"
        />
      </svg>
    ),
  },
]

function Home() {
  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* HERO CON GRADIENTE (mismo lenguaje del Login) */}
      <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700 p-8 text-white shadow-2xl shadow-cyan-900/30 sm:p-10">
        {/* Brillos decorativos */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-blue-800/30 blur-2xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-cyan-50 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 shadow-[0_0_10px_rgba(167,243,208,0.9)]" />
            Administración
          </div>

          <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            Panel de acceso
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-cyan-50/85">
            Seleccioná una sección para administrar y
            monitorear los diferentes módulos de Finsense.
          </p>
        </div>
      </div>

      {/* TARJETAS DE ACCESO */}
      <div className="grid gap-6 md:grid-cols-3">
        {accesos.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/10"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-50 opacity-0 transition-all duration-300 group-hover:scale-150 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                  {item.icon}
                </div>

                <svg
                  className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-teal-600">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-teal-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Acceder
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
