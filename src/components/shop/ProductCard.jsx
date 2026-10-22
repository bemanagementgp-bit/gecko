import { Link } from 'react-router'
import { money } from '../../config'
import { useCart } from '../../lib/cart'
import { useContent } from '../../lib/content'
import { priceFor, optionsLabel, isQuote } from '../../lib/catalog'
import { Foot } from '../Brand'
import Img from '../Img'
import { Placeholder } from '../ui'
import { PatternFill } from '../Patterns'

export function Badge({ children, tone = 'orange' }) {
  const t = tone === 'orange' ? 'bg-naranja text-negro' : tone === 'dark' ? 'bg-negro text-blanco' : 'bg-blanco text-negro'
  return <span className={`px-2 pb-0.5 text-[13px] font-extrabold uppercase tracking-wider ${t}`}>{children}</span>
}

// Tarjeta de catálogo: segunda foto al pasar el cursor y acción rápida según el tipo de producto.
export default function ProductCard({ p, i = 0 }) {
  const cart = useCart()
  const { categories, projects } = useContent()
  const quote = isQuote(p)
  const from = priceFor(p)
  const usedIn = projects.filter((x) => x.published !== false && x.products?.includes(p.slug)).length
  const quickAdd = (e) => {
    e.preventDefault()
    const options = optionsLabel(p)
    cart.add({ key: `${p.slug}|${Object.values(options).join('|')}|`, slug: p.slug, name: p.name, options, price: from, qty: 1, image: p.images?.[0] })
  }
  const [a, b] = p.images || []
  return (
    <Link to={`/tienda/${p.slug}`} className="group grid gap-3">
      <div className="frame relative aspect-square overflow-hidden bg-papel [--chaflan:18px] transition-[clip-path] duration-500 ease-gecko group-hover:[--chaflan:40px]">
        {a ? <Img src={a} alt={p.name} sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0 h-full w-full object-cover" /> : <PatternFill variant={i} className="absolute inset-0" />}
        {b && <Img src={b} alt="" sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        <Placeholder show={p.placeholder} className="!left-auto !right-2.5" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {p.badge && <Badge>{p.badge}</Badge>}
          {p.custom && <Badge tone="dark">Personalizable</Badge>}
          {quote && <Badge tone="white">A medida</Badge>}
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-[140%] transition-transform duration-500 ease-gecko group-hover:translate-y-0 group-focus-within:translate-y-0">
          {quote || p.custom ? (
            <span className="flex items-center justify-center gap-2 rounded-full bg-negro py-2.5 text-[17px] font-extrabold text-blanco">{quote ? 'Pedir cotización' : 'Elegir y subir diseño'} <Foot className="h-4 w-4 rotate-90 text-naranja" /></span>
          ) : (
            <button type="button" onClick={quickAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-naranja py-2.5 text-[17px] font-extrabold text-negro hover:bg-[#ff6a33]">
              Agregar rápido <Foot className="h-4 w-4 rotate-90" />
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-0.5">
        <span className="text-[14px] font-bold uppercase tracking-wider text-tinta2">{categories.find((c) => c.slug === p.category)?.name}</span>
        <b className="text-[23px] leading-tight transition-colors group-hover:text-hondo">{p.name}</b>
        <span className="text-[18px] font-bold">{quote ? 'A cotizar' : `Desde ${money(from)}`}{p.leadTime && !quote && <span className="font-medium text-tinta2"> · {p.leadTime}</span>}</span>
        {usedIn > 0 && <span className="flex items-center gap-1.5 text-[15px] font-bold text-hondo"><Foot className="h-3.5 w-3.5" />Usado en {usedIn} {usedIn === 1 ? 'obra' : 'obras'}</span>}
      </div>
    </Link>
  )
}
