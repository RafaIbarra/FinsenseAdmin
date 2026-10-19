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

// function Grupo({ titulo, valor, nivel }) {
//   const [abierto, setAbierto] = useState(nivel <= 2)

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white">
//       <button
//         type="button"
//         onClick={() => setAbierto((a) => !a)}
//         className="flex w-full items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-2.5 text-left transition hover:bg-gray-100"
//       >
//         <span className="text-sm font-semibold text-gray-800">
//           {titulo}
//         </span>
//         <svg
//           className={`h-4 w-4 text-gray-400 transition ${
//             abierto ? 'rotate-180' : ''
//           }`}
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
//         </svg>
//       </button>

//       {abierto && (
//         <div className="px-4 py-2">
//           <Nodo valor={valor} nivel={nivel} />
//         </div>
//       )}
//     </div>
//   )
// }

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
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70">
//       <div className="border-b border-gray-200 bg-gray-100/80 px-4 py-2.5 flex items-center justify-between">
//         <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
//           Estructura de datos (JSON)
//         </span>
//         <span className="text-[11px] font-mono text-gray-400">
//           {typeof data === 'string' ? 'Texto plano' : 'Objeto'}
//         </span>
//       </div>
//       <div className="p-4">
//         <pre className="max-h-96 overflow-auto rounded-lg bg-white p-4 text-xs font-mono text-gray-800 shadow-sm ring-1 ring-gray-900/5 leading-relaxed">
//           {textoJson}
//         </pre>
//       </div>
//     </div>
//   )
// }


// export default function VisorJson({ data }) {
//   const [modalAbierto, setModalAbierto] = useState(false)

//   if (data === null || data === undefined) {
//     return (
//       <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
//         <p className="text-xs italic text-gray-400">Sin datos de respuesta disponibles</p>
//       </div>
//     )
//   }

//   const textoJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

//   return (
//     <>
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70">
//         <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100/80 px-4 py-2.5">
//           <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
//             Estructura de datos (JSON)
//           </span>

//           <button
//             type="button"
//             onClick={() => setModalAbierto(true)}
//             className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
//           >
//             <svg className="h-3.5 w-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M13.25 2.5a.75.75 0 000 1.5h2.19l-4.22 4.22a.75.75 0 001.06 1.06l4.22-4.22v2.19a.75.75 0 001.5 0v-4.75a.75.75 0 00-.75-.75h-4.75zM6.75 17.5a.75.75 0 000-1.5H4.56l4.22-4.22a.75.75 0 10-1.06-1.06L3.5 14.94v-2.19a.75.75 0 00-1.5 0v4.75c0 .414.336.75.75.75h4.75z" />
//             </svg>
//             Ampliar vista
//           </button>
//         </div>

//         <div className="p-4">
//           <pre className="max-h-96 overflow-auto rounded-lg bg-white p-4 text-xs font-mono leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-900/5">
//             {textoJson}
//           </pre>
//         </div>
//       </div>

//       {/* MODAL VISTA AMPLIADA */}
//       {modalAbierto && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//           {/* Fondo oscuro traslúcido */}
//           <div
//             className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
//             onClick={() => setModalAbierto(false)}
//           />

//           {/* Contenedor Modal */}
//           <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
//             {/* Header Modal */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//               <div>
//                 <h3 className="text-base font-semibold text-gray-900">
//                   Visor de JSON — Vista ampliada
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   Inspección completa de la estructura de respuesta
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setModalAbierto(false)}
//                 className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
//                 </svg>
//               </button>
//             </div>

//             {/* Cuerpo del Modal con scroll amplio */}
//             <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
//               <pre className="min-h-[50vh] overflow-auto rounded-xl bg-white p-6 text-xs font-mono leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-900/5">
//                 {textoJson}
//               </pre>
//             </div>

//             {/* Footer Modal */}
//             <div className="flex justify-end border-t border-gray-200 bg-gray-50/50 px-6 py-3">
//               <button
//                 type="button"
//                 onClick={() => setModalAbierto(false)}
//                 className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cerrar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// import { useState } from 'react'

// Componente recursivo para renderizar nodos interactivos (Objetos / Arrays / Valores)

// import { useState } from 'react'

