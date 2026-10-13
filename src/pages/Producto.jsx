import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { useCart } from '../lib/cart'
import { track } from '../lib/track'
import { pushRecent, getRecent } from '../lib/recent'
import { money, site } from '../config'
import { products, productBySlug, categoryBySlug, priceFor, unitsFor, optionsLabel } from '../data/products'
import { Foot } from '../components/Brand'
import { Button } from '../components/ui'
import ProductCard, { Badge } from '../components/shop/ProductCard'
import Gallery from '../components/shop/Gallery'
import Dropzone from '../components/shop/Dropzone'
import QtyStepper from '../components/shop/QtyStepper'
import NoEncontrada from './NoEncontrada'

const swatches = { Blanco: '#FFFFFF', Negro: '#1A1A1A', Naranja: '#F15A24', Cristal: 'linear-gradient(135deg,#eef3f5,#cfd9dd)', Esmerilado: 'linear-gradient(135deg,#f4f4f4,#dcdcdc)' }

// Precio que cuenta hasta el valor nuevo cada vez que cambia una opción.
function Price({ value, className }) {
  const el = useRef(null)
  const last = useRef(value)
  useGSAP(() => {
    const o = { v: last.current }
    last.current = value
    gsap.to(o, { v: value, duration: reduceMotion() ? 0 : 0.5, ease: 'power2.out', onUpdate: () => { if (el.current) el.current.textContent = money(Math.round(o.v / 100) * 100) } })
  }, { dependencies: [value] })
  return <span ref={el} className={className}>{money(value)}</span>
}

function Tabs({ p }) {
  const [tab, setTab] = useState(0)
  const bar = useRef(null)
  const btns = useRef([])
  useGSAP(() => {
    const b = btns.current[tab]
    if (b) gsap.to(bar.current, { x: b.offsetLeft, width: b.offsetWidth, duration: 0.45, ease: 'power3.out' })
  }, { dependencies: [tab] })
  const tabs = [
    ['Descripción', <p key="d" className="max-w-[62ch] text-[20px] text-tinta2">{p.desc}</p>],
    ['Especificaciones', (
      <dl key="s" className="grid max-w-[640px] border-t-2 border-negro">
        {[...(p.specs || []), ...p.options.map((o) => [o.name, o.values.map((v) => v.label).join(' · ')])].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b border-linea py-3 text-[18px]"><dt className="font-extrabold">{k}</dt><dd className="m-0 text-tinta2">{v}</dd></div>
        ))}
      </dl>
    )],
    ['Archivos y entrega', (
      <div key="e" className="grid max-w-[62ch] gap-3 text-[19px] text-tinta2">
        {p.custom && <p><b className="text-negro">Archivos:</b> PDF, AI, SVG, EPS o DXF en vectores, con textos convertidos a curvas. Para impresión también PNG o JPG a 150 dpi en tamaño real. Revisamos cada archivo antes de producir y te avisamos si hay que corregir algo.</p>}
        <p><b className="text-negro">Producción:</b> {p.leadTime} desde que se confirma el pago{p.custom ? ' y el archivo' : ''}.</p>
        <p><b className="text-negro">Retiro:</b> sin cargo en {site.address}, {site.city}. {site.hours}.</p>
        <p><b className="text-negro">Envío:</b> a todo el país; el costo se cotiza según la dirección al finalizar la compra.</p>
      </div>
    )],
  ]
  return (
    <div className="grid gap-6">
      <div role="tablist" aria-label="Información del producto" className="relative flex gap-6 overflow-x-auto border-b border-linea">
        {tabs.map(([t], i) => (
          <button key={t} ref={(el) => (btns.current[i] = el)} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
            className={`whitespace-nowrap pb-3 text-[21px] font-extrabold transition-colors ${tab === i ? 'text-negro' : 'text-tinta2 hover:text-negro'}`}>{t}</button>
        ))}
        <span ref={bar} className="absolute bottom-[-1px] left-0 h-[3px] bg-naranja" style={{ width: 0 }} />
      </div>
      <div role="tabpanel">{tabs[tab][1]}</div>
    </div>
  )
}

