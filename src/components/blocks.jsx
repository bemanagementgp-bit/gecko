import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { serviceBySlug } from '../data/services'
import { Foot } from './Brand'
import { Button, Photo, Placeholder } from './ui'
import { Waves } from './Patterns'
import { imgSrc } from '../lib/media'

// Tarjeta de proyecto: el frame se abre, la foto se acerca y sube el nombre del caso.
export function ProjectCard({ p, i = 0, size = 'md' }) {
  return (
    <Link to={`/proyectos/${p.slug}`} className="group grid gap-3 focus-visible:outline-none">
      <div className="frame relative overflow-hidden bg-negro [--chaflan:18px] transition-[clip-path] duration-500 ease-gecko group-hover:[--chaflan:44px] group-focus-visible:[--chaflan:44px]">
        <Photo src={p.cover} alt={p.title} variant={i} frame={false} ratio={size === 'lg' ? 'aspect-[16/10]' : 'aspect-[4/3]'}
          className="transition-transform duration-700 ease-gecko group-hover:scale-[1.06]" />
        <Placeholder show={p.placeholder} />
        <span className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-naranja text-negro opacity-0 transition-all duration-500 ease-gecko group-hover:translate-y-0 group-hover:opacity-100">
          <Foot className="h-5 w-5 rotate-90" />
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[clamp(24px,2.2vw,30px)] transition-colors group-hover:text-hondo">{p.title}</h3>
        <span className="text-[16px] font-bold text-tinta2">{serviceBySlug[p.unit]?.name} · {p.rubro}{p.year ? ` · ${p.year}` : ''}</span>
      </div>
    </Link>
  )
}