// Componente auxiliar para renderizar líneas con soporte de colapso estilo Postman
function LineaJson({ clave, valor, nivel = 0, esUltimo = true }) {
  const [abierto, setAbierto] = useState(true)

  const esObjeto = valor !== null && typeof valor === 'object'
  const esArray = Array.isArray(valor)
  const identacion = nivel * 20 // Píxeles de sangría por nivel
  const estiloIndentacion = {
    paddingLeft: `${identacion}px`,
    backgroundImage:
      'repeating-linear-gradient(to right, transparent 0, transparent 19px, #e5e7eb 19px, #e5e7eb 20px)',
    backgroundSize: `${identacion}px 100%`,
    backgroundRepeat: 'no-repeat',
  }

  if (!esObjeto) {
    return (
      <div className="flex font-mono text-xs leading-5" style={estiloIndentacion}>
        <span className="w-4 shrink-0" />
        {clave !== undefined && <span className="text-gray-600">"{clave}": </span>}
        <span
          className={`ml-1 ${
            typeof valor === 'string'
              ? 'text-emerald-700'
              : typeof valor === 'number'
              ? 'text-blue-600'
              : typeof valor === 'boolean'
              ? 'text-purple-600'
              : 'text-gray-500'
          }`}
        >
          {JSON.stringify(valor)}
        </span>
        {!esUltimo && <span className="text-gray-400">,</span>}
      </div>
    )
  }

  const entradas = Object.entries(valor)
  const esVacio = entradas.length === 0
  const delimitadorInicio = esArray ? '[' : '{'
  const delimitadorFin = esArray ? ']' : '}'

  return (
    <div className="font-mono text-xs leading-5">
      <div className="flex items-center" style={estiloIndentacion}>
        {/* Botón de flecha colapsable */}
        {!esVacio ? (
          <button
            type="button"
            onClick={() => setAbierto(!abierto)}
            className="flex h-4 w-4 shrink-0 items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <svg
              className={`h-3 w-3 transform transition-transform ${abierto ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {clave !== undefined && <span className="text-gray-600 ml-0.5">"{clave}": </span>}
        <span className="text-gray-500 font-bold ml-1">{delimitadorInicio}</span>

        {!abierto && (
          <span
            onClick={() => setAbierto(true)}
            className="mx-1 cursor-pointer rounded bg-gray-200 px-1.5 py-0.2 text-[10px] text-gray-600 hover:bg-gray-300 transition"
          >
            {esArray ? `${valor.length} items` : `${entradas.length} keys`}
          </span>
        )}

        {(!abierto || esVacio) && (
          <span className="text-gray-500 font-bold">
            {delimitadorFin}
            {!esUltimo && <span className="text-gray-400">,</span>}
          </span>
        )}
      </div>

      {abierto && !esVacio && (
        <>
          {entradas.map(([k, v], index) => (
            <LineaJson
              key={k}
              clave={esArray ? undefined : k}
              valor={v}
              nivel={nivel + 1}
              esUltimo={index === entradas.length - 1}
            />
          ))}
          <div className="flex" style={estiloIndentacion}>
            <span className="w-4 shrink-0" />
            <span className="text-gray-500 font-bold">
              {delimitadorFin}
              {!esUltimo && <span className="text-gray-400">,</span>}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default function VisorJson({ data }) {
  const [modalAbierto, setModalAbierto] = useState(false)

  if (data === null || data === undefined) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
        <p className="text-xs italic text-gray-400">Sin datos de respuesta disponibles</p>
      </div>
    )
  }

  let objetoJson = data
  if (typeof data === 'string') {
    try {
      objetoJson = JSON.parse(data)
    } catch {
      objetoJson = data
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100/80 px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
            Estructura de datos (JSON)
          </span>

          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <svg className="h-3.5 w-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.25 2.5a.75.75 0 000 1.5h2.19l-4.22 4.22a.75.75 0 001.06 1.06l4.22-4.22v2.19a.75.75 0 001.5 0v-4.75a.75.75 0 00-.75-.75h-4.75zM6.75 17.5a.75.75 0 000-1.5H4.56l4.22-4.22a.75.75 0 10-1.06-1.06L3.5 14.94v-2.19a.75.75 0 00-1.5 0v4.75c0 .414.336.75.75.75h4.75z" />
            </svg>
            Ampliar vista
          </button>
        </div>

        {/* Bloque tipo Postman */}
        <div className="max-h-96 overflow-auto bg-white p-4 ring-1 ring-gray-900/5">
          {typeof objetoJson === 'object' && objetoJson !== null ? (
            <LineaJson valor={objetoJson} />
          ) : (
            <pre className="text-xs font-mono text-gray-800">{String(objetoJson)}</pre>
          )}
        </div>
      </div>

      {/* MODAL VISTA AMPLIADA */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setModalAbierto(false)}
          />

          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Visor de JSON — Vista ampliada
                </h3>
                <p className="text-xs text-gray-500">
                  Inspección completa en bloque interactivo
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
              <div className="min-h-[50vh] overflow-auto rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                {typeof objetoJson === 'object' && objetoJson !== null ? (
                  <LineaJson valor={objetoJson} />
                ) : (
                  <pre className="text-xs font-mono text-gray-800">{String(objetoJson)}</pre>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-200 bg-gray-50/50 px-6 py-3">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}