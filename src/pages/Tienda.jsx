import { useLayoutEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { gsap, Flip } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { usePublic } from '../lib/content'
import { searchProducts, priceFor, isQuote } from '../lib/catalog'
import { faqs } from '../data/faqs'
import { getRecent } from '../lib/recent'
import { Foot } from '../components/Brand'
import { Button, SectionHead } from '../components/ui'
import { Truchet } from '../components/Patterns'
import { Faq } from '../components/blocks'
import ProductCard from '../components/shop/ProductCard'
import PageHero, { HeroChip } from '../components/PageHero'

const sorts = [
  ['destacados', 'Destacados'],
  ['menor', 'Menor precio'],
  ['mayor', 'Mayor precio'],
  ['az', 'A → Z'],
]
const sortFn = {
  destacados: (a, b) => (a.featured || 99) - (b.featured || 99),
  // los productos a cotizar van al final cuando se ordena por precio
  menor: (a, b) => (isQuote(a) - isQuote(b)) || priceFor(a) - priceFor(b),
  mayor: (a, b) => (isQuote(a) - isQuote(b)) || priceFor(b) - priceFor(a),
  az: (a, b) => a.name.localeCompare(b.name, 'es'),
}

function Chip({ on, onClick, children, count }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick}
      className={`flex items-center gap-2 rounded-full border-[1.5px] px-4 pb-2 pt-1 text-[18px] font-bold transition-colors ${on ? 'border-negro bg-negro text-blanco' : 'border-negro/25 hover:border-negro'}`}>
      {children}{count != null && <span className={`text-[14px] tabular-nums ${on ? 'text-naranja' : 'text-tinta2'}`}>{count}</span>}
    </button>
  )
}

