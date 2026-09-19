import { useNavigate } from 'react-router'

function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            WebFinsenseAdmin
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-500">
          Panel de monitoreo de Finsense.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Estado del sistema
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              Operativo
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Solicitudes
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              12.458
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Errores
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              23
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home