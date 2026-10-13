import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useCart } from '../lib/cart'
import { services } from '../data/services'
import { Logo, Foot } from './Brand'
import { Button } from './ui'

const nav = [
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/taller', label: 'Taller' },
  { to: '/tienda', label: 'Tienda' },
]

export default function Header({ minimal = false }) {
  const root = useRef(null)
  const bar = useRef(null)
  const menu = useRef(null)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const { count, open: openCart } = useCart()
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false); setDrop(false) }, [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) { gsap.to(root.current, { yPercent: 0, duration: 0.2, overwrite: true }); window.__lenis?.stop() } else window.__lenis?.start()
  }, [open])

  useGSAP(() => {
    gsap.set(bar.current, { scaleX: 0, transformOrigin: '0 50%' })
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(bar.current, { scaleX: s.progress }) })
    // se esconde al bajar y vuelve al subir: queda "pegado" sin tapar contenido
    ScrollTrigger.create({
      start: 120, end: 'max',
      onUpdate: (s) => {
        gsap.to(root.current, { yPercent: s.direction > 0 ? -100 : 0, duration: 0.35, ease: 'power2.out', overwrite: true })
        // --hdr: cuánto ocupa el header visible; lo usan las barras sticky de la página
        document.documentElement.style.setProperty('--hdr', s.direction > 0 ? '0px' : '68px')
      },
      onLeaveBack: () => { gsap.to(root.current, { yPercent: 0, duration: 0.3, overwrite: true }); document.documentElement.style.setProperty('--hdr', '68px') },
    })
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true })

  useGSAP(() => {
    if (!menu.current) return
    if (open) gsap.fromTo(menu.current.querySelectorAll('[data-m]'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power4.out' })
  }, { dependencies: [open] })

  const link = ({ isActive }) => `relative text-[19px] font-bold transition-colors hover:text-naranja ${isActive ? 'text-naranja' : ''}`

  return (
    <>
    <header ref={root} className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-linea bg-white/92 backdrop-blur-md">
      <div className="wrap flex h-[68px] items-center gap-6">
        <Link to="/" aria-label="gecko, inicio" className="shrink-0"><Logo className="h-8 w-auto text-negro" /></Link>

        {!minimal && (
          <>
            <nav aria-label="Principal" className="ml-auto hidden items-center gap-7 lg:flex">
              <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                <button type="button" aria-expanded={drop} onClick={() => setDrop((d) => !d)} className="flex items-center gap-1.5 text-[19px] font-bold hover:text-naranja">
                  Servicios <span className={`inline-block transition-transform ${drop ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div className={`absolute left-1/2 top-full w-[380px] -translate-x-1/2 pt-3 transition-all duration-200 ${drop ? 'visible opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
                  <div className="frame grid gap-1 bg-negro p-3 text-blanco [--chaflan:16px]">
                    {services.map((s) => (
                      <Link key={s.slug} to={s.path} className="group grid grid-cols-[22px_1fr] gap-2.5 rounded p-2.5 hover:bg-carbon">
                        <Foot className="mt-1 h-5 w-5 text-naranja transition-transform group-hover:rotate-45" />
                        <span><b className="block text-[20px] leading-tight">{s.name}</b><span className="text-[15px] text-humo">{s.short}</span></span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {nav.map((n) => <NavLink key={n.to} to={n.to} className={link}>{n.label}</NavLink>)}
            </nav>
            <div className="ml-auto flex items-center gap-3 lg:ml-0">
              <Link to="/tienda/carrito" onClick={(e) => { e.preventDefault(); openCart() }} aria-label={`Carrito, ${count} ${count === 1 ? "producto" : "productos"}`} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-papel">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
                {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-naranja px-1 text-[13px] font-black text-negro">{count}</span>}
              </Link>
              <span className="hidden sm:block"><Button to="/contacto" size="sm">Contacto</Button></span>
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                className="grid h-11 w-11 place-items-center rounded-full bg-negro text-blanco lg:hidden">
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-[2.5px] w-5 bg-current transition-all ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 h-[2.5px] w-5 bg-current transition-all ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
      <div ref={bar} className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-naranja" />
    </header>

      {/* fuera del header: un ancestro con transform rompería el position: fixed */}
      {open && (
        <div id="menu-movil" ref={menu} className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-naranja lg:hidden">
          <nav aria-label="Menú móvil" className="wrap grid gap-1 py-8">
            {[{ to: '/', label: 'Inicio' }, ...services.map((s) => ({ to: s.path, label: s.name })), ...nav, { to: '/contacto', label: 'Contacto' }].map((n) => (
              <div key={n.to} className="overflow-hidden">
                <Link data-m to={n.to} className="block py-1 text-[clamp(36px,10vw,56px)] font-black leading-tight text-negro">{n.label}</Link>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
