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
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        Administración
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Panel de acceso
        </h2>

        <p className="mt-2 max-w-xl text-gray-500">
          Seleccioná una sección para administrar y monitorear
          los diferentes módulos de Finsense.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {accesos.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-all duration-300 group-hover:scale-150 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg">
                  {item.icon}
                </div>

                <svg
                  className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600"
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

              <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
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