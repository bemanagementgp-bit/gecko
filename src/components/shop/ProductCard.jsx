import { Link } from 'react-router'
import { money } from '../../config'
import { useCart } from '../../lib/cart'
import { priceFor, optionsLabel, categoryBySlug } from '../../data/products'
import { Foot } from '../Brand'
import { Placeholder } from '../ui'
import { PatternFill } from '../Patterns'

export function Badge({ children, tone = 'orange' }) {
  const t = tone === 'orange' ? 'bg-naranja text-negro' : tone === 'dark' ? 'bg-negro text-blanco' : 'bg-blanco text-negro'
  return <span className={`px-2 pb-0.5 text-[13px] font-extrabold uppercase tracking-wider ${t}`}>{children}</span>
}

// Tarjeta de catálogo: segunda imagen al pasar el cursor y "agregar rápido" para productos sin archivo.
export default function ProductCard({ p, i = 0 }) {
  const cart = useCart()
  const from = priceFor(p)
  const quickAdd = (e) => {
    e.preventDefault()
    const options = optionsLabel(p)
    cart.add({ key: `${p.slug}|${Object.values(options).join('|')}|`, slug: p.slug, name: p.name, options, price: from, qty: 1, variant: i })
  }
  return (
    <Link to={`/tienda/${p.slug}`} className="group grid gap-3">
      <div className="frame relative aspect-square overflow-hidden bg-papel [--chaflan:18px] transition-[clip-path] duration-500 ease-gecko group-hover:[--chaflan:40px]">
        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <PatternFill variant={i} className="absolute inset-0" />}
        {p.images?.[1] ? <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          : <PatternFill variant={i + 1} className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        <Placeholder show={p.placeholder} className="!left-auto !right-2.5" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {p.badge && <Badge>{p.badge}</Badge>}
          {p.custom && <Badge tone="dark">Personalizable</Badge>}
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-[140%] transition-transform duration-500 ease-gecko group-hover:translate-y-0 group-focus-within:translate-y-0">
          {p.custom ? (
            <span className="flex items-center justify-center gap-2 rounded-full bg-negro py-2.5 text-[17px] font-extrabold text-blanco">Elegir y subir diseño <Foot className="h-4 w-4 rotate-90 text-naranja" /></span>
          ) : (
            <button type="button" onClick={quickAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-naranja py-2.5 text-[17px] font-extrabold text-negro hover:bg-[#ff6a33]">
              Agregar rápido <Foot className="h-4 w-4 rotate-90" />
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-0.5">
        <span className="text-[14px] font-bold uppercase tracking-wider text-tinta2">{categoryBySlug[p.category].name}</span>
        <b className="text-[23px] leading-tight transition-colors group-hover:text-hondo">{p.name}</b>
        <span className="text-[18px] font-bold">Desde {money(from)}{p.leadTime && <span className="font-medium text-tinta2"> · {p.leadTime}</span>}</span>
      </div>
    </Link>
  )
}
