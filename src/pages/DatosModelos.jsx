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

function formatNumber(value = 0) {
  return Number(value).toLocaleString()
}

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`
}

function StatCard({ label, value, description, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
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

function ProgressBar({ percentage }) {
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

export default function DatosModelos() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null)
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null)

  const carga_datos = async () => {
    try {
      const endpoint = 'models/datos-modelos'

      const response = await request({
        endpoint,
        method: 'GET',
        body: {},
      })

      console.log(response.data)
      setDatos(response.data)
    } catch (error) {
      console.error('Error al cargar datos de modelos:', error)
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
            Cargando datos de modelos...
          </div>
        </div>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          No se pudieron cargar los datos de modelos.
        </div>
      </div>
    )
  }

  const totalTokens =
    datos.data_tokens?.total_general?.TotalTokens || 0

  const inputTokens =
    datos.data_tokens?.total_general?.InputTokens || 0

  const outputTokens =
    datos.data_tokens?.total_general?.OutputTokens || 0

  const thoughtsTokens =
    datos.data_tokens?.total_general?.ThoughtsTokens || 0

  const modelos = datos.data_tokens?.por_modelo || []

  const operaciones =
    datos.data_tokens?.por_tipo_operacion || []

  const usuarios =
    datos.data_usuarios?.datos || []

  const totalRegistros = usuarios.reduce(
    (total, usuario) =>
      total + (usuario.cantidad_registros || 0),
    0,
  )

  const totalImagenes = usuarios.reduce(
    (total, usuario) =>
      total + (usuario.total_tamanno_img || 0),
    0,
  )

  /*
   * Esta propiedad todavía no está en el JSON actual.
   * Cuando el backend la agregue, el componente ya está preparado.
   */
  const detallesRegistros = datos.detalles_registros || []

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">

      {/* ENCABEZADO */}

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Monitoreo
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Datos de modelos
            </h2>

            <p className="mt-2 max-w-2xl text-gray-500">
              Monitoreo del consumo de modelos de inteligencia
              artificial y operaciones realizadas.
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {modelos.length} modelos registrados
          </div>
        </div>
      </div>

      {/* RESUMEN */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total tokens"
          value={formatNumber(totalTokens)}
          description="Consumo total"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18M3 12h18"
              />
              <circle cx="12" cy="12" r="8" />
            </Icon>
          }
        />

        <StatCard
          label="Input tokens"
          value={formatNumber(inputTokens)}
          description="Tokens de entrada"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17 17 7M7 7h10v10"
              />
            </Icon>
          }
        />

        <StatCard
          label="Output tokens"
          value={formatNumber(outputTokens)}
          description="Tokens generados"
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m17 7-10 10M17 17H7V7"
              />
            </Icon>
          }
        />

        <StatCard
          label="Registros"
          value={formatNumber(totalRegistros)}
          description={`${formatBytes(totalImagenes)} en imágenes`}
          icon={
            <Icon>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 8h8M8 12h8M8 16h5"
              />
            </Icon>
          }
        />

      </div>

      {/* MODELOS */}

      <section className="mb-8">

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Consumo por modelo
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Distribución del consumo de tokens entre los modelos utilizados.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {modelos.map((modelo) => {
            const porcentaje =
              totalTokens > 0
                ? (modelo.Resumen.TotalTokens / totalTokens) * 100
                : 0

            return (
              <div
                key={modelo.NombreModelo}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {modelo.NombreModelo}
                    </h4>

                    <p className="mt-1 text-xs text-gray-400">
                      {porcentaje.toFixed(2)}% del consumo total
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {formatNumber(modelo.Resumen.TotalTokens)}
                  </span>

                </div>

                <div className="mt-4">
                  <ProgressBar percentage={porcentaje} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Input
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatNumber(modelo.Resumen.InputTokens)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Output
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatNumber(modelo.Resumen.OutputTokens)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Thoughts
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatNumber(modelo.Resumen.ThoughtsTokens)}
                    </p>
                  </div>

                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Operaciones
                    </span>

                    <span className="text-xs font-medium text-gray-600">
                      {modelo.distribucion?.length || 0}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {modelo.distribucion?.map((item) => (
                      <span
                        key={item.TipoOperacion}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                      >
                        {item.TipoOperacion}
                      </span>
                    ))}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setModeloSeleccionado(modelo)}
                  className="mt-5 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  Ver detalles
                </button>

              </div>
            )
          })}

        </div>
      </section>

      {/* OPERACIONES */}

      <section className="mb-8">

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Consumo por tipo de operación
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Distribución de tokens según el tipo de proceso realizado.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-150 text-left">

              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Operación
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Input
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Output
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Thoughts
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {operaciones.map((operacion) => (
                  <tr
                    key={operacion.TipoOperacion}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {operacion.TipoOperacion}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(operacion.InputTokens)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(operacion.OutputTokens)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(operacion.ThoughtsTokens)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatNumber(operacion.TotalTokens)}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

      {/* USUARIOS */}

      <section className="mb-8">

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Consumo por usuario
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Consumo y actividad de modelos por usuario.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {usuarios.map((usuario) => {

            const porcentaje =
              usuario.tokens?.PorcentajeTotalTokens || 0

            return (
              <div
                key={usuario.NombreUsuario}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                      {usuario.NombreUsuario
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {usuario.NombreUsuario}
                      </h4>

                      <p className="text-xs text-gray-400">
                        {usuario.cantidad_registros} registros
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-semibold text-blue-600">
                    {porcentaje.toFixed(2)}%
                  </span>

                </div>

                <div className="mt-4">
                  <ProgressBar percentage={porcentaje} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatNumber(usuario.tokens?.TotalTokens)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Imágenes
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatBytes(usuario.total_tamanno_img)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Modelos
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {usuario.por_modelo?.length || 0}
                    </p>
                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </section>

      {/* DETALLES DE REGISTROS */}

      {detallesRegistros.length > 0 && (
        <section>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles de registros
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Registros individuales generados por las operaciones de modelos.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-200 text-left">

                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Usuario
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Fecha
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Modelos
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Imagen
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Gasto
                    </th>

                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {detallesRegistros.map((registro) => (
                    <tr
                      key={registro.Id}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        #{registro.Id}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {registro.usuario}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(
                          registro.FechaRegistro,
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                          {registro.datos_modelo?.length || 0}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatBytes(registro.tamanno_img)}
                      </td>

                      <td className="px-5 py-4">

                        {registro.gasto_registrado ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                            Registrado
                          </span>
                        ) : (
                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                            Pendiente
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setRegistroSeleccionado(registro)
                          }
                          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          Ver →
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>
      )}

      {/* MODAL MODELO */}

      {modeloSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          onClick={() => setModeloSeleccionado(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  {modeloSeleccionado.NombreModelo}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Estadísticas del modelo
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModeloSeleccionado(null)}
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

            <div className="space-y-5 p-6">

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Input
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatNumber(
                      modeloSeleccionado.Resumen.InputTokens,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Output
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatNumber(
                      modeloSeleccionado.Resumen.OutputTokens,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Thoughts
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatNumber(
                      modeloSeleccionado.Resumen.ThoughtsTokens,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-xs text-blue-500">
                    Total
                  </p>
                  <p className="mt-1 font-semibold text-blue-700">
                    {formatNumber(
                      modeloSeleccionado.Resumen.TotalTokens,
                    )}
                  </p>
                </div>

              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Distribución por operación
                </h4>

                <div className="space-y-3">

                  {modeloSeleccionado.distribucion?.map(
                    (item) => (
                      <div
                        key={item.TipoOperacion}
                        className="rounded-lg bg-gray-50 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <span className="text-sm font-medium text-gray-700">
                            {item.TipoOperacion}
                          </span>

                          <span className="text-sm font-semibold text-gray-900">
                            {formatNumber(item.TotalTokens)}
                          </span>

                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-500">

                          <span>
                            Input:{' '}
                            {formatNumber(item.InputTokens)}
                          </span>

                          <span>
                            Output:{' '}
                            {formatNumber(item.OutputTokens)}
                          </span>

                          <span>
                            Thoughts:{' '}
                            {formatNumber(item.ThoughtsTokens)}
                          </span>

                        </div>

                      </div>
                    ),
                  )}

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL REGISTRO */}

      {registroSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          onClick={() => setRegistroSeleccionado(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Registro #{registroSeleccionado.Id}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Usuario: {registroSeleccionado.usuario}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegistroSeleccionado(null)}
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

            <div className="space-y-6 p-6">

              {/* Datos del registro */}

              <div className="grid gap-3 sm:grid-cols-3">

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Fecha
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {new Date(
                      registroSeleccionado.FechaRegistro,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Imagen
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatBytes(
                      registroSeleccionado.tamanno_img,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Estado
                  </p>

                  {registroSeleccionado.gasto_registrado ? (
                    <p className="mt-1 text-sm font-medium text-green-600">
                      Gasto registrado
                    </p>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Gasto pendiente
                    </p>
                  )}
                </div>

              </div>

              {/* Modelos utilizados */}

              <div>

                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Modelos utilizados
                </h4>

                <div className="space-y-3">

                  {registroSeleccionado.datos_modelo?.map(
                    (modelo, index) => (
                      <div
                        key={`${modelo.NombreModelo}-${index}`}
                        className="rounded-xl border border-gray-200 p-4"
                      >

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div>
                            <p className="font-medium text-gray-900">
                              {modelo.NombreModelo}
                            </p>

                            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                              {modelo.TipoOperacion}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs text-gray-400">
                              Total tokens
                            </p>

                            <p className="font-semibold text-gray-900">
                              {formatNumber(
                                modelo.TotalTokens,
                              )}
                            </p>
                          </div>

                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Input
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatNumber(
                                modelo.InputTokens,
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Output
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatNumber(
                                modelo.OutputTokens,
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Thoughts
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatNumber(
                                modelo.ThoughtsTokens,
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-xs text-blue-500">
                              Total
                            </p>
                            <p className="mt-1 text-sm font-semibold text-blue-700">
                              {formatNumber(
                                modelo.TotalTokens,
                              )}
                            </p>
                          </div>

                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                          {new Date(
                            modelo.FechaRegistro,
                          ).toLocaleString()}
                        </p>

                      </div>
                    ),
                  )}

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}