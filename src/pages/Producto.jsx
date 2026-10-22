import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { gsap, useGSAP, reduceMotion } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { useCart } from '../lib/cart'
import { track } from '../lib/track'
import { pushRecent, getRecent } from '../lib/recent'
import { money, site } from '../config'
import { usePublic } from '../lib/content'
import { priceFor, unitsFor, optionsLabel, isQuote } from '../lib/catalog'
import { sendLead } from '../lib/leads'
import Img from '../components/Img'
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
        {[...(p.specs || []), ...(p.options || []).map((o) => [o.name, (o.values || []).map((v) => v.label).join(' · ')])].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b border-linea py-3 text-[18px]"><dt className="font-extrabold">{k}</dt><dd className="m-0 text-tinta2">{v}</dd></div>
        ))}
      </dl>
    )],
    ['Archivos y entrega', (
      <div key="e" className="grid max-w-[62ch] gap-3 text-[19px] text-tinta2">
        {p.custom && <p><b className="text-negro">Archivos:</b> PDF, AI, SVG, EPS o DXF en vectores, con textos convertidos a curvas. Para impresión también PNG o JPG a 150 dpi en tamaño real. Revisamos cada archivo antes de producir y te avisamos si hay que corregir algo.</p>}
        {p.leadTime && <p><b className="text-negro">Producción:</b> {p.leadTime}{isQuote(p) ? '' : ` desde que se confirma el pago${p.custom ? ' y el archivo' : ''}`}.</p>}
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

// Pedido de cotización para productos a medida: va al CRM (o a WhatsApp) con las opciones elegidas.
function QuoteForm({ p, options, file, obra }) {
  const [d, setD] = useState({ nombre: '', contacto: '', detalle: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const set = (k) => (e) => setD((x) => ({ ...x, [k]: e.target.value }))
  const valid = d.nombre.trim().length > 1 && d.contacto.trim().length > 5
  const send = async (e) => {
    e.preventDefault()
    if (!valid) return
    setStatus('sending'); setError('')
    try {
      await sendLead({
        origen: `Cotización · ${p.name}`, perfil: 'tienda',
        datos: { Producto: p.name, ...options, 'Obra de referencia': obra?.title, Detalle: d.detalle, Nombre: d.nombre, Contacto: d.contacto },
        archivos: file ? [file] : [],
      })
      setStatus('done')
    } catch (err) { setError(err.message); setStatus('idle') }
  }
  if (status === 'done') {
    return (
      <div className="frame grid gap-2 bg-naranja p-5 text-negro [--chaflan:14px]">
        <b className="text-[24px]">¡Recibimos tu pedido!</b>
        <span className="text-[17px]">Te escribimos con la propuesta para {p.name.toLowerCase()}.</span>
      </div>
    )
  }
  return (
    <form id="cotizar" onSubmit={send} noValidate className="frame grid scroll-mt-28 gap-3 bg-negro p-5 text-blanco [--chaflan:16px]">
      <b className="text-[24px] leading-tight">Pedir cotización</b>
      {obra && <span className="flex items-center gap-2 text-[16px] text-humo"><Foot className="h-4 w-4 text-naranja" />Como en la obra {obra.title}</span>}
      <input id="q-nombre" value={d.nombre} onChange={set('nombre')} autoComplete="name" placeholder="Nombre *" className="field text-negro" />
      <input id="q-contacto" value={d.contacto} onChange={set('contacto')} autoComplete="tel" placeholder="WhatsApp o email *" className="field text-negro" />
      <textarea id="q-detalle" rows={3} value={d.detalle} onChange={set('detalle')} placeholder="Medidas, cantidad, dónde va, plazo" className="field resize-y text-negro" />
      {error && <p role="alert" className="font-bold text-naranja">{error}</p>}
      <Button type="submit" tone="orange" size="lg" disabled={!valid || status === 'sending'} className="justify-center">{status === 'sending' ? 'Enviando…' : 'Enviar pedido'}</Button>
    </form>
  )
}

export default function Producto() {
  const { slug } = useParams()
  const c = usePublic()
  const p = c.products.find((x) => x.slug === slug)
  const [params] = useSearchParams()
  const obra = c.projects.find((x) => x.slug === params.get('obra'))
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

  if (!c.ready && !p) return <div className="min-h-[70vh]" />
  if (!p) return <NoEncontrada />
  const products = c.products
  const quote = isQuote(p)
  const cat = c.categories.find((x) => x.slug === p.category) || { slug: '', name: 'Tienda' }
  const idx = products.indexOf(p)
  const usedIn = c.projects.filter((x) => x.products?.includes(p.slug))
  const mats = (p.materials || []).map((m) => c.materials.find((x) => x.slug === m)).filter(Boolean)
  const unit = priceFor(p, sel)
  const units = unitsFor(p, sel)
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug)
  const more = related.length >= 3 ? related : [...related, ...products.filter((x) => x.category !== p.category && x.slug !== p.slug)].slice(0, 4)
  const recent = getRecent().filter((s) => s !== p.slug).map((s) => products.find((x) => x.slug === s)).filter(Boolean).slice(0, 4)

  const choose = (i, k) => { const n = [...sel]; n[i] = k; setSel(n) }
  const add = () => {
    const options = optionsLabel(p, sel)
    const key = `${p.slug}|${Object.values(options).join('|')}|${file?.name || ''}`
    cart.add({ key, slug: p.slug, name: p.name, options, price: unit, qty, file: file?.name, variant: idx, image: p.images?.[0] }, file)
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
                <div className="flex flex-wrap gap-1.5">{p.badge && <Badge>{p.badge}</Badge>}{p.custom && <Badge tone="dark">Personalizable</Badge>}{quote && <Badge tone="dark">A medida</Badge>}</div>
                <h1 data-split className="text-[clamp(42px,4.6vw,68px)] font-black">{p.name}</h1>
                <p data-reveal className="text-[20px] text-tinta2">{p.desc}</p>
              </div>

              {quote ? (
                <div className="grid gap-1 border-y border-linea py-4">
                  <span className="text-[clamp(34px,3.4vw,46px)] font-black leading-none">A cotizar</span>
                  <span className="text-[17px] text-tinta2">Se fabrica a medida: elegí las opciones, contanos el proyecto y te pasamos el presupuesto.</span>
                  {usedIn.length > 0 && <span className="text-[16px] font-bold text-hondo">Lo hicimos para {usedIn.slice(0, 3).map((x) => x.client || x.title).join(', ')}{usedIn.length > 3 ? ' y más' : ''}.</span>}
                </div>
              ) : (
              <div className="grid gap-1 border-y border-linea py-4">
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <Price value={unit * qty} className="text-[clamp(40px,4vw,56px)] font-black leading-none tabular-nums" />
                  {qty > 1 && <span className="text-[18px] font-bold text-tinta2">{money(unit)} c/u</span>}
                </div>
                {units && <span className="text-[17px] text-tinta2">≈ {money(Math.round(unit / units))} por unidad · {units} u. por pack</span>}
                <span className="text-[16px] text-tinta2">Pagás online con tarjeta, cuotas o transferencia.</span>
                {p.placeholder && import.meta.env.DEV && <span className="text-[14px] font-bold text-hondo">Precio de ejemplo</span>}
              </div>
              )}

              {(p.options || []).map((o, i) => {
                const current = sel[i] ?? 0
                const isColor = (o.values || []).length > 0 && o.values.every((v) => swatches[v.label])
                return (
                  <fieldset key={o.name} className="grid gap-2.5">
                    <legend className="mb-2.5 text-[16px] font-extrabold uppercase tracking-wider text-tinta2">{o.name}: <span className="normal-case tracking-normal text-negro">{o.values?.[current]?.label}</span></legend>
                    <div className="flex flex-wrap gap-2">
                      {(o.values || []).map((v, k) => {
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

              {quote ? (
                <div ref={buyRef}><QuoteForm p={p} options={optionsLabel(p, sel)} file={file} obra={obra} /></div>
              ) : (
                <div ref={buyRef} className="flex flex-wrap items-center gap-3">
                  <QtyStepper value={qty} onChange={setQty} />
                  <Button tone="orange" size="lg" onClick={add} className="flex-1 justify-center">Agregar al carrito</Button>
                </div>
              )}

              <ul className="grid gap-2.5 text-[17px]">
                {(quote ? [
                  ['Diseño y medición incluidos en la propuesta', 'Te asesoramos sobre materiales y tamaños'],
                  ['Fabricación en nuestro taller', site.city],
                  ['Instalación', 'La coordinamos con vos'],
                ] : [
                  ...(p.leadTime ? [[`Producción: ${p.leadTime}`, 'Desde que se confirma el pago']] : []),
                  ['Retiro sin cargo en el taller', site.city],
                  ['Envíos a todo el país', 'Costo según la dirección'],
                  ...(p.custom ? [['Revisamos tu archivo antes de producir', 'Si hay que corregir algo, te avisamos']] : []),
                ]).map(([t, d], i) => (
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

      {usedIn.length > 0 && (
        <section className="bg-negro py-[clamp(56px,8vw,110px)] text-blanco">
          <div className="wrap grid gap-8">
            <div className="grid gap-3"><p className="eyebrow text-naranja">En obra</p><h2 data-split className="h-section">Usado en estas obras.</h2></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {usedIn.map((x) => (
                <Link key={x.slug} to={`/proyectos/${x.slug}`} className="group grid gap-3">
                  <span className="frame relative aspect-[4/3] overflow-hidden bg-carbon [--chaflan:16px]"><Img src={x.cover} alt={x.title} sizes="(min-width: 1024px) 33vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gecko group-hover:scale-105" /></span>
                  <span><b className="block text-[24px] leading-tight group-hover:text-naranja">{x.title}</b><span className="text-[16px] text-humo">{x.rubro}{x.year ? ` · ${x.year}` : ''}</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {mats.length > 0 && (
        <section className="bg-blanco py-[clamp(48px,6vw,88px)]">
          <div className="wrap grid gap-6">
            <h2 className="text-[clamp(32px,3.6vw,48px)]">Materiales</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mats.map((m) => (
                <div key={m.slug} className="frame grid grid-cols-[80px_minmax(0,1fr)] gap-4 bg-papel p-4 [--chaflan:12px]">
                  <span className="relative aspect-square overflow-hidden bg-blanco"><Img src={m.image} alt="" sizes="80px" className="absolute inset-0 h-full w-full object-cover" /></span>
                  <span className="grid content-start gap-1"><b className="text-[20px] leading-tight">{m.name}</b><span className="text-[15px] text-tinta2">{m.desc}</span></span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
          <div className="min-w-0 flex-1"><b className="block truncate text-[18px] leading-tight">{p.name}</b><span className="text-[20px] font-black tabular-nums">{quote ? 'A cotizar' : money(unit * qty)}</span></div>
          {quote
            ? <Button tone="orange" onClick={() => buyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} tabIndex={barVisible ? 0 : -1}>Cotizar</Button>
            : <Button tone="orange" onClick={add} tabIndex={barVisible ? 0 : -1}>Agregar</Button>}
        </div>
      </div>
    </div>
  )
}
