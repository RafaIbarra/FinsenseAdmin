import { useState } from 'react'

import request from '../../../../Api/request'
import ModalBase from './ModalBase'

function ModalCanal({ canal, onClose, onGuardado }) {
  const esEdicion = Boolean(canal)
  const [nombre, setNombre] = useState(canal?.NombreCanal ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError('El nombre del canal es obligatorio.')
      return
    }

    try {
      setGuardando(true)
      setError(null)

      const formData = new FormData()
      formData.append('id', esEdicion ? canal.Id : 0)
      formData.append('nombre_canal', nombre.trim())

      await request({
        endpoint: 'data-catalogos-base/registro-canal',
        method: 'POST',
        body: formData,
      })

      onGuardado?.()
      onClose()
    } catch (err) {
      console.error('Error al guardar canal:', err)
      setError('No se pudo guardar el canal. Intenta nuevamente.')
      setGuardando(false)
    }
  }

  return (
    <ModalBase titulo={esEdicion ? 'Editar canal' : 'Nuevo canal'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-6 py-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nombre_canal" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="nombre_canal"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: QR, Transferencias, Pos"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button type="button" onClick={onClose} disabled={guardando} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
            {guardando && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-white" />}
            {esEdicion ? 'Guardar cambios' : 'Registrar'}
          </button>
        </div>
      </form>
    </ModalBase>
  )
}

export default function SeccionCanales({ canales, onGuardado }) {
  const [canalModal, setCanalModal] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const cerrarModal = () => {
    setModalAbierto(false)
    setCanalModal(null)
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => { setCanalModal(null); setModalAbierto(true) }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Agregar canal
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Id</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha de registro</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {canales.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500">Aún no hay canales registrados.</td></tr>
              ) : canales.map((canal) => (
                <tr key={canal.Id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600">{canal.Id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{canal.NombreCanal}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600">{canal.FechaRegistro}</td>
                  <td className="px-5 py-3 text-right">
                    <button type="button" onClick={() => { setCanalModal(canal); setModalAbierto(true) }} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">{canales.length} canales</div>
      </div>

      {modalAbierto && <ModalCanal canal={canalModal} onClose={cerrarModal} onGuardado={onGuardado} />}
    </>
  )
}
