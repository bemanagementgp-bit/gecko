import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { money } from '../../config'
import { useCart } from '../../lib/cart'
import { priceFor, optionsLabel, isQuote } from '../../lib/catalog'
import { Foot } from '../Brand'
import Img from '../Img'

// Agrega el producto con sus opciones por defecto, o lleva a cotizarlo si no tiene precio fijo.
export function KitAction({ p, from, compact = false }) {
  const cart = useCart()
  const [done, setDone] = useState(false)
  const cls = compact ? 'px-3 pb-1.5 pt-0.5 text-[15px]' : 'px-4 pb-2 pt-1 text-[16px]'
  if (isQuote(p)) {
    return <Link to={`/tienda/${p.slug}?obra=${from}#cotizar`} className={`rounded-full border-[1.5px] border-current font-extrabold hover:bg-negro hover:text-blanco ${cls}`}>Cotizar</Link>
  }
  const add = () => {
    const options = optionsLabel(p)
    cart.add({ key: `${p.slug}|${Object.values(options).join('|')}|`, slug: p.slug, name: p.name, options, price: priceFor(p), qty: 1, image: p.images?.[0] })
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button type="button" onClick={add} className={`rounded-full bg-naranja font-extrabold text-negro hover:bg-[#ff6a33] ${cls}`}>
      {done ? 'Agregado ✓' : 'Agregar'}
    </button>
  )
}

export function KitItem({ p, n, active, from, onHover }) {
  return (
    <li onMouseEnter={() => onHover?.(p.slug)} onMouseLeave={() => onHover?.(null)}
      className={`grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-lg p-2 transition-colors ${active ? 'bg-[#FFF0E9]' : ''}`}>
      <Link to={`/tienda/${p.slug}`} className="frame relative aspect-square overflow-hidden bg-papel [--chaflan:10px]">
        <Img src={p.images?.[0]} alt={p.name} sizes="64px" className="absolute inset-0 h-full w-full object-cover" />
        {n != null && <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-naranja text-[12px] font-black text-negro">{n}</span>}
      </Link>
      <div className="grid min-w-0 gap-1">
        <Link to={`/tienda/${p.slug}`} className="truncate text-[18px] font-extrabold leading-tight hover:text-hondo">{p.name}</Link>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold text-tinta2">{isQuote(p) ? 'A cotizar' : `Desde ${money(priceFor(p))}`}</span>
          <KitAction p={p} from={from} compact />
        </div>
      </div>
    </li>
  )
}

// Panel "Lo que usamos en esta obra": productos con su acción y materiales.
export function KitPanel({ project, products, materials, active, onHover, numbered }) {
  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow text-naranja">Lo que usamos en esta obra</p>
        <p className="mt-1 text-[16px] text-tinta2">Los mismos productos, listos para tu proyecto.</p>
      </div>
      <ul className="-mx-2 grid gap-1">
        {products.map((p) => <KitItem key={p.slug} p={p} n={numbered?.[p.slug]} active={active === p.slug} from={project.slug} onHover={onHover} />)}
      </ul>
      {materials.length > 0 && (
        <div className="grid gap-2 border-t border-linea pt-4">
          <p className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">Materiales</p>
          <div className="flex flex-wrap gap-1.5">
            {materials.map((m) => <a key={m.slug} href={`#material-${m.slug}`} className="tag bg-papel !text-[15px] hover:bg-negro hover:text-blanco">{m.name}</a>)}
          </div>
        </div>
      )}
    </div>
  )
}

// En celular el kit vive en un botón flotante que abre una hoja desde abajo.
export function KitSheet({ project, products, materials, numbered }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start() }
  }, [open])
  if (!products.length) return null
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)}
        className="fixed bottom-[calc(20px+env(safe-area-inset-bottom,0px))] left-4 right-24 z-40 flex items-center justify-between gap-3 rounded-full bg-negro px-5 py-3 text-left text-blanco shadow-[0_12px_30px_-10px_rgba(26,26,26,.6)]">
        <span className="flex items-center gap-2 text-[17px] font-extrabold"><Foot className="h-5 w-5 text-naranja" />Productos de esta obra</span>
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-naranja px-1.5 text-[14px] font-black text-negro">{products.length}</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Productos de esta obra">
          <div className="absolute inset-0 bg-negro/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl bg-blanco p-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]" data-lenis-prevent>
            <div className="mb-3 flex justify-between"><span className="mx-auto h-1.5 w-12 rounded-full bg-gris" /></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-[24px]">×</button>
            <KitPanel project={project} products={products} materials={materials} numbered={numbered} />
          </div>
        </div>
      )}
    </div>
  )
}
