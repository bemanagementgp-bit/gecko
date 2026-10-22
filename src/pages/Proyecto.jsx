import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { track } from '../lib/track'
import { usePublic } from '../lib/content'
import { money } from '../config'
import { priceFor, isQuote } from '../lib/catalog'
import { Foot } from '../components/Brand'
import Img from '../components/Img'
import Lightbox from '../components/Lightbox'
import { VideoLoop, Reels } from '../components/Video'
import { BeforeAfter, CtaBand } from '../components/blocks'
import ProductCard from '../components/shop/ProductCard'
import { KitPanel, KitSheet, KitAction } from '../components/shop/ProjectKit'
import Etapas from '../components/Etapas'
import NoEncontrada from './NoEncontrada'

// Punto sobre la foto: al pasar o tocar muestra el producto que se usó en ese lugar.
function Hotspot({ h, p, n, open, onOpen, onClose, from }) {
  if (!p) return null
  const right = h.x > 60
  const below = h.y < 35
  return (
    <div data-spot className={`absolute ${open ? 'z-30' : 'z-10'}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" onClick={open ? onClose : onOpen} aria-expanded={open} aria-label={`${n}. ${p.name}`}
        className="relative grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-[15px] font-black text-negro shadow-[0_0_0_4px_rgba(255,255,255,.9)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-naranja/60 motion-reduce:hidden" />
        <span className="relative">{n}</span>
      </button>
      {open && (
        <div className={`absolute z-20 w-[260px] ${right ? 'right-6' : 'left-6'} ${below ? 'top-2' : 'bottom-2'}`}>
          <div className="frame grid grid-cols-[72px_minmax(0,1fr)] gap-3 bg-blanco p-3 text-negro shadow-2xl [--chaflan:12px]">
            <div className="relative aspect-square overflow-hidden bg-papel"><Img src={p.images?.[0]} alt="" sizes="72px" className="absolute inset-0 h-full w-full object-cover" /></div>
            <div className="grid content-start gap-1">
              <Link to={`/tienda/${p.slug}`} className="text-[17px] font-extrabold leading-tight hover:text-hondo">{p.name}</Link>
              <span className="text-[14px] font-bold text-tinta2">{isQuote(p) ? 'A cotizar' : `Desde ${money(priceFor(p))}`}</span>
              <div className="mt-1 flex gap-2"><KitAction p={p} from={from} compact /><Link to={`/tienda/${p.slug}`} className="self-center text-[14px] font-bold underline underline-offset-4">Ver</Link></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Block = ({ n, title, text }) => (
  <div data-reveal className="grid content-start gap-3 border-t-[3px] border-negro pt-4">
    <span className="flex items-center gap-2 text-[18px] font-black text-naranja"><Foot className="h-5 w-5 rotate-90" />0{n}</span>
    <h2 className="text-[clamp(30px,3vw,42px)]">{title}</h2>
    <p className="text-[20px] text-tinta2">{text}</p>
  </div>
)

export default function Proyecto() {
  const { slug } = useParams()
  const c = usePublic()
  const p = c.projects.find((x) => x.slug === slug)
  const root = useRef(null)
  const [spot, setSpot] = useState(null)
  const [active, setActive] = useState(null)
  const [lb, setLb] = useState(null)
  useReveal(root, [slug])

  useEffect(() => { setSpot(null); setLb(null) }, [slug])
  useEffect(() => { if (p) track('ViewContent', { content_ids: [p.slug], content_type: 'project', content_category: p.unit }) }, [p])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-cover]', { '--chaflan': '40%', duration: 1.4, delay: 0.7, ease: 'power4.out' })
      gsap.from('[data-spot]', { scale: 0, duration: 0.6, stagger: 0.12, delay: 1.5, ease: 'back.out(3)' })
    })
  }, { scope: root, dependencies: [slug], revertOnUpdate: true })

  const kit = useMemo(() => (p?.products || []).map((s) => c.products.find((x) => x.slug === s)).filter(Boolean), [p, c.products])
  const mats = useMemo(() => (p?.materials || []).map((s) => c.materials.find((x) => x.slug === s)).filter(Boolean), [p, c.materials])
  const numbered = useMemo(() => Object.fromEntries((p?.hotspots || []).map((h, i) => [h.product, i + 1])), [p])

  if (!c.ready && !p) return <div className="min-h-[70vh]" />
  if (!p) return <NoEncontrada />

  const unit = c.units.find((u) => u.slug === p.unit)
  const idx = c.projects.indexOf(p)
  const next = c.projects[(idx + 1) % c.projects.length]
  const gallery = [p.cover, ...(p.gallery || [])].filter(Boolean)
  const reels = (p.reels || []).map((s) => c.reels.find((r) => r.slug === s)).filter(Boolean)
  const landing = { arquigrafia: '/para-comercios', 'pop-retail': '/para-marcas' }[p.unit] || '/contacto'
  const facts = [['Cliente', p.client], ['Unidad', unit?.name], ['Rubro', p.rubro], ['Año', p.year], ['Lugar', p.location]].filter(([, v]) => v)

  return (
    <div ref={root} key={slug}>
      <title>{`${p.title} · Proyectos · gecko`}</title>
      <meta name="description" content={p.summary || p.necesidad} />

      <section className="bg-blanco pt-[clamp(32px,5vw,72px)]">
        <div className="wrap grid gap-6">
          <nav aria-label="Ruta" className="text-[16px] font-bold text-tinta2"><Link to="/proyectos" className="hover:text-naranja">← Proyectos</Link> / {unit?.name}</nav>
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <h1 data-split className="display max-w-[12ch]">{p.title}</h1>
            {p.summary && <p data-reveal className="lead text-tinta2">{p.summary}</p>}
          </div>
          <dl data-reveal="stagger" className="flex flex-wrap gap-x-10 gap-y-3 border-y border-linea py-4">
            {facts.map(([k, v]) => <div key={k}><dt className="eyebrow !text-[13px] text-tinta2">{k}</dt><dd className="m-0 text-[21px] font-extrabold">{v}</dd></div>)}
          </dl>
        </div>

        <div className="wrap mt-8">
          <div data-cover className="frame relative bg-negro [--chaflan:28px]" style={{ clipPath: spot != null ? 'none' : undefined }}>
            {/* proporción natural de la foto: los puntos están en % de la imagen completa */}
            <Img src={p.cover} alt={p.title} sizes="100vw" eager className="block h-auto w-full" />

            {(p.hotspots || []).map((h, i) => (
              <Hotspot key={i} h={h} n={i + 1} p={c.products.find((x) => x.slug === h.product)} open={spot === i} from={p.slug}
                onOpen={() => { setSpot(i); setActive(h.product) }} onClose={() => { setSpot(null); setActive(null) }} />
            ))}
            {p.hotspots?.length > 0 && (
              <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 bg-negro/80 px-3 py-1.5 text-[14px] font-bold text-blanco backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-naranja" />Tocá los puntos para ver cada producto
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="grid min-w-0 gap-16">
            <div className="grid gap-10 md:grid-cols-3">
              {p.necesidad && <Block n={1} title="La necesidad" text={p.necesidad} />}
              {p.proceso && <Block n={2} title="El proceso" text={p.proceso} />}
              {p.resultado && <Block n={3} title="El resultado" text={p.resultado} />}
            </div>

            {p.before && p.after && (
              <div className="grid gap-5">
                <h2 data-split className="h-section">Antes y después.</h2>
                <div data-reveal><BeforeAfter before={p.before} after={p.after} /></div>
              </div>
            )}

            {gallery.length > 1 && (
              <div className="grid gap-5">
                <h2 data-split className="h-section">La obra, de cerca.</h2>
                <div className="columns-2 gap-3 md:columns-3 [&>*]:mb-3" data-reveal="stagger">
                  {gallery.map((g, i) => (
                    <button key={g + i} type="button" onClick={() => setLb(i)} className="group relative block w-full overflow-hidden bg-papel" aria-label={`Ver foto ${i + 1} en grande`}>
                      <Img src={g} alt={`${p.title}, foto ${i + 1}`} sizes="(min-width: 1024px) 25vw, 50vw" className="block h-auto w-full transition-transform duration-700 ease-gecko group-hover:scale-105" />
                      <span className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-blanco/90 text-[18px] opacity-0 transition-opacity group-hover:opacity-100">⤢</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {p.clips?.length > 0 && (
              <div className="grid gap-5">
                <h2 data-split className="h-section">En movimiento.</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3" data-reveal="stagger">
                  {p.clips.map((v) => <div key={v} className="frame relative aspect-[9/16] overflow-hidden bg-negro [--chaflan:16px]"><VideoLoop src={v} label={`Video de ${p.title}`} /></div>)}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-6">
              {kit.length > 0 && (
                <div className="frame border-[1.5px] border-linea bg-blanco p-5 [--chaflan:18px]">
                  <KitPanel project={p} products={kit} materials={mats} active={active} onHover={setActive} numbered={numbered} />
                </div>
              )}
              <div className="frame grid gap-3 bg-negro p-5 text-blanco [--chaflan:18px]">
                <b className="text-[24px] leading-tight">¿Querés algo así para tu marca?</b>
                <p className="text-[16px] text-humo">Contanos tu idea y te armamos una propuesta.</p>
                <Link to={landing} className="justify-self-start rounded-full bg-naranja px-5 pb-2.5 pt-1.5 text-[18px] font-extrabold text-negro">Contanos tu proyecto</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {p.etapas?.length > 0 && <Etapas etapas={p.etapas} />}

      {mats.length > 0 && (
        <section className="bg-papel py-[clamp(56px,8vw,110px)]">
          <div className="wrap grid gap-8">
            <div className="grid gap-3"><p className="eyebrow text-naranja">Materiales</p><h2 data-split className="h-section">Con qué está hecho.</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {mats.map((m) => (
                <article key={m.slug} id={`material-${m.slug}`} className="frame grid scroll-mt-28 grid-cols-[96px_minmax(0,1fr)] gap-4 bg-blanco p-4 [--chaflan:14px]">
                  <div className="relative aspect-square overflow-hidden bg-papel"><Img src={m.image} alt="" sizes="96px" className="absolute inset-0 h-full w-full object-cover" /></div>
                  <div className="grid content-start gap-1">
                    <h3 className="text-[22px]">{m.name}</h3>
                    <p className="text-[16px] text-tinta2">{m.desc}</p>
                    {m.uses && <p className="text-[14px] font-bold text-hondo">{m.uses}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {kit.length > 0 && (
        <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
          <div className="wrap grid gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="grid gap-3"><p className="eyebrow text-naranja">Tienda</p><h2 data-split className="h-section">Los productos de esta obra.</h2></div>
              <Link to="/tienda" className="text-[18px] font-extrabold underline underline-offset-4">Ver toda la tienda</Link>
            </div>
            <div className="grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
              {kit.map((x) => <ProductCard key={x.slug} p={x} i={c.products.indexOf(x)} />)}
            </div>
          </div>
        </section>
      )}

      {reels.length > 0 && (
        <section className="bg-negro py-[clamp(56px,8vw,110px)] text-blanco">
          <div className="wrap grid gap-8">
            <div className="grid gap-3"><p className="eyebrow text-naranja">Reels</p><h2 data-split className="h-section">La obra contada en video.</h2></div>
            <Reels reels={reels} />
          </div>
        </section>
      )}

      <section className="border-t border-linea bg-blanco">
        <Link to={`/proyectos/${next.slug}`} className="wrap group grid items-center gap-6 py-10 sm:grid-cols-[minmax(0,1fr)_220px]">
          <span className="grid gap-1">
            <span className="eyebrow text-tinta2">Siguiente proyecto</span>
            <span className="text-[clamp(36px,5vw,72px)] font-black leading-none transition-colors group-hover:text-naranja">{next.title}</span>
          </span>
          <span className="frame relative hidden aspect-[4/3] overflow-hidden bg-papel [--chaflan:14px] sm:block"><Img src={next.cover} alt="" sizes="220px" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" /></span>
        </Link>
      </section>

      <CtaBand title="¿Querés algo así para tu proyecto?" to={landing} cta="Contanos tu proyecto" />
      <KitSheet project={p} products={kit} materials={mats} numbered={numbered} />
      <Lightbox images={gallery} index={lb} onIndex={setLb} onClose={() => setLb(null)} title={p.title} />
    </div>
  )
}
