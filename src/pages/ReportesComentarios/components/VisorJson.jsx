import { useState } from 'react'

// Convierte "ruc_empresa" / "iva_diez" / "Model" en "Ruc empresa", etc.
const etiquetaDeClave = (clave) => {
  const texto = String(clave).replace(/_/g, ' ').trim()
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const esObjeto = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

const esPrimitivo = (v) => v === null || typeof v !== 'object'

// -------------------- VALORES SIMPLES --------------------

function ValorPrimitivo({ valor }) {
  if (valor === null || valor === undefined) {
    return <span className="text-gray-400">null</span>
  }

  if (typeof valor === 'boolean') {
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          valor
            ? 'bg-green-50 text-green-600'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {valor ? 'Sí' : 'No'}
      </span>
    )
  }

  if (typeof valor === 'number') {
    return (
      <span className="font-mono text-blue-700">
        {valor.toLocaleString('es-PY')}
      </span>
    )
  }

  if (valor === '') {
    return <span className="text-gray-400">(vacío)</span>
  }

  return <span className="break-words text-gray-900">{valor}</span>
}

// -------------------- NODO RECURSIVO --------------------

function Nodo({ valor, nivel }) {
  // Lista de valores simples -> chips
  if (Array.isArray(valor) && valor.every(esPrimitivo)) {
    if (valor.length === 0) {
      return <span className="text-gray-400">(sin elementos)</span>
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {valor.map((item, i) => (
          <span
            key={i}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {String(item)}
          </span>
        ))}
      </div>
    )
  }

  // Lista de objetos / mixta
  if (Array.isArray(valor)) {
    return (
      <div className="space-y-2">
        {valor.map((item, i) => (
          <Grupo
            key={i}
            titulo={`#${i + 1}`}
            valor={item}
            nivel={nivel + 1}
          />
        ))}
      </div>
    )
  }

  // Objeto
  if (esObjeto(valor)) {
    const entradas = Object.entries(valor)

    if (entradas.length === 0) {
      return <span className="text-gray-400">(sin datos)</span>
    }

    return (
      <dl className="divide-y divide-gray-100">
        {entradas.map(([clave, v]) => {
          const compuesto = !esPrimitivo(v)
          const esLista = Array.isArray(v)

          // Los objetos y listas de objetos van en su propio grupo
          if (compuesto && !(esLista && v.every(esPrimitivo))) {
            return (
              <div key={clave} className="py-2">
                <Grupo
                  titulo={etiquetaDeClave(clave)}
                  valor={v}
                  nivel={nivel + 1}
                />
              </div>
            )
          }

          return (
            <div
              key={clave}
              className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[200px_1fr] sm:gap-4"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {etiquetaDeClave(clave)}
              </dt>
              <dd className="text-sm">
                <Nodo valor={v} nivel={nivel + 1} />
              </dd>
            </div>
          )
        })}
      </dl>
    )
  }

  return <ValorPrimitivo valor={valor} />
}

// -------------------- GRUPO COLAPSABLE --------------------

function Grupo({ titulo, valor, nivel }) {
  const [abierto, setAbierto] = useState(nivel <= 2)

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        className="flex w-full items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-2.5 text-left transition hover:bg-gray-100"
      >
        <span className="text-sm font-semibold text-gray-800">
          {titulo}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition ${
            abierto ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {abierto && (
        <div className="px-4 py-2">
          <Nodo valor={valor} nivel={nivel} />
        </div>
      )}
    </div>
  )
}

// -------------------- EXPORT --------------------

/**
 * Muestra cualquier JSON con formato, sin campos fijos:
 * solo se dibujan las keys que existan en el dato.
 */
// export default function VisorJson({ data }) {
//   if (data === null || data === undefined) {
//     return (
//       <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
//         <p className="text-xs text-gray-400 italic">Sin datos de respuesta disponibles</p>
//       </div>
//     )
//   }

//   const textoJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-950 shadow-inner">
//       {/* Barra superior decorativa estilo terminal */}
//       <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/60 px-4 py-2">
//         <div className="flex items-center gap-1.5">
//           <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
//           <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
//           <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
//         </div>
//         <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400 font-mono">
//           JSON Viewer
//         </span>
//       </div>

//       {/* Contenido con scroll optimizado */}
//       <pre className="max-h-96 overflow-auto p-4 text-xs font-mono leading-relaxed text-emerald-400 scrollbar-thin scrollbar-thumb-gray-800">
//         {textoJson}
//       </pre>
//     </div>
//   )
// }
export default function VisorJson({ data }) {
  if (data === null || data === undefined) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
        <p className="text-xs text-gray-400 italic">Sin datos de respuesta disponibles</p>
      </div>
    )
  }

  const textoJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70">
      <div className="border-b border-gray-200 bg-gray-100/80 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Estructura de datos (JSON)
        </span>
        <span className="text-[11px] font-mono text-gray-400">
          {typeof data === 'string' ? 'Texto plano' : 'Objeto'}
        </span>
      </div>
      <div className="p-4">
        <pre className="max-h-96 overflow-auto rounded-lg bg-white p-4 text-xs font-mono text-gray-800 shadow-sm ring-1 ring-gray-900/5 leading-relaxed">
          {textoJson}
        </pre>
      </div>
    </div>
  )
}