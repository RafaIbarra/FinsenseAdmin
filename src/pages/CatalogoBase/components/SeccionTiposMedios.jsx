import { useState } from 'react'

import request from '../../../../Api/request'
import ModalBase from './ModalBase'

const FORM_INICIAL = {
  nombre_tipo: '',
  es_debito: true,
  solicitar_marca: false,
  solicitar_entidad: false,
}

const BadgeBooleano = ({ valor }) =>
  valor ? (
    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">Sí</span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">No</span>
  )

const esVerdadero = (valor) => valor === true || valor === 1 || valor === '1' || valor === 'true'

function ModalTipoMedio({ tipo, onClose, onGuardado }) {
  const esEdicion = Boolean(tipo)
  const [form, setForm] = useState(esEdicion ? {
    nombre_tipo: tipo.NombreTipo ?? '',
    es_debito: esVerdadero(tipo.EsDebito),
    solicitar_marca: esVerdadero(tipo.SolicitarMarca),
    solicitar_entidad: esVerdadero(tipo.SolicitarEntidad),
  } : FORM_INICIAL)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.nombre_tipo.trim()) {
      setError('El nombre del tipo es obligatorio.')
      return
    }

    try {
      setGuardando(true)
      setError(null)

      const formData = new FormData()
      formData.append('id', esEdicion ? tipo.Id : 0)
      formData.append('nombre_tipo', form.nombre_tipo.trim())
      formData.append('es_debito', String(form.es_debito))
      formData.append('solicitar_marca', String(form.solicitar_marca))
      formData.append('solicitar_entidad', String(form.solicitar_entidad))

      await request({
        endpoint: 'data-catalogos-base/registro-tipo-medio',
        method: 'POST',
        body: formData,
      })

      onGuardado?.()
      onClose()
    } catch (err) {
      console.error('Error al guardar tipo de medio:', err)
      setError('No se pudo guardar el tipo de medio. Intenta nuevamente.')
      setGuardando(false)
    }
  }

  return (
    <ModalBase titulo={esEdicion ? 'Editar tipo de medio' : 'Nuevo tipo de medio'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-6 py-5">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
          <div>
            <label htmlFor="nombre_tipo" className="mb-1.5 block text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="nombre_tipo"
              type="text"
              value={form.nombre_tipo}
              onChange={(e) => setForm((prev) => ({ ...prev, nombre_tipo: e.target.value }))}
              placeholder="Ej: Tarjeta Debito, Efectivo"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {[
              { clave: 'es_debito', label: 'Es débito', descripcion: 'El medio descuenta dinero directamente.' },
              { clave: 'solicitar_marca', label: 'Solicitar marca', descripcion: 'Al registrar un medio se pide la marca (Visa, Master...).' },
              { clave: 'solicitar_entidad', label: 'Solicitar entidad', descripcion: 'Al registrar un medio se pide la entidad bancaria.' },
            ].map((campo) => (
              <label key={campo.clave} className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-gray-700">{campo.label}</span>
                  <span className="block text-xs text-gray-500">{campo.descripcion}</span>
                </span>
                <input type="checkbox" checked={form[campo.clave]} onChange={(e) => setForm((prev) => ({ ...prev, [campo.clave]: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button type="button" onClick={onClose} disabled={guardando} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
            {guardando && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-white" />}
            {esEdicion ? 'Guardar cambios' : 'Registrar'}
          </button>
        </div>
      </form>
    </ModalBase>
  )
}

export default function SeccionTiposMedios({ tiposMedios, onGuardado }) {
  const [tipoModal, setTipoModal] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const cerrarModal = () => {
    setModalAbierto(false)
    setTipoModal(null)
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => { setTipoModal(null); setModalAbierto(true) }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Agregar tipo de medio
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Id</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Es débito</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Solicita marca</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Solicita entidad</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha de registro</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {tiposMedios.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">Aún no hay tipos de medios registrados.</td></tr>
              ) : tiposMedios.map((tipo) => (
                <tr key={tipo.Id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600">{tipo.Id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{tipo.NombreTipo}</td>
                  <td className="px-5 py-3"><BadgeBooleano valor={tipo.EsDebito} /></td>
                  <td className="px-5 py-3"><BadgeBooleano valor={tipo.SolicitarMarca} /></td>
                  <td className="px-5 py-3"><BadgeBooleano valor={tipo.SolicitarEntidad} /></td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600">{tipo.FechaRegistro}</td>
                  <td className="px-5 py-3 text-right"><button type="button" onClick={() => { setTipoModal(tipo); setModalAbierto(true) }} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">{tiposMedios.length} tipos de medios</div>
      </div>
      {modalAbierto && <ModalTipoMedio tipo={tipoModal} onClose={cerrarModal} onGuardado={onGuardado} />}
    </>
  )
}
