import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap, SplitText, useGSAP, reduceMotion } from '../lib/gsap'
import { videoSrc, posterSrc } from '../lib/media'
import { money } from '../config'
import { priceFor, isQuote } from '../lib/catalog'
import { Foot } from './Brand'
import Img from './Img'

// Fondo de video en loop, oscurecido para que el texto se lea.
function VideoBg({ src }) {
  const ref = useRef(null)
  useEffect(() => { if (reduceMotion()) ref.current?.pause() }, [])
  return (
    <div data-media className="absolute inset-0">
      <video ref={ref} src={videoSrc(src)} poster={posterSrc(src)} autoPlay muted loop playsInline className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,.94)_0%,rgba(26,26,26,.78)_45%,rgba(26,26,26,.35)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_110%,rgba(241,90,36,.45),transparent_55%)]" />
    </div>
  )
}

// Mosaico de obras: tres columnas inclinadas que corren a distinta velocidad.
function Mosaic({ images }) {
  const root = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    gsap.utils.toArray('[data-col]', root.current).forEach((col, i) => {
      const dir = i % 2 ? 1 : -1
      gsap.fromTo(col, { yPercent: dir > 0 ? -50 : 0 }, { yPercent: dir > 0 ? 0 : -50, duration: 38 + i * 8, ease: 'none', repeat: -1 })
    })
  }, { scope: root })
  const cols = [0, 1, 2].map((c) => images.filter((_, i) => i % 3 === c))
  return (
    <div ref={root} data-media className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-[8%] -top-[20%] grid h-[140%] w-[72%] rotate-[8deg] grid-cols-3 gap-4 max-lg:w-[140%] max-lg:opacity-80">
        {cols.map((list, c) => (
          <div key={c} className="overflow-hidden">
            <div data-col className="grid gap-4">
              {[...list, ...list].map((src, i) => (
                <div key={i} className="frame relative aspect-[3/4] overflow-hidden bg-carbon [--chaflan:14px]">
                  <Img src={src} alt="" sizes="20vw" eager className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#1A1A1A_0%,#1A1A1A_32%,rgba(26,26,26,.6)_55%,rgba(26,26,26,.1)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(26,26,26,.55)_0%,rgba(26,26,26,.88)_45%,#1A1A1A_80%)]" />
    </div>
  )
}

// Abanico de productos que flota y sigue al cursor.
const slots = [
  { l: '57%', t: '13%', r: -7, z: 2, w: 'w-[19%]' },
  { l: '76%', t: '6%', r: 6, z: 1, w: 'w-[17%]' },
  { l: '64%', t: '47%', r: 4, z: 3, w: 'w-[18%]' },
  { l: '82%', t: '43%', r: -5, z: 2, w: 'w-[14%]' },
]
function ProductStack({ products }) {
  const root = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    const cards = gsap.utils.toArray('[data-card]', root.current)
    cards.forEach((c, i) => gsap.to(c, { y: i % 2 ? 14 : -14, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }))
    const movers = cards.map((c, i) => ({ x: gsap.quickTo(c, 'x', { duration: 0.8, ease: 'power3' }), k: (i + 1) * 9 }))
    const move = (e) => {
      const r = root.current.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5
      movers.forEach((m) => m.x(dx * m.k * 2))
    }
    root.current.parentElement.addEventListener('pointermove', move)
    return () => root.current?.parentElement?.removeEventListener('pointermove', move)
  }, { scope: root })
  return (
    <div ref={root} data-media className="absolute inset-0 max-lg:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(241,90,36,.35),transparent_45%)]" />
      {products.slice(0, 4).map((p, i) => {
        const s = slots[i]
        return (
          <div key={p.slug} className={`absolute ${s.w}`} style={{ left: s.l, top: s.t, zIndex: s.z }}>
            <Link data-card to={`/tienda/${p.slug}`} style={{ rotate: `${s.r}deg` }}
              className="frame group relative block aspect-[4/5] overflow-hidden bg-carbon shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] [--chaflan:18px]">
              <Img src={p.images?.[0]} alt={p.name} sizes="25vw" eager className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gecko group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(26,26,26,.9))] p-3 pt-10">
                <b className="block text-[18px] leading-tight text-blanco">{p.name}</b>
                <span className="text-[14px] font-bold text-naranja">{isQuote(p) ? 'A medida' : `Desde ${money(priceFor(p))}`}</span>
              </span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

// Hero de las páginas internas: título grande, medio en movimiento y cifras.
export default function PageHero({ eyebrow, title, lead, media, stats = [], children, crumbs }) {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.7 })
      tl.from('[data-media]', { scale: 1.12, opacity: 0, duration: 1.6, ease: 'power3.out' }, 0)
      SplitText.create(root.current.querySelector('[data-hero-title]'), {
        type: 'words,chars', mask: 'words', autoSplit: true,
        onSplit: (self) => tl.from(self.chars, { yPercent: 115, stagger: 0.018, duration: 0.9, ease: 'power4.out' }, 0.2),
      })
      tl.from('[data-hero-fade]', { y: 26, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.6)
      tl.from('[data-stat]', { y: 30, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.9)
      root.current.querySelectorAll('[data-num]').forEach((el) => {
        const end = parseFloat(el.dataset.num), o = { n: 0 }
        tl.to(o, { n: end, duration: 1.4, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.n) } }, 1)
      })
      gsap.to('[data-media]', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-copy]', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    })
  }, { scope: root })

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-negro text-blanco">
      {media?.type === 'video' && <VideoBg src={media.src} />}
      {media?.type === 'mosaic' && <Mosaic images={media.images} />}
      {media?.type === 'stack' && <ProductStack products={media.products} />}
      <div className="wrap relative grid lg:min-h-[clamp(620px,82vh,820px)] content-between gap-10 pb-8 pt-[clamp(48px,7vw,96px)]">
        <div data-hero-copy className="grid max-w-[760px] content-start gap-6">
          {crumbs && <nav data-hero-fade aria-label="Ruta" className="text-[16px] font-bold text-humo">{crumbs}</nav>}
          <p data-hero-fade className="eyebrow flex items-center gap-2 text-naranja"><Foot className="h-4 w-4 rotate-90" />{eyebrow}</p>
          <h1 data-hero-title className="text-[clamp(52px,8.4vw,124px)] font-black leading-[.9] tracking-[-.02em]">{title}</h1>
          {lead && <p data-hero-fade className="max-w-[46ch] text-[clamp(19px,1.8vw,24px)] font-semibold leading-snug text-[#E8E4E0]">{lead}</p>}
          {children && <div data-hero-fade className="flex flex-wrap gap-2.5">{children}</div>}
          {media?.type === 'stack' && (
            <div data-hero-fade className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 lg:hidden" data-lenis-prevent>
              {media.products.slice(0, 6).map((p) => (
                <Link key={p.slug} to={`/tienda/${p.slug}`} className="frame relative aspect-[4/5] w-[44vw] max-w-[220px] shrink-0 snap-start overflow-hidden bg-carbon [--chaflan:14px]">
                  <Img src={p.images?.[0]} alt={p.name} sizes="44vw" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(26,26,26,.9))] p-2.5 pt-8">
                    <b className="block text-[16px] leading-tight">{p.name}</b>
                    <span className="text-[13px] font-bold text-naranja">{isQuote(p) ? 'A medida' : `Desde ${money(priceFor(p))}`}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {stats.length > 0 && (
          <dl className="grid max-w-[760px] grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            {stats.map(([n, label, suffix = '']) => (
              <div key={label} data-stat className="grid gap-0.5">
                <dd className="m-0 text-[clamp(34px,3.6vw,52px)] font-black leading-none text-naranja tabular-nums">
                  {typeof n === 'number' ? <><span data-num={n}>{n}</span>{suffix}</> : n}
                </dd>
                <dt className="text-[15px] font-bold uppercase tracking-wider text-humo">{label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

// Chip de acción del hero (filtros, atajos).
export function HeroChip({ to, onClick, children, solid }) {
  const cls = `rounded-full border-[1.5px] px-4 pb-2 pt-1 text-[17px] font-extrabold transition-colors ${solid ? 'border-naranja bg-naranja text-negro hover:bg-[#ff6a33]' : 'border-white/30 hover:border-naranja hover:text-naranja'}`
  return to ? <Link to={to} className={cls}>{children}</Link> : <button type="button" onClick={onClick} className={cls}>{children}</button>
}