// Proceso en pasos. Una huella camina por la línea a medida que se scrollea.
export function ProcessSteps({ steps, dark = false }) {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } })
      tl.fromTo('[data-fill]', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo('[data-walker]', { left: '0%' }, { left: '100%', ease: 'none' }, 0)
      gsap.utils.toArray('[data-dot]', root.current).forEach((d, i, all) => {
        tl.fromTo(d, { scale: 0.75, backgroundColor: dark ? '#262626' : '#D9D9D9' }, { scale: 1, backgroundColor: '#F15A24', duration: 0.06 }, i / (all.length - 1) - 0.03)
      })
    })
  }, { scope: root })
  return (
    <div ref={root} className="relative">
      <div aria-hidden="true" className={`absolute left-[22px] top-[21px] hidden h-[3px] lg:block ${dark ? 'bg-carbon' : 'bg-linea'}`} style={{ right: `calc(100% / ${steps.length} - 22px)` }}>
        <div data-fill className="h-full origin-left bg-naranja" />
        <Foot data-walker className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rotate-[135deg] text-naranja" />
      </div>
      <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ '--n': steps.length }}>
        {steps.map(([b, s], i) => (
          <li key={b} className="grid content-start gap-2 pr-4">
            <span data-dot className="grid h-11 w-11 place-items-center rounded-full bg-naranja text-[20px] font-black text-negro">{i + 1}</span>
            <b className="text-[24px] leading-[1.05]">{b}</b>
            <span className={`text-[18px] ${dark ? 'text-humo' : 'text-tinta2'}`}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Antes / después arrastrable. Sin fotos todavía usa dos patterns de la marca.
export function BeforeAfter({ before, after, label = 'Comparar antes y después', placeholder }) {
  const [pos, setPos] = useState(50)
  return (
    <div className="frame relative aspect-[16/10] select-none overflow-hidden bg-papel">
      {before ? <img src={imgSrc(before)} alt="Antes" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#C9C4BF_0_22px,#B3ADA7_22px_24px)] grayscale" />}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {after ? <img src={imgSrc(after)} alt="Después" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_70%_120%,var(--color-naranja)_0_10px,#fff_10px_20px)]" />}
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-negro" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-negro bg-naranja text-[18px] font-black">↔</span>
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 bg-negro px-2 text-[13px] font-extrabold uppercase tracking-widest text-blanco">Antes</span>
      <span className="pointer-events-none absolute bottom-3 right-3 bg-naranja px-2 text-[13px] font-extrabold uppercase tracking-widest">Después</span>
      <Placeholder show={placeholder} />
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label={label} className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  )
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0)
  const root = useRef(null)
  const { contextSafe } = useGSAP(() => {
    gsap.set(root.current.querySelectorAll('[data-a]'), { height: (i) => (i === 0 ? 'auto' : 0) })
  }, { scope: root })
  const toggle = contextSafe((i) => {
    const panels = root.current.querySelectorAll('[data-a]')
    const next = open === i ? -1 : i
    panels.forEach((p, k) => gsap.to(p, { height: k === next ? 'auto' : 0, duration: 0.5, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() }))
    setOpen(next)
  })
  return (
    <div ref={root} className="border-t-2 border-negro">
      {items.map(([q, a], i) => (
        <div key={q} className="border-b border-linea">
          <button type="button" aria-expanded={open === i} onClick={() => toggle(i)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
            <span className="text-[clamp(21px,2vw,26px)] font-extrabold leading-tight">{q}</span>
            <Foot className={`h-6 w-6 shrink-0 text-naranja transition-transform duration-500 ease-gecko ${open === i ? 'rotate-[225deg]' : 'rotate-45'}`} />
          </button>
          <div data-a className="overflow-hidden"><p className="max-w-[62ch] pb-5 text-[19px] text-tinta2">{a}</p></div>
        </div>
      ))}
    </div>
  )
}

// Banda de cierre con Pattern I y un llamado a la acción.
export function CtaBand({ title, text, cta = 'Hablemos de tu proyecto', to = '/contacto' }) {
  return (
    <section className="relative overflow-hidden bg-negro text-blanco">
      <Waves color="rgba(241,90,36,.55)" count={22} />
      <div className="wrap relative grid gap-6 py-[clamp(72px,10vw,140px)]">
        <h2 data-split className="max-w-[16ch] text-[clamp(44px,7vw,100px)] font-black">{title}</h2>
        {text && <p data-reveal className="max-w-[48ch] text-[clamp(19px,1.7vw,23px)] text-humo">{text}</p>}
        <div data-reveal><Button to={to} tone="orange" size="lg">{cta}</Button></div>
      </div>
    </section>
  )
}

// Cinta infinita; el scroll la acelera y la invierte.
export function Marquee({ words, tone = 'dark' }) {
  const root = useRef(null)
  const track = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const loop = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 })
      ScrollTrigger.create({
        onUpdate: (self) => {
          const dir = self.direction || 1
          gsap.to(loop, { timeScale: gsap.utils.clamp(-6, 6, dir * (1 + Math.abs(self.getVelocity() / 300))), duration: 0.3, overwrite: true })
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3 })
        },
      })
    })
  }, { scope: root })
  const row = words.flatMap((w, i) => [
    <span key={`w${i}`} className="whitespace-nowrap">{w}</span>,
    <Foot key={`f${i}`} className="h-[0.7em] w-[0.7em] shrink-0 rotate-90 text-naranja" />,
  ])
  const cls = tone === 'dark' ? 'bg-negro text-blanco' : 'bg-naranja text-negro'
  return (
    <div ref={root} aria-hidden="true" className={`overflow-hidden py-5 ${cls}`}>
      <div ref={track} className="flex w-max items-center gap-8 pr-8 text-[clamp(34px,5vw,64px)] font-black leading-none">{row}{row}</div>
    </div>
  )
}

export function Stat({ n, prefix = '', suffix = '', label }) {
  return (
    <div className="grid gap-1">
      <span className="text-[clamp(52px,6vw,84px)] font-black leading-none text-naranja tabular-nums">
        <span data-count={n} data-prefix={prefix}>{prefix}{n}</span>{suffix}
      </span>
      <span className="text-[18px] font-bold">{label}</span>
    </div>
  )
}
