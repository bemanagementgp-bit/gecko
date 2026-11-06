import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useCart } from '../lib/cart'
import { usePublic } from '../lib/content'
import { services } from '../data/services'
import { site, waLink } from '../config'
import { Logo, Foot } from './Brand'
import Img from './Img'

const nav = [
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/taller', label: 'Taller' },
]
// Obra que ilustra cada unidad en el menú de Servicios.
const unitCover = { 'produccion-grafica': 'grupo-tannat', arquigrafia: 'farmacia-garcia', 'pop-retail': 'amalaya' }

function CartButton({ dark }) {
  const { count, open } = useCart()
  const badge = useRef(null)
  useEffect(() => { if (count && badge.current) gsap.fromTo(badge.current, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }) }, [count])
  return (
    <Link to="/tienda/carrito" onClick={(e) => { e.preventDefault(); open() }} aria-label={`Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
      className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors ${dark ? 'text-blanco hover:bg-white/10' : 'hover:bg-papel'}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
      {count > 0 && <span ref={badge} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-naranja px-1 text-[12px] font-black text-negro">{count}</span>}
    </Link>
  )
}

export default function Header({ minimal = false }) {
  const root = useRef(null)
  const pill = useRef(null)
  const bar = useRef(null)
  const links = useRef(null)
  const indicator = useRef(null)
  const menu = useRef(null)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const [compact, setCompact] = useState(false)
  const { pathname } = useLocation()
  const { projects } = usePublic()
  const covers = Object.fromEntries(Object.entries(unitCover).map(([u, s]) => [u, projects.find((p) => p.slug === s)?.cover]))

  useEffect(() => { setOpen(false); setDrop(false) }, [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) { gsap.to(root.current, { yPercent: 0, duration: 0.2, overwrite: true }); window.__lenis?.stop() } else window.__lenis?.start()
    const k = (e) => e.key === 'Escape' && (setOpen(false), setDrop(false))
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  // Indicador que se desliza bajo el link activo o el que tiene el cursor.
  const moveIndicator = (el) => {
    const ind = indicator.current
    if (!ind) return
    if (!el) { gsap.to(ind, { opacity: 0, duration: 0.2 }); return }
    gsap.to(ind, { x: el.offsetLeft, width: el.offsetWidth, opacity: 1, duration: 0.35, ease: 'power3.out' })
  }
  const toActive = () => moveIndicator(links.current?.querySelector('[aria-current="page"], [data-active="true"]'))
  useLayoutEffect(() => { const t = setTimeout(toActive, 50); return () => clearTimeout(t) }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(() => {
    gsap.set(bar.current, { scaleX: 0, transformOrigin: '0 50%' })
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(bar.current, { scaleX: s.progress }) })
    ScrollTrigger.create({ start: 40, end: 'max', onToggle: (s) => setCompact(s.isActive) })
    // el menú de servicios se cierra apenas se scrollea
    const close = () => setDrop(false)
    window.addEventListener('wheel', close, { passive: true })
    window.addEventListener('touchmove', close, { passive: true })
    // se esconde al bajar y vuelve al subir
    ScrollTrigger.create({
      start: 500, end: 'max',
      onUpdate: (s) => {
        const hide = s.direction > 0
        if (hide) setDrop(false)
        gsap.to(root.current, { yPercent: hide ? -160 : 0, duration: 0.4, ease: 'power3.out', overwrite: true })
        document.documentElement.style.setProperty('--hdr', hide ? '0px' : 'var(--nav-space)')
      },
      onLeaveBack: () => { gsap.to(root.current, { yPercent: 0, duration: 0.3, overwrite: true }); document.documentElement.style.setProperty('--hdr', 'var(--nav-space)') },
    })
    return () => { window.removeEventListener('wheel', close); window.removeEventListener('touchmove', close) }
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true })

  useGSAP(() => {
    if (open && menu.current) {
      gsap.fromTo(menu.current, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: 0.7, ease: 'power3.inOut' })
      gsap.fromTo(menu.current.querySelectorAll('[data-m]'), { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.7, delay: 0.2, ease: 'power4.out' })
    }
  }, { dependencies: [open] })

  const serviceActive = services.some((s) => pathname.startsWith(s.path))
  const linkCls = 'relative z-10 rounded-full px-4 py-2 text-[18px] font-bold transition-colors'

  return (
    <>
      <header ref={root} className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+10px)] z-50">
        <div className="wrap">
          <div ref={pill} className={`pointer-events-auto relative flex items-center gap-3 rounded-full border border-negro/10 bg-white/85 pl-5 pr-2 shadow-[0_12px_40px_-18px_rgba(26,26,26,.45)] backdrop-blur-xl backdrop-saturate-150 transition-[height,box-shadow] duration-300 ${compact ? 'h-[58px] shadow-[0_16px_40px_-14px_rgba(26,26,26,.5)]' : 'h-[66px]'}`}>
            <Link to="/" aria-label="gecko, inicio" className="shrink-0"><Logo className={`w-auto text-negro transition-[height] duration-300 ${compact ? 'h-7' : 'h-8'}`} /></Link>

            {!minimal && (
              <nav ref={links} aria-label="Principal" onMouseLeave={() => { toActive(); }} className="relative ml-auto hidden items-center lg:flex">
                <span ref={indicator} aria-hidden="true" className="absolute left-0 top-1/2 h-10 -translate-y-1/2 rounded-full bg-papel opacity-0" />
                <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                  <button type="button" aria-expanded={drop} aria-controls="menu-servicios" data-active={serviceActive} onClick={() => setDrop((d) => !d)}
                    onMouseEnter={(e) => moveIndicator(e.currentTarget)} className={`${linkCls} flex items-center gap-1.5 ${serviceActive ? 'text-hondo' : ''}`}>
                    Servicios
                    <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${drop ? 'rotate-180' : ''}`} aria-hidden="true"><path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  <div id="menu-servicios" className={`absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-4 transition-all duration-300 ease-gecko ${drop ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                    <div className="grid grid-cols-3 gap-3 rounded-[28px] border border-negro/10 bg-blanco p-3 shadow-[0_30px_60px_-20px_rgba(26,26,26,.4)]">
                      {services.map((s) => (
                        <Link key={s.slug} to={s.path} className="group grid gap-3 rounded-[20px] p-2 transition-colors hover:bg-papel">
                          <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-papel">
                            {covers[s.slug] && <Img src={covers[s.slug]} alt="" sizes="240px" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gecko group-hover:scale-105" />}
                          </span>
                          <span className="grid gap-1 px-1 pb-1">
                            <b className="flex items-center gap-2 text-[20px] leading-tight">{s.name}<Foot className="h-4 w-4 rotate-90 text-naranja opacity-0 transition-opacity group-hover:opacity-100" /></b>
                            <span className="text-[15px] leading-snug text-tinta2">{s.short}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {nav.map((n) => (
                  <NavLink key={n.to} to={n.to} onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                    className={({ isActive }) => `${linkCls} ${isActive ? 'text-hondo' : ''}`}>{n.label}</NavLink>
                ))}
              </nav>
            )}

            <div className={`flex items-center gap-1.5 ${minimal ? 'ml-auto' : 'ml-auto lg:ml-4'}`}>
              {!minimal && <CartButton />}
              <Link to="/contacto" className="group hidden items-center gap-2 rounded-full bg-negro py-2.5 pl-5 pr-4 text-[17px] font-extrabold text-blanco transition-colors hover:bg-naranja hover:text-negro sm:flex">
                Hablemos <Foot className="h-4 w-4 rotate-90 text-naranja transition-colors group-hover:text-negro" />
              </Link>
              {!minimal && (
                <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                  className="grid h-11 w-11 place-items-center rounded-full bg-naranja text-negro lg:hidden">
                  <span className="relative block h-3 w-5">
                    <span className={`absolute left-0 h-[2.5px] w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                    <span className={`absolute left-0 h-[2.5px] w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
                  </span>
                </button>
              )}
            </div>
            <span className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] overflow-hidden rounded-full" aria-hidden="true">
              <span ref={bar} className="block h-full w-full bg-naranja" />
            </span>
          </div>
        </div>
      </header>

      {/* fuera del header: un ancestro con transform rompería el position: fixed */}
      {open && (
        <div id="menu-movil" ref={menu} className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-negro pt-[calc(var(--nav-space)+16px)] text-blanco lg:hidden" data-lenis-prevent>
          <nav aria-label="Menú móvil" className="wrap grid gap-1">
            {[{ to: '/', label: 'Inicio' }, ...services.map((s) => ({ to: s.path, label: s.name })), ...nav, { to: '/contacto', label: 'Contacto' }].map((n, i) => (
              <div key={n.to} className="overflow-hidden border-b border-white/10">
                <Link data-m to={n.to} className="flex items-baseline gap-3 py-3 text-[clamp(30px,8.5vw,48px)] font-black leading-none">
                  <span className="text-[14px] font-bold tabular-nums text-naranja">0{i + 1}</span>{n.label}
                </Link>
              </div>
            ))}
          </nav>
          <div className="wrap mt-auto grid gap-3 py-8">
            <a href={waLink('Hola gecko, quiero hacer una consulta.')} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full bg-naranja py-3.5 text-[19px] font-extrabold text-negro">Escribinos por WhatsApp</a>
            <p className="text-center text-[16px] text-humo">@{site.instagram} · {site.city}</p>
          </div>
        </div>
      )}
    </>
  )
}
