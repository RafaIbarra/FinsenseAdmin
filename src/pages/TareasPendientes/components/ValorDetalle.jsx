/* ============================================================
   RENDERIZADOR RECURSIVO DE VALORES (arregla [object Object])
   ============================================================ */
export default function ValorDetalle({ valor, clave }) {
  if (valor === null || valor === undefined || valor === '') {
    return <span className="text-sm text-slate-700">-</span>
  }

  if (typeof valor !== 'object') {
    const texto = String(valor)

    if (
      clave &&
      clave.toLowerCase() === 'url' &&
      /^https?:\/\//i.test(texto)
    ) {
      return (
        <a
          href={texto}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm text-indigo-600 hover:underline"
        >
          {texto}
        </a>
      )
    }

    return (
      <span className="break-words text-sm text-slate-700">
        {texto}
      </span>
    )
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) {
      return <span className="text-sm text-slate-700">-</span>
    }

    return (
      <div className="space-y-3">
        {valor.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <ValorDetalle valor={item} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Object.entries(valor).map(([k, v]) => (
        <div key={k} className="rounded-lg bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {k}
          </p>

          <div className="mt-1">
            <ValorDetalle valor={v} clave={k} />
          </div>
        </div>
      ))}
    </div>
  )
}
