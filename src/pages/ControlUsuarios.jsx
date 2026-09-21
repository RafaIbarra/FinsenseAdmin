import { useEffect, useState } from 'react'
import request from '../../Api/request'

function Icon({ children, className = 'h-5 w-5' }) {
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

function StatCard({ icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
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

function formatBytes(bytes) {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`
}

function ControlUsuarios() {
  const [datos, setDatos] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)

  const carga_datos = async () => {
    try {
      const endpoint = 'users/data-users'

      const response = await request({
        endpoint,
        method: 'GET',
        body: {},
      })

      console.log(response.data)
      setDatos(response.data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    carga_datos()
  }, [])

  if (cargando) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando usuarios...
          </div>
        </div>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          No se pudieron cargar los datos de usuarios.
        </div>
      </div>
    )
  }

  const usuariosFiltrados = datos.filter((usuario) => {
    const texto = busqueda.toLowerCase()

    return (
      usuario.NombreUsuario?.toLowerCase().includes(texto) ||
      usuario.ApellidoUsuario?.toLowerCase().includes(texto) ||
      usuario.UserName?.toLowerCase().includes(texto) ||
      usuario.Correo?.toLowerCase().includes(texto)
    )
  })

  const totalUsuarios = datos.length

  const administradores = datos.filter(
    (usuario) => usuario.IsAdmin,
  ).length

  const usuariosNormales = totalUsuarios - administradores

  const sesionesActivas = datos.reduce(
    (total, usuario) =>
      total + (usuario.Sesiones?.SesionesActivas?.length || 0),
    0,
  )

  const totalSesiones = datos.reduce(
    (total, usuario) =>
      total + (usuario.Sesiones?.Cantidad || 0),
    0,
  )

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">

      {/* Encabezado */}

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Administración
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Control de usuarios
            </h2>

            <p className="mt-2 text-gray-500">
              Consulta y monitoreo de los usuarios de Finsense.
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {totalUsuarios} usuarios registrados
          </div>
        </div>
      </div>

      {/* Estadísticas */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Usuarios"
          value={totalUsuarios}
          description="Usuarios registrados"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.955M15 19.128v-3.64m0 3.64a9.35 9.35 0 0 1-2.625.372 9.337 9.337 0 0 1-4.125-.955M15 15.488a6.75 6.75 0 0 0-6-3.488m6 3.488a6.75 6.75 0 0 1 6-3.488M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </Icon>
          }
        />

        <StatCard
          label="Administradores"
          value={administradores}
          description={`${usuariosNormales} usuarios normales`}
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
              />
            </Icon>
          }
        />

        <StatCard
          label="Sesiones"
          value={totalSesiones.toLocaleString()}
          description="Sesiones registradas"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m4 0H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
              />
            </Icon>
          }
        />

        <StatCard
          label="Sesiones activas"
          value={sesionesActivas}
          description="Conexiones actuales"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle cx="12" cy="12" r="9" />
            </Icon>
          }
        />

      </div>

      {/* Buscador */}

      <div className="mb-6">
        <div className="relative max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Icon className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path
                strokeLinecap="round"
                d="m20 20-4-4"
              />
            </Icon>
          </div>

          <input
            type="text"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre, usuario o correo..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Usuarios */}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">

        {usuariosFiltrados.map((usuario) => {
          const modelos =
            usuario.EstadisticasModelos?.Cantidad || 0

          const tokens =
            usuario.EstadisticasModelos?.Tokens?.TotalTokens || 0

          const imagenesPendientes =
            usuario.ImagenesPendientes?.Cantidad || 0

          const movimientos =
            usuario.MovimientosGastos?.Cantidad || 0

          const sesiones =
            usuario.Sesiones?.Cantidad || 0

          const sesionesActivasUsuario =
            usuario.Sesiones?.SesionesActivas?.length || 0

          return (
            <div
              key={usuario.Id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >

              {/* Usuario */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                    {usuario.NombreUsuario?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {usuario.NombreUsuario}{' '}
                      {usuario.ApellidoUsuario}
                    </h3>

                    <p className="text-sm text-gray-500">
                      @{usuario.UserName}
                    </p>
                  </div>

                </div>

                {usuario.IsAdmin ? (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                    Admin
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                    Usuario
                  </span>
                )}

              </div>

              {/* Correo */}

              <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

                <Icon className="h-4 w-4">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                  <path d="m3 7 9 6 9-6" />
                </Icon>

                <span className="truncate">
                  {usuario.Correo}
                </span>

              </div>

              {/* Estadísticas */}

              <div className="mt-5 grid grid-cols-3 gap-2">

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    Peticiones a Modelos
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {modelos}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    Sesiones
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {sesiones}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    Imágenes
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {imagenesPendientes}
                  </p>
                </div>

              </div>

              {/* Tokens */}

              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600">
                    Tokens utilizados
                  </span>

                  <span className="text-sm font-bold text-blue-700">
                    {tokens.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Sesión activa */}

              {sesionesActivasUsuario > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  {sesionesActivasUsuario}{' '}
                  {sesionesActivasUsuario === 1
                    ? 'sesión activa'
                    : 'sesiones activas'}
                </div>
              )}

              {/* Footer */}

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                <div className="text-xs text-gray-400">
                  ID: {usuario.Id}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setUsuarioSeleccionado(usuario)
                  }
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Ver detalles →
                </button>

              </div>

            </div>
          )
        })}

      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="font-medium text-gray-700">
            No se encontraron usuarios
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Probá con otro nombre, usuario o correo.
          </p>
        </div>
      )}

      {/* Modal de detalles */}

      {usuarioSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          onClick={() => setUsuarioSeleccionado(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                  {usuarioSeleccionado.NombreUsuario
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {usuarioSeleccionado.NombreUsuario}{' '}
                    {usuarioSeleccionado.ApellidoUsuario}
                  </h3>

                  <p className="text-sm text-gray-500">
                    @{usuarioSeleccionado.UserName}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setUsuarioSeleccionado(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <Icon>
                  <path
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </Icon>
              </button>

            </div>

            {/* Modal body */}

            <div className="space-y-6 p-6">

              {/* Información general */}

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Información general
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Correo
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {usuarioSeleccionado.Correo}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Fecha de registro
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {usuarioSeleccionado.FechaRegistro}
                    </p>
                  </div>

                </div>
              </section>

              {/* Modelos */}

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Estadísticas de modelos
                </h4>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Peticiones a Modelos
                    </p>
                    <p className="mt-1 font-semibold">
                      {usuarioSeleccionado.EstadisticasModelos?.Cantidad || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Input
                    </p>
                    <p className="mt-1 font-semibold">
                      {(
                        usuarioSeleccionado.EstadisticasModelos
                          ?.Tokens?.InputTokens || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Output
                    </p>
                    <p className="mt-1 font-semibold">
                      {(
                        usuarioSeleccionado.EstadisticasModelos
                          ?.Tokens?.OutputTokens || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-xs text-blue-500">
                      Total tokens
                    </p>
                    <p className="mt-1 font-semibold text-blue-700">
                      {(
                        usuarioSeleccionado.EstadisticasModelos
                          ?.Tokens?.TotalTokens || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>
              </section>

              {/* Imágenes */}

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Imágenes
                </h4>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Pendientes
                    </p>
                    <p className="mt-1 font-semibold">
                      {usuarioSeleccionado.ImagenesPendientes?.Cantidad || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      No procesadas
                    </p>
                    <p className="mt-1 font-semibold">
                      {usuarioSeleccionado.ImagenesPendientes?.TareasNoProcesadas || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Reportadas
                    </p>
                    <p className="mt-1 font-semibold">
                      {usuarioSeleccionado.ImagenesReportadas?.Cantidad || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Pendientes reporte
                    </p>
                    <p className="mt-1 font-semibold text-orange-600">
                      {usuarioSeleccionado.ImagenesReportadas?.Pendiente || 0}
                    </p>
                  </div>

                </div>
              </section>

              {/* Movimientos */}

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Movimientos de gastos
                </h4>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Total
                    </p>
                    <p className="mt-1 font-semibold">
                      {usuarioSeleccionado.MovimientosGastos?.Cantidad || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-xs text-green-600">
                      Activos
                    </p>
                    <p className="mt-1 font-semibold text-green-700">
                      {usuarioSeleccionado.MovimientosGastos?.Activos || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-xs text-red-500">
                      No activos
                    </p>
                    <p className="mt-1 font-semibold text-red-600">
                      {usuarioSeleccionado.MovimientosGastos?.NoActivos || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Imágenes
                    </p>
                    <p className="mt-1 font-semibold">
                      {formatBytes(
                        usuarioSeleccionado.MovimientosGastos
                          ?.TamañoImagen?.Total || 0,
                      )}
                    </p>
                  </div>

                </div>
              </section>

              {/* Sesiones */}

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Sesiones
                </h4>

                <div className="rounded-xl border border-gray-200">

                  <div className="grid grid-cols-2 divide-x border-b border-gray-100">
                    <div className="p-4">
                      <p className="text-xs text-gray-400">
                        Total sesiones
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {usuarioSeleccionado.Sesiones?.Cantidad || 0}
                      </p>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-400">
                        Sesiones activas
                      </p>
                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {usuarioSeleccionado.Sesiones?.SesionesActivas?.length || 0}
                      </p>
                    </div>
                  </div>

                  {usuarioSeleccionado.Sesiones?.SesionesActivas?.map(
                    (sesion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {sesion.Dispositivo}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            IP: {sesion.Ip}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                          Activa
                        </span>
                      </div>
                    ),
                  )}

                </div>
              </section>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ControlUsuarios