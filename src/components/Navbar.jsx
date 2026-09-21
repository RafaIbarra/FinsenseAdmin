import { Link } from 'react-router'

import { useAuth } from '../../context/AuthContext'
function Navbar() {
  const { dataUser, logout } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/home" className="text-xl font-bold text-gray-900">
          WebFinsenseAdmin
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link to="/control-usuario" className="hover:text-gray-900">Control Usuario</Link>
          <Link to="/datos-modelos" className="hover:text-gray-900">Datos Modelos</Link>
          <Link to="/tareas-pendientes" className="hover:text-gray-900">Tareas pendientes</Link>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-500 sm:inline">
            {dataUser?.nombre}
          </span>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar