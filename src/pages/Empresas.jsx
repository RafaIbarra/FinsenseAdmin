import { useCallback, useEffect, useRef, useState } from 'react'


import request from '../../Api/request'
const FORM_INICIAL = { id: 0, nombre: '', rubro: '', ruc: '', div: '', logo: null }

// Separa un RUC "710919-9" en { ruc: '710919', div: '9' }
const partirRuc = (valor) => {
  const [numero = '', digito = ''] = String(valor ?? '').split('-')
  return { ruc: numero.trim(), div: digito.trim().slice(0, 1) }
}

// Normaliza la respuesta del listado (array directo o dentro de { data } / { empresas })
const normalizaLista = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.empresas)) return data.empresas
  return []
}

// Normaliza la respuesta del detalle (objeto directo o dentro de { data })
const normalizaDetalle = (data) => data?.data ?? data

// -------------------- LOGO --------------------

function LogoEmpresa({ src, nombre, size = 'h-10 w-10' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={nombre}
        className={`${size} rounded-lg border border-gray-200 bg-white object-contain`}
      />
    )
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600`}
    >
      {nombre?.trim()?.charAt(0)?.toUpperCase() || '?'}
    </div>
  )
}

// -------------------- MODAL --------------------

function ModalEmpresa({ empresaId, cantidadInicial, onClose }) {
  const esEdicion = Boolean(empresaId)
  const inputLogoRef = useRef(null)

  // Dato informativo: no forma parte del POST
  const [cantidadRegistros, setCantidadRegistros] = useState(
    cantidadInicial ?? null,
  )

  const [form, setForm] = useState(FORM_INICIAL)
  const [logoActual, setLogoActual] = useState(null) // url del logo ya guardado
  const [preview, setPreview] = useState(null) // preview del archivo nuevo
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  // Cargar detalle al editar
  useEffect(() => {
    if (!esEdicion) return

    let activo = true

    const cargaDetalle = async () => {
      try {
        setCargando(true)
        setError(null)

        const response = await request({
          endpoint: `empresas/detalle/${empresaId}`,
          method: 'GET',
          body: {},
        })

        if (!activo) return

        const detalle = normalizaDetalle(response.data)

        // Acepta las keys en PascalCase (como el listado) o en minúscula
        const { ruc, div } = partirRuc(detalle?.Ruc ?? detalle?.ruc)

        setForm({
          id: detalle?.Id ?? detalle?.id ?? empresaId,
          nombre: detalle?.NombreEmpresa ?? detalle?.nombre ?? '',
          rubro: detalle?.Rubro ?? detalle?.rubro ?? '',
          ruc,
          div,
          logo: null,
        })
        setLogoActual(detalle?.UrlLogo ?? detalle?.logo ??  detalle.url_logo ?? null)
        setCantidadRegistros(detalle?.CantidadRegistros ?? cantidadInicial ?? null)
      } catch (err) {
        console.error('Error al cargar detalle de empresa:', err)
        if (activo) setError('No se pudo cargar el detalle de la empresa.')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargaDetalle()

    return () => {
      activo = false
    }
  }, [empresaId, esEdicion])

  // Liberar la URL del preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Solo dígitos; el RUC sin límite de cantidad, el Div un solo dígito
  const handleRuc = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setForm((prev) => ({ ...prev, ruc: value }))
  }

  const handleDiv = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1)
    setForm((prev) => ({ ...prev, div: value }))
  }

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('El logo debe ser una imagen.')
      e.target.value = ''
      return
    }

    setError(null)
    setForm((prev) => ({ ...prev, logo: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim() || !form.rubro.trim()) {
      setError('Nombre y rubro son obligatorios.')
      return
    }

    if (!form.ruc || form.div.length !== 1) {
      setError('Ingresa el RUC y su dígito verificador (Div).')
      return
    }

    try {
      setGuardando(true)
      setError(null)

      const formData = new FormData()
      formData.append('id', esEdicion ? form.id : 0)
      formData.append('nombre', form.nombre.trim())
      formData.append('rubro', form.rubro.trim())
      formData.append('ruc', `${form.ruc}-${form.div}`)
      if (form.logo) formData.append('logo', form.logo)

      await request({
        endpoint: 'empresas/registro',
        method: 'POST',
        body: formData,
      })

      // Recargar la página al procesar
      window.location.reload()
    } catch (err) {
      console.error('Error al guardar empresa:', err)
      setError('No se pudo guardar la empresa. Intenta nuevamente.')
      setGuardando(false)
    }
  }

  const logoMostrado = preview ?? logoActual

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {esEdicion ? 'Editar empresa' : 'Nueva empresa'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {cargando ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando empresa...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="nombre"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de la empresa"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="rubro"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Rubro
                </label>
                <input
                  id="rubro"
                  name="rubro"
                  type="text"
                  value={form.rubro}
                  onChange={handleChange}
                  placeholder="Ej: Tecnología, Comercio, Salud"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="ruc"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    RUC
                  </label>
                  <input
                    id="ruc"
                    name="ruc"
                    type="text"
                    inputMode="numeric"
                    value={form.ruc}
                    onChange={handleRuc}
                    placeholder="710919"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <span className="pb-2 text-lg font-semibold text-gray-400">
                  -
                </span>

                <div className="w-20">
                  <label
                    htmlFor="div"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Div
                  </label>
                  <input
                    id="div"
                    name="div"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={form.div}
                    onChange={handleDiv}
                    placeholder="9"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Logo
                </span>

                <div className="flex items-center gap-4">
                  <LogoEmpresa
                    src={logoMostrado}
                    nombre={form.nombre}
                    size="h-16 w-16"
                  />

                  <div>
                    <input
                      ref={inputLogoRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogo}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => inputLogoRef.current?.click()}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      {logoMostrado ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </button>

                    <p className="mt-1.5 text-xs text-gray-500">
                      {form.logo
                        ? form.logo.name
                        : esEdicion && logoActual
                          ? 'Si no eliges una nueva, se conserva la actual.'
                          : 'PNG, JPG o SVG.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informativo (solo lectura, no se envía) */}
              {esEdicion && (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-600">
                    Cantidad de registros
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                    {cantidadRegistros ?? 0}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={guardando}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {guardando && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-white" />
                )}
                {esEdicion ? 'Guardar cambios' : 'Registrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// -------------------- PÁGINA --------------------

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  // null = cerrado | 0 = nueva | id = editar
  const [modal, setModal] = useState(null)

  const carga_empresas = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await request({
        endpoint: 'empresas/listar',
        method: 'GET',
        body: {},
      })
      setEmpresas(normalizaLista(response.data))
    } catch (err) {
      console.error('Error al cargar empresas:', err)
      setError('No se pudieron cargar las empresas.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    carga_empresas()
  }, [carga_empresas])

  const filtradas = empresas.filter((e) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      e.NombreEmpresa?.toLowerCase().includes(q) ||
      e.Rubro?.toLowerCase().includes(q) ||
      e.Ruc?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      {/* ENCABEZADO */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Gestión
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Empresas
          </h2>

          <p className="mt-2 max-w-2xl text-gray-500">
            Administra las empresas registradas: crea nuevas o edita las
            existentes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal(0)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Agregar empresa
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, RUC o rubro..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* CONTENIDO */}
      {cargando ? (
        <div className="flex min-h-60 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Cargando empresas...
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={carga_empresas}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Logo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Nombre
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    RUC
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Rubro
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fecha de registro
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registros
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      {empresas.length === 0
                        ? 'Aún no hay empresas registradas.'
                        : 'No se encontraron empresas con esa búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  filtradas.map((empresa) => (
                    <tr
                      key={empresa.Id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-3">
                        <LogoEmpresa
                          src={empresa.UrlLogo}
                          nombre={empresa.NombreEmpresa}
                        />
                      </td>

                      <td className="px-5 py-3 font-medium text-gray-900">
                        {empresa.NombreEmpresa}
                      </td>

                      <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                        {empresa.Ruc}
                      </td>

                      <td className="px-5 py-3">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {empresa.Rubro}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                        {empresa.FechaRegistro}
                      </td>

                      <td className="px-5 py-3 text-gray-600">
                        {empresa.CantidadRegistros ?? 0}
                      </td>

                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setModal(empresa.Id)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">
            {filtradas.length} de {empresas.length} empresas
          </div>
        </div>
      )}

      {/* MODAL */}
      {modal !== null && (
        <ModalEmpresa
          empresaId={modal}
          cantidadInicial={
            empresas.find((e) => e.Id === modal)?.CantidadRegistros
          }
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}