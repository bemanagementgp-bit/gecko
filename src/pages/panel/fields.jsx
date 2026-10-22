import { useRef, useState } from 'react'
import { useContent } from '../../lib/content'
import { imgSrc, isGenerated } from '../../lib/media'

// Campos del panel. Todos reciben `value` y `onChange(nuevoValor)`.

export function Field({ label, hint, children, wide }) {
  return (
    <label className={`grid content-start gap-1.5 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">{label}</span>
      {children}
      {hint && <span className="text-[15px] text-tinta2">{hint}</span>}
    </label>
  )
}

const input = 'w-full rounded-md border-[1.5px] border-linea bg-blanco px-3 py-2 text-[18px] font-semibold focus:border-naranja focus:outline-none focus:ring-2 focus:ring-naranja/40'

export const Text = ({ value, onChange, ...p }) => <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={input} {...p} />
export const Area = ({ value, onChange, rows = 3, ...p }) => <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${input} resize-y`} {...p} />
export const Num = ({ value, onChange, ...p }) => (
  <input type="number" inputMode="decimal" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} className={`${input} tabular-nums`} {...p} />
)
export function Select({ value, onChange, options, empty = 'Elegí una opción' }) {
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={input}>
      <option value="">{empty}</option>
      {options.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
    </select>
  )
}
export function Toggle({ value, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={!!value} onClick={() => onChange(!value)} className="flex items-center gap-3 text-[18px] font-bold">
      <span className={`relative h-7 w-12 rounded-full transition-colors ${value ? 'bg-naranja' : 'bg-gris'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-blanco shadow transition-all ${value ? 'left-6' : 'left-1'}`} />
      </span>
      {label}
    </button>
  )
}

// Selección múltiple de elementos (materiales, productos) como chips.
export function Chips({ value = [], onChange, options }) {
  const toggle = (s) => onChange(value.includes(s) ? value.filter((x) => x !== s) : [...value, s])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.slug)
        return (
          <button key={o.slug} type="button" aria-pressed={on} onClick={() => toggle(o.slug)}
            className={`rounded-full border-[1.5px] px-3 pb-1.5 pt-0.5 text-[16px] font-bold transition-colors ${on ? 'border-negro bg-negro text-blanco' : 'border-linea bg-blanco hover:border-negro'}`}>
            {on ? '✓ ' : '+ '}{o.name}
          </button>
        )
      })}
    </div>
  )
}

function useUpload() {
  const { upload } = useContent()
  const [busy, setBusy] = useState(0)
  const [error, setError] = useState('')
  const run = async (files) => {
    setError(''); setBusy(files.length)
    const out = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) { setError(`"${f.name}" no es una imagen.`); continue }
      try { out.push(await upload(f)) } catch (e) { setError(e.message) }
      setBusy((n) => n - 1)
    }
    setBusy(0)
    return out
  }
  return { run, busy, error }
}

const Thumb = ({ src, className = '' }) => (
  <>
    <img src={imgSrc(src, 640)} alt="" className={`h-full w-full object-cover ${className}`} />
    {isGenerated(src) && <span className="absolute right-1.5 top-1.5 rounded bg-naranja px-1.5 text-[12px] font-black" title="Imagen de ejemplo generada con IA: reemplazala por una foto real">IA</span>}
  </>
)

function DropArea({ onFiles, multiple, busy, children }) {
  const ref = useRef(null)
  const [over, setOver] = useState(false)
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]) }}
      className={`grid place-items-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${over ? 'border-naranja bg-[#FFF0E9]' : 'border-linea'}`}>
      <input ref={ref} type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={(e) => { onFiles([...e.target.files]); e.target.value = '' }} />
      {children}
      <button type="button" onClick={() => ref.current.click()} disabled={busy > 0} className="mt-2 rounded-full bg-negro px-4 pb-2 pt-1 text-[16px] font-extrabold text-blanco disabled:opacity-50">
        {busy > 0 ? `Subiendo ${busy}…` : multiple ? 'Subir fotos' : 'Subir foto'}
      </button>
      <span className="mt-1 text-[14px] text-tinta2">o arrastralas acá · se optimizan solas</span>
    </div>
  )
}

export function ImageField({ value, onChange }) {
  const up = useUpload()
  return (
    <div className="grid gap-2">
      {value ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-papel">
          <Thumb src={value} />
          <button type="button" onClick={() => onChange('')} className="absolute right-2 top-2 rounded-full bg-blanco px-3 pb-1 pt-0.5 text-[15px] font-bold shadow">Quitar</button>
        </div>
      ) : (
        <DropArea busy={up.busy} onFiles={async (f) => { const [u] = await up.run(f.slice(0, 1)); if (u) onChange(u) }}>
          <span className="text-[16px] font-bold">Sin foto</span>
        </DropArea>
      )}
      {up.error && <p role="alert" className="text-[15px] font-bold text-hondo">{up.error}</p>}
    </div>
  )
}

// Varias fotos: se suben, se reordenan con flechas y la primera puede marcarse como principal.
export function ImagesField({ value = [], onChange, onCover }) {
  const up = useUpload()
  const move = (i, d) => { const n = [...value]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); onChange(n) }
  return (
    <div className="grid gap-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((src, i) => (
            <li key={src + i} className="group relative aspect-square overflow-hidden rounded-lg bg-papel">
              <Thumb src={src} />
              <span className="absolute left-2 top-2 rounded bg-negro/80 px-1.5 text-[13px] font-bold text-blanco">{i + 1}</span>
              <div className="absolute inset-x-1 bottom-1 flex flex-wrap justify-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button type="button" aria-label="Mover antes" disabled={i === 0} onClick={() => move(i, -1)} className="rounded bg-blanco px-2 text-[15px] font-bold disabled:opacity-30">←</button>
                <button type="button" aria-label="Mover después" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="rounded bg-blanco px-2 text-[15px] font-bold disabled:opacity-30">→</button>
                {onCover && <button type="button" onClick={() => onCover(src)} className="rounded bg-naranja px-2 text-[13px] font-bold">Portada</button>}
                <button type="button" aria-label="Quitar foto" onClick={() => onChange(value.filter((_, k) => k !== i))} className="rounded bg-blanco px-2 text-[15px] font-bold text-hondo">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DropArea multiple busy={up.busy} onFiles={async (f) => onChange([...value, ...(await up.run(f))])}>
        <span className="text-[16px] font-bold">{value.length ? 'Sumar más fotos' : 'Todavía no hay fotos'}</span>
      </DropArea>
      {up.error && <p role="alert" className="text-[15px] font-bold text-hondo">{up.error}</p>}
    </div>
  )
}

// Lista de pares nombre / valor (especificaciones técnicas).
export function Pairs({ value = [], onChange, a = 'Dato', b = 'Valor' }) {
  const set = (i, k, v) => onChange(value.map((row, j) => (j === i ? (k === 0 ? [v, row[1]] : [row[0], v]) : row)))
  return (
    <div className="grid gap-2">
      {value.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
          <input value={row[0]} onChange={(e) => set(i, 0, e.target.value)} placeholder={a} className={input} />
          <input value={row[1]} onChange={(e) => set(i, 1, e.target.value)} placeholder={b} className={input} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Quitar fila" className="px-2 text-[20px] text-hondo">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ['', '']])} className="justify-self-start text-[16px] font-bold underline underline-offset-4">+ Agregar fila</button>
    </div>
  )
}

// Opciones del producto (Medida, Color…) con sus valores y cómo modifican el precio.
export function OptionsEditor({ value = [], onChange, quote }) {
  const setOpt = (i, o) => onChange(value.map((x, j) => (j === i ? o : x)))
  const setVal = (i, k, v) => setOpt(i, { ...value[i], values: value[i].values.map((x, j) => (j === k ? v : x)) })
  return (
    <div className="grid gap-4">
      {value.map((o, i) => (
        <div key={i} className="grid gap-2 rounded-lg border-[1.5px] border-linea p-3">
          <div className="flex gap-2">
            <input value={o.name} onChange={(e) => setOpt(i, { ...o, name: e.target.value })} placeholder="Nombre de la opción (ej. Medida)" className={`${input} font-extrabold`} />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="shrink-0 px-2 text-[15px] font-bold text-hondo">Quitar opción</button>
          </div>
          {(o.values || []).map((v, k) => (
            <div key={k} className={`grid gap-2 ${quote ? 'grid-cols-[1fr_auto]' : 'grid-cols-[1.4fr_.8fr_.8fr_auto]'}`}>
              <input value={v.label} onChange={(e) => setVal(i, k, { ...v, label: e.target.value })} placeholder="Valor (ej. 60 × 60 cm)" className={input} />
              {!quote && <input type="number" step="0.1" value={v.mult ?? ''} onChange={(e) => setVal(i, k, { ...v, mult: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="× precio" title="Multiplica el precio base (ej. 1.5)" className={input} />}
              {!quote && <input type="number" value={v.add ?? ''} onChange={(e) => setVal(i, k, { ...v, add: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="+ $" title="Suma un monto fijo" className={input} />}
              <button type="button" onClick={() => setOpt(i, { ...o, values: o.values.filter((_, j) => j !== k) })} aria-label="Quitar valor" className="px-2 text-[20px] text-hondo">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setOpt(i, { ...o, values: [...(o.values || []), { label: '' }] })} className="justify-self-start text-[16px] font-bold underline underline-offset-4">+ Agregar valor</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { name: '', values: [{ label: '' }] }])} className="justify-self-start rounded-full border-[1.5px] border-negro px-4 pb-1.5 pt-0.5 text-[16px] font-extrabold">+ Agregar opción</button>
      {!quote && <p className="text-[15px] text-tinta2">"× precio" multiplica el precio base (1.5 = 50% más). "+ $" suma un monto fijo. Se pueden combinar.</p>}
    </div>
  )
}

// Puntos sobre la portada: clic en la foto agrega un punto; a cada punto se le asigna un producto.
export function HotspotEditor({ image, value = [], onChange, products }) {
  const box = useRef(null)
  const add = (e) => {
    const r = box.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10
    onChange([...value, { x, y, product: products[0]?.slug || '' }])
  }
  if (!image) return <p className="text-[16px] text-tinta2">Subí primero la foto de portada.</p>
  return (
    <div className="grid gap-3">
      <div ref={box} onClick={add} className="relative cursor-crosshair overflow-hidden rounded-lg bg-papel">
        <img src={imgSrc(image, 1600)} alt="" className="block w-full select-none" draggable={false} />
        {value.map((h, i) => (
          <span key={i} className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-[14px] font-black shadow-[0_0_0_3px_#fff]" style={{ left: `${h.x}%`, top: `${h.y}%` }}>{i + 1}</span>
        ))}
      </div>
      <p className="text-[15px] text-tinta2">Hacé clic sobre la foto donde se ve cada producto. Solo se pueden elegir productos marcados arriba en "Productos usados".</p>
      {value.map((h, i) => (
        <div key={i} className="grid grid-cols-[32px_1fr_auto] items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-naranja text-[14px] font-black">{i + 1}</span>
          <select value={h.product} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, product: e.target.value } : x)))} className={input}>
            <option value="">Elegí el producto</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-2 text-[15px] font-bold text-hondo">Quitar</button>
        </div>
      ))}
    </div>
  )
}

// Etapas del proyecto ("Del diseño a la obra"): título, texto y foto o video de cada paso.
export function EtapasEditor({ value = [], onChange, videos = [] }) {
  const set = (i, patch) => onChange(value.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const move = (i, d) => { const n = [...value]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); onChange(n) }
  return (
    <div className="grid gap-4">
      {value.map((e, i) => (
        <div key={i} className="grid gap-3 rounded-lg border-[1.5px] border-linea p-3 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="grid content-start gap-2">
            <ImageField value={e.image} onChange={(v) => set(i, { image: v })} />
            <select value={e.video || ''} onChange={(ev) => set(i, { video: ev.target.value || undefined })} className={input}>
              <option value="">Sin video (usa la foto)</option>
              {videos.map((v) => <option key={v.src} value={v.src}>{v.label}</option>)}
            </select>
          </div>
          <div className="grid content-start gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-naranja text-[14px] font-black">{i + 1}</span>
              <input value={e.title || ''} onChange={(ev) => set(i, { title: ev.target.value })} placeholder="Título (ej. Diseño)" className={`${input} font-extrabold`} />
            </div>
            <textarea value={e.text || ''} onChange={(ev) => set(i, { text: ev.target.value })} rows={3} placeholder="Qué se hizo en esta etapa" className={`${input} resize-y`} />
            <div className="flex gap-2">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded border-[1.5px] border-linea px-2 font-bold disabled:opacity-30">↑</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="rounded border-[1.5px] border-linea px-2 font-bold disabled:opacity-30">↓</button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="ml-auto text-[15px] font-bold text-hondo">Quitar etapa</button>
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { title: '', text: '' }])} className="justify-self-start rounded-full border-[1.5px] border-negro px-4 pb-1.5 pt-0.5 text-[16px] font-extrabold">+ Agregar etapa</button>
    </div>
  )
}
