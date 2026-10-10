import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Icon,
  StatCard,
  ProgressBar,
  TooltipGrafico,
  formatNumber,
  formatBytes,
} from './ui'

const REGISTROS_POR_PAGINA = 10

const LINEAS_GRAFICO = [
  { dataKey: 'InputTokens', name: 'Input', stroke: '#2563eb', width: 2.5 },
  { dataKey: 'OutputTokens', name: 'Output', stroke: '#16a34a', width: 2.5 },
  { dataKey: 'ThoughtsTokens', name: 'Thoughts', stroke: '#9333ea', width: 2.5 },
  { dataKey: 'TotalTokens', name: 'Total', stroke: '#111827', width: 3 },
]

export default function SeccionConsumo({ datos }) {
  const [mesSeleccionado, setMesSeleccionado] = useState(null)
  const [paginaDetalles, setPaginaDetalles] = useState(1)

  // -------------------- DATOS DERIVADOS --------------------

  const totalGeneral = datos?.data_tokens?.total_general ?? {}

  const totalTokens = totalGeneral.TotalTokens || 0
  const inputTokens = totalGeneral.InputTokens || 0
  const outputTokens = totalGeneral.OutputTokens || 0
  const thoughtsTokens = totalGeneral.ThoughtsTokens || 0

  const modelos = datos?.data_tokens?.por_modelo || []
  const operaciones = datos?.data_tokens?.por_tipo_operacion || []
  const usuarios = datos?.data_usuarios?.datos || []
  const detallesRegistros = datos?.detalles_registros || []

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

  // Solo meses con actividad, ordenados cronológicamente
  const consumoPorFecha = (
    datos?.data_tokens?.por_fecha || []
  )
    .flatMap(
      (anno) =>
        anno.datos
          ?.filter(
            (mes) =>
              Array.isArray(mes.datos) &&
              mes.datos.length > 0,
          )
          .map((mes) => ({
            Año: anno.Año,
            NumeroMes: mes.NumeroMes,
            Mes: mes.Mes,
            datos: mes.datos,
            totalMes: mes.datos.reduce(
              (total, item) =>
                total + (item.TotalTokens || 0),
              0,
            ),
          })) || [],
    )
    .sort(
      (a, b) =>
        a.Año - b.Año || a.NumeroMes - b.NumeroMes,
    )

  // Comparación mensual: un punto por mes
  const comparacionMensual = consumoPorFecha.map(
    (mes) => {
      const base = {
        nombre: `${mes.Mes} ${mes.Año}`,
        TotalTokens: 0,
        InputTokens: 0,
        OutputTokens: 0,
        ThoughtsTokens: 0,
      }

      mes.datos.forEach((dia) => {
        base.TotalTokens += dia.TotalTokens || 0
        base.InputTokens += dia.InputTokens || 0
        base.OutputTokens += dia.OutputTokens || 0
        base.ThoughtsTokens += dia.ThoughtsTokens || 0
      })

      return base
    },
  )

  // Mes vigente en el selector
  const claveMes = (mes) =>
    `${mes.Año}-${mes.NumeroMes}`

  const mesActivo =
    consumoPorFecha.find(
      (mes) => claveMes(mes) === mesSeleccionado,
    ) ?? consumoPorFecha[consumoPorFecha.length - 1]

  // -------------------- PAGINACIÓN DETALLES --------------------

  const totalPaginasDetalles = Math.max(
    1,
    Math.ceil(
      detallesRegistros.length / REGISTROS_POR_PAGINA,
    ),
  )

  const paginaActual = Math.min(
    paginaDetalles,
    totalPaginasDetalles,
  )

  const inicioDetalles =
    (paginaActual - 1) * REGISTROS_POR_PAGINA

  const registrosPagina = detallesRegistros.slice(
    inicioDetalles,
    inicioDetalles + REGISTROS_POR_PAGINA,
  )

  const cambiarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginasDetalles) {
      return
    }
    setPaginaDetalles(pagina)
  }

  // -------------------- RENDER --------------------

  return (
    <>
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
            Distribución del consumo de tokens entre los
            modelos utilizados.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {modelos.map((modelo) => {
            const porcentaje =
              totalTokens > 0
                ? (modelo.Resumen.TotalTokens /
                    totalTokens) *
                  100
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
                      {porcentaje.toFixed(2)}% del consumo
                      total
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
                      {formatNumber(
                        modelo.Resumen.ThoughtsTokens,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap gap-2">
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
            Distribución de tokens según el tipo de proceso
            realizado.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
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

      {/* CONSUMO DIARIO (selector de mes + un solo gráfico) */}
      {consumoPorFecha.length > 0 && (
        <section className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Consumo diario
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Selecciona un mes para ver la evolución diaria
              del consumo.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* SELECTOR DE MES */}
            <div className="mb-6 flex flex-wrap gap-2">
              {consumoPorFecha.map((mes) => {
                const activo =
                  mesActivo &&
                  claveMes(mes) === claveMes(mesActivo)

                return (
                  <button
                    key={claveMes(mes)}
                    type="button"
                    onClick={() =>
                      setMesSeleccionado(claveMes(mes))
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activo
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mes.Mes} {mes.Año}

                    <span
                      className={`ml-2 text-xs ${
                        activo
                          ? 'text-blue-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatNumber(mes.totalMes)}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* GRÁFICO DEL MES */}
            {mesActivo && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {mesActivo.Mes} {mesActivo.Año}
                  </h4>

                  <div className="rounded-xl bg-blue-50 px-4 py-2">
                    <p className="text-xs text-blue-500">
                      Total del mes
                    </p>
                    <p className="font-bold text-blue-700">
                      {formatNumber(mesActivo.totalMes)}
                    </p>
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={mesActivo.datos}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-100"
                      />

                      <XAxis
                        dataKey="Dia"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          Number(value).toLocaleString()
                        }
                      />

                      <Tooltip content={<TooltipGrafico />} />

                      <Legend />

                      {LINEAS_GRAFICO.map((linea) => (
                        <Line
                          key={linea.dataKey}
                          type="monotone"
                          dataKey={linea.dataKey}
                          name={linea.name}
                          stroke={linea.stroke}
                          strokeWidth={linea.width}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          {/* COMPARACIÓN DE MESES */}
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">
                Comparación entre meses
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                Totales de tokens por mes con actividad.
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparacionMensual}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-100"
                  />

                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      Number(value).toLocaleString()
                    }
                  />

                  <Tooltip content={<TooltipGrafico />} />

                  <Legend />

                  <Bar
                    dataKey="InputTokens"
                    name="Input"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="OutputTokens"
                    name="Output"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="ThoughtsTokens"
                    name="Thoughts"
                    fill="#9333ea"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* USUARIOS (tabla) */}
      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Consumo por usuario
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Consumo y actividad de modelos por usuario.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Usuario
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registros
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total tokens
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Imágenes
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Modelos
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    % del consumo
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.NombreUsuario}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                          {usuario.NombreUsuario
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="text-sm font-medium text-gray-900">
                          {usuario.NombreUsuario}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(usuario.cantidad_registros)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(
                        usuario.tokens?.TotalTokens,
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatBytes(usuario.total_tamanno_img)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {usuario.por_modelo?.length || 0}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {(
                          usuario.tokens
                            ?.PorcentajeTotalTokens || 0
                        ).toFixed(2)}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DETALLES DE REGISTROS */}
      {detallesRegistros.length > 0 && (
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de registros
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Registros individuales generados por las
                operaciones de modelos.
              </p>
            </div>

            <div className="text-sm text-gray-400">
              {formatNumber(detallesRegistros.length)}{' '}
              registros
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {registrosPagina.map((registro) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginasDetalles > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                <span className="text-xs text-gray-500">
                  Página {paginaActual} de{' '}
                  {totalPaginasDetalles}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() =>
                      cambiarPagina(paginaActual - 1)
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: totalPaginasDetalles },
                    (_, index) => index + 1,
                  ).map((pagina) => (
                    <button
                      key={pagina}
                      type="button"
                      onClick={() =>
                        cambiarPagina(pagina)
                      }
                      className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        pagina === paginaActual
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      paginaActual === totalPaginasDetalles
                    }
                    onClick={() =>
                      cambiarPagina(paginaActual + 1)
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