export default function Tienda() {
  const { products, categories, projects } = usePublic()
  const root = useRef(null)
  const grid = useRef(null)
  const flip = useRef(null)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('categoria') || ''
  const orden = params.get('orden') || 'destacados'
  const custom = params.get('personalizable') === '1'
  useReveal(root)

  // Cada cambio de filtro guarda la posición actual de las tarjetas para animarlas a la grilla nueva.
  const setParam = (key, value, animate = true) => {
    if (animate && grid.current) flip.current = Flip.getState(grid.current.children)
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const reset = () => { flip.current = Flip.getState(grid.current.children); setParams({}, { replace: true, preventScrollReset: true }) }

  useLayoutEffect(() => {
    if (!flip.current) return
    Flip.from(flip.current, {
      duration: 0.6, ease: 'power3.inOut', stagger: 0.03, absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
    })
    flip.current = null
  }, [q, cat, orden, custom])

  const base = useMemo(() => searchProducts(products, q, categories), [products, q, categories])
  const list = useMemo(() => base.filter((p) => (!cat || p.category === cat) && (!custom || p.custom)).sort(sortFn[orden] || sortFn.destacados), [base, cat, custom, orden])
  const counts = Object.fromEntries(categories.map((c) => [c.slug, base.filter((p) => p.category === c.slug && (!custom || p.custom)).length]))
  const current = categories.find((c) => c.slug === cat)
  const recent = getRecent().map((s) => products.find((x) => x.slug === s)).filter(Boolean).slice(0, 4)
  const filtered = q || cat || custom || orden !== 'destacados'

  return (
    <div ref={root}>
      <title>Tienda · gecko</title>
      <meta name="description" content="Stickers, vinilos, señalética, acrílico y MDF cortado a medida y exhibidores. Comprá online y retirá en el taller o recibilo en tu casa." />

      <PageHero eyebrow="Tienda online" title="Pedilo online, lo hacemos en el taller."
        lead="Los mismos productos que ves en nuestras obras: estándar con precio a la vista y piezas a medida para cotizar."
        media={{ type: 'stack', products: [...products].sort((a, b) => (a.featured || 99) - (b.featured || 99)) }}
        stats={[[products.length, 'Productos'], [products.filter((p) => !isQuote(p)).length, 'Con precio online'], [products.filter(isQuote).length, 'A medida'], [projects.filter((x) => x.products?.length).length, 'Obras con estos productos']]}>
        {categories.map((c) => (
          <HeroChip key={c.slug} onClick={() => { setParam('categoria', c.slug, false); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) }}>{c.name}</HeroChip>
        ))}
      </PageHero>

      <div className="border-b border-linea bg-papel">
        <div data-reveal="stagger" className="wrap grid gap-4 py-5 text-[17px] font-bold sm:grid-cols-2 lg:grid-cols-4">
          {[['Pagás online', 'Tarjeta, cuotas o transferencia'], ['Retiro sin cargo', 'En el taller de La Plata'], ['Envíos a todo el país', 'Se cotizan al finalizar'], ['Revisamos tu archivo', 'Antes de producir, sin costo']].map(([t, d], i) => (
            <div key={t} className="flex items-center gap-3"><Foot className="h-6 w-6 shrink-0 text-naranja" style={{ rotate: `${60 + i * 25}deg` }} /><span>{t}<span className="block font-medium text-tinta2">{d}</span></span></div>
          ))}
        </div>
      </div>

      <section id="catalogo" className="scroll-mt-20 bg-blanco pb-[clamp(56px,8vw,110px)]">
        {/* barra de herramientas pegada arriba mientras se recorre el catálogo */}
        <div className="sticky top-[var(--hdr,68px)] z-30 border-b transition-[top] duration-300 border-linea bg-white/95 backdrop-blur-md">
          <div className="wrap flex flex-wrap items-center gap-3 py-3">
            <label className="relative min-w-[220px] flex-1">
              <span className="sr-only">Buscar productos</span>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-tinta2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input id="buscar" type="search" value={q} onChange={(e) => setParam('q', e.target.value, false)} placeholder="Buscar: acrílico, stickers, exhibidor…"
                className="w-full rounded-full border-[1.5px] border-negro/25 bg-blanco py-2.5 pl-11 pr-4 text-[18px] font-semibold focus:border-naranja focus:outline-none focus:ring-2 focus:ring-naranja" />
            </label>
            <label className="flex items-center gap-2 text-[17px] font-bold">
              <span className="text-tinta2">Ordenar</span>
              <select id="orden" value={orden} onChange={(e) => setParam('orden', e.target.value === 'destacados' ? '' : e.target.value)}
                className="rounded-full border-[1.5px] border-negro/25 bg-blanco py-2 pl-4 pr-9 text-[17px] font-bold focus:border-naranja focus:outline-none">
                {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[17px] font-bold">
              <input id="personalizable" type="checkbox" checked={custom} onChange={(e) => setParam('personalizable', e.target.checked ? '1' : '')} className="h-5 w-5 accent-[#F15A24]" />
              Solo personalizables
            </label>
          </div>
        </div>

        <div className="wrap grid gap-8 pt-8">
          <div role="radiogroup" aria-label="Categoría" className="flex flex-wrap gap-2">
            <Chip on={!cat} onClick={() => setParam('categoria', '')} count={base.filter((p) => !custom || p.custom).length}>Todo</Chip>
            {categories.map((c) => <Chip key={c.slug} on={cat === c.slug} onClick={() => setParam('categoria', c.slug)} count={counts[c.slug]}>{c.name}</Chip>)}
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[19px] text-tinta2" aria-live="polite">
              <b className="text-negro">{list.length} {list.length === 1 ? 'producto' : 'productos'}</b>
              {q && <> para “{q}”</>}{current && <> en {current.name}</>}{current && <span className="block text-[17px]">{current.desc}</span>}
            </p>
            {filtered && <button type="button" onClick={reset} className="text-[17px] font-bold underline underline-offset-4 hover:text-hondo">Limpiar filtros</button>}
          </div>

          <div ref={grid} className="grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => <div key={p.slug} data-flip-id={p.slug}><ProductCard p={p} i={i} /></div>)}
          </div>

          {list.length === 0 && (
            <div className="frame grid justify-items-start gap-4 bg-papel p-8">
              <div className="flex gap-2">{[0, 1, 2].map((i) => <Foot key={i} className="h-8 w-8 text-gris" style={{ rotate: `${70 + i * 20}deg` }} />)}</div>
              <p className="text-[26px] font-extrabold">No encontramos productos con esa búsqueda.</p>
              <p className="text-[19px] text-tinta2">Lo que no está en la tienda también lo hacemos: pedí una cotización a medida.</p>
              <div className="flex flex-wrap gap-3"><Button onClick={reset} tone="dark">Ver todo</Button><Button to="/contacto" tone="ghost">Pedir cotización</Button></div>
            </div>
          )}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="border-t border-linea bg-blanco py-[clamp(48px,6vw,80px)]">
          <div className="wrap grid gap-8">
            <h2 className="text-[clamp(32px,3.6vw,48px)]">Vistos recientemente</h2>
            <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">{recent.map((p, i) => <ProductCard key={p.slug} p={p} i={i + 2} />)}</div>
          </div>
        </section>
      )}

      <section className="bg-papel py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="grid content-start gap-6">
            <SectionHead eyebrow="Compras" title="Cómo funciona la tienda." intro="¿Necesitás algo que no está? Lo cotizamos a medida." />
            <div data-reveal><Button to="/contacto" tone="dark">Pedir cotización a medida</Button></div>
          </div>
          <Faq items={faqs.tienda} />
        </div>
      </section>
    </div>
  )
}