export default function Producto() {
  const { slug } = useParams()
  const p = productBySlug[slug]
  const root = useRef(null)
  const buyRef = useRef(null)
  const [sel, setSel] = useState([])
  const [qty, setQty] = useState(1)
  const [file, setFile] = useState(null)
  const [barVisible, setBarVisible] = useState(false)
  const cart = useCart()
  useReveal(root, [slug])

  useEffect(() => { setSel([]); setQty(1); setFile(null) }, [slug])
  useEffect(() => {
    if (!p) return
    track('ViewContent', { content_ids: [p.slug], content_type: 'product', value: priceFor(p), currency: 'ARS' })
    const t = setTimeout(() => pushRecent(p.slug), 0)
    return () => clearTimeout(t)
  }, [p])

  // Barra de compra fija en celular cuando el botón principal sale de pantalla.
  useEffect(() => {
    if (!buyRef.current) return
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(buyRef.current)
    return () => io.disconnect()
  }, [slug])
  useEffect(() => {
    document.documentElement.classList.toggle('has-buybar', barVisible)
    return () => document.documentElement.classList.remove('has-buybar')
  }, [barVisible])

  if (!p) return <NoEncontrada />
  const cat = categoryBySlug[p.category]
  const idx = products.indexOf(p)
  const unit = priceFor(p, sel)
  const units = unitsFor(p, sel)
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug)
  const more = related.length >= 3 ? related : [...related, ...products.filter((x) => x.category !== p.category && x.slug !== p.slug)].slice(0, 4)
  const recent = getRecent().filter((s) => s !== p.slug).map((s) => productBySlug[s]).filter(Boolean).slice(0, 4)

  const choose = (i, k) => { const n = [...sel]; n[i] = k; setSel(n) }
  const add = () => {
    const options = optionsLabel(p, sel)
    const key = `${p.slug}|${Object.values(options).join('|')}|${file?.name || ''}`
    cart.add({ key, slug: p.slug, name: p.name, options, price: unit, qty, file: file?.name, variant: idx }, file)
  }

  return (
    <div ref={root} key={slug}>
      <title>{`${p.name} · Tienda · gecko`}</title>
      <meta name="description" content={p.desc} />

      <section className="bg-blanco py-[clamp(32px,5vw,64px)]">
        <div className="wrap grid gap-6">
          <nav aria-label="Ruta" className="text-[16px] font-bold text-tinta2">
            <Link to="/tienda" className="hover:text-naranja">Tienda</Link> / <Link to={`/tienda?categoria=${cat.slug}`} className="hover:text-naranja">{cat.name}</Link> / <span className="text-negro">{p.name}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
            <div data-frame className="lg:sticky lg:top-24 lg:self-start"><Gallery product={p} variant={idx} /></div>

            <div className="grid content-start gap-6">
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-1.5">{p.badge && <Badge>{p.badge}</Badge>}{p.custom && <Badge tone="dark">Personalizable</Badge>}</div>
                <h1 data-split className="text-[clamp(42px,4.6vw,68px)] font-black">{p.name}</h1>
                <p data-reveal className="text-[20px] text-tinta2">{p.desc}</p>
              </div>

              <div className="grid gap-1 border-y border-linea py-4">
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <Price value={unit * qty} className="text-[clamp(40px,4vw,56px)] font-black leading-none tabular-nums" />
                  {qty > 1 && <span className="text-[18px] font-bold text-tinta2">{money(unit)} c/u</span>}
                </div>
                {units && <span className="text-[17px] text-tinta2">≈ {money(Math.round(unit / units))} por unidad · {units} u. por pack</span>}
                <span className="text-[16px] text-tinta2">Pagás online con tarjeta, cuotas o transferencia.</span>
                {p.placeholder && import.meta.env.DEV && <span className="text-[14px] font-bold text-hondo">Precio de ejemplo</span>}
              </div>

              {p.options.map((o, i) => {
                const current = sel[i] ?? 0
                const isColor = o.values.every((v) => swatches[v.label])
                return (
                  <fieldset key={o.name} className="grid gap-2.5">
                    <legend className="mb-2.5 text-[16px] font-extrabold uppercase tracking-wider text-tinta2">{o.name}: <span className="normal-case tracking-normal text-negro">{o.values[current].label}</span></legend>
                    <div className="flex flex-wrap gap-2">
                      {o.values.map((v, k) => {
                        const on = current === k
                        const delta = v.add ? ` +${money(v.add)}` : ''
                        return isColor ? (
                          <button key={v.label} type="button" aria-pressed={on} aria-label={`${v.label}${delta}`} title={v.label} onClick={() => choose(i, k)}
                            className={`grid h-12 w-12 place-items-center rounded-full border-[1.5px] transition-transform hover:scale-110 ${on ? 'border-negro ring-2 ring-naranja ring-offset-2' : 'border-negro/25'}`} style={{ background: swatches[v.label] }}>
                            {on && <Foot className={`h-5 w-5 ${v.label === 'Negro' ? 'text-blanco' : 'text-negro'}`} />}
                          </button>
                        ) : (
                          <button key={v.label} type="button" aria-pressed={on} onClick={() => choose(i, k)}
                            className={`rounded-full border-[1.5px] px-4 pb-2 pt-1 text-[18px] font-bold transition-colors ${on ? 'border-negro bg-negro text-blanco' : 'border-negro/25 hover:border-negro'}`}>
                            {v.label}{delta && <span className={`ml-1 text-[15px] ${on ? 'text-naranja' : 'text-tinta2'}`}>{delta}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )
              })}

              {p.custom && (
                <div className="grid gap-2.5">
                  <span className="text-[16px] font-extrabold uppercase tracking-wider text-tinta2">Tu diseño</span>
                  <Dropzone file={file} onChange={setFile} />
                </div>
              )}

              <div ref={buyRef} className="flex flex-wrap items-center gap-3">
                <QtyStepper value={qty} onChange={setQty} />
                <Button tone="orange" size="lg" onClick={add} className="flex-1 justify-center">Agregar al carrito</Button>
              </div>

              <ul className="grid gap-2.5 text-[17px]">
                {[
                  [`Producción: ${p.leadTime}`, 'Desde que se confirma el pago'],
                  ['Retiro sin cargo en el taller', site.city],
                  ['Envíos a todo el país', 'Costo según la dirección'],
                  ...(p.custom ? [['Revisamos tu archivo antes de producir', 'Si hay que corregir algo, te avisamos']] : []),
                ].map(([t, d], i) => (
                  <li key={t} className="flex items-start gap-3"><Foot className="mt-1 h-5 w-5 shrink-0 text-naranja" style={{ rotate: `${60 + i * 25}deg` }} /><span><b>{t}</b> <span className="text-tinta2">· {d}</span></span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-linea bg-blanco py-[clamp(48px,6vw,88px)]">
        <div className="wrap"><Tabs p={p} /></div>
      </section>

      <section className="bg-papel py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-8">
          <h2 data-split className="h-section">También te puede servir.</h2>
          <div data-reveal="stagger" className="grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {more.slice(0, 4).map((r) => <ProductCard key={r.slug} p={r} i={products.indexOf(r)} />)}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="bg-blanco py-[clamp(48px,6vw,80px)]">
          <div className="wrap grid gap-8">
            <h2 className="text-[clamp(32px,3.6vw,48px)]">Vistos recientemente</h2>
            <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{recent.map((r) => <ProductCard key={r.slug} p={r} i={products.indexOf(r)} />)}</div>
          </div>
        </section>
      )}

      {/* barra fija de compra (celular) */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-blanco/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-md transition-transform duration-500 ease-gecko lg:hidden ${barVisible ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!barVisible}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1"><b className="block truncate text-[18px] leading-tight">{p.name}</b><span className="text-[20px] font-black tabular-nums">{money(unit * qty)}</span></div>
          <Button tone="orange" onClick={add} tabIndex={barVisible ? 0 : -1}>Agregar</Button>
        </div>
      </div>
    </div>
  )
}
