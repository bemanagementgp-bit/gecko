import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reduceMotion } from '../lib/gsap'
import { track } from '../lib/track'
import { C, trailURI } from '../lib/canvas'
import { Iso } from '../components/Brand'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFab from '../components/WhatsAppFab'
import CartDrawer from '../components/shop/CartDrawer'

// Scroll suave compartido por todo el sitio.
function useLenis() {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--trail-h', trailURI(C.naranja, false))
    root.style.setProperty('--trail-v', trailURI(C.naranja, true))
    if (reduceMotion()) return
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => { gsap.ticker.remove(tick); lenis.destroy(); delete window.__lenis }
  }, [])
}

// Al cambiar de página: vuelve arriba, una cortina naranja con el isotipo se retira y se mide la visita.
function useRouteChange(curtain) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { setTimeout(() => (window.__lenis ? window.__lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView()), 50); return }
    }
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    track('PageView', { page: pathname })
    if (!reduceMotion() && curtain.current) {
      gsap.timeline()
        .set(curtain.current, { yPercent: 0, display: 'grid' })
        .fromTo(curtain.current.firstChild, { scale: 0.6, rotate: -30, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' })
        .to(curtain.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.05')
        .set(curtain.current, { display: 'none' })
    }
  }, [pathname, hash, curtain])
}

export default function Shell({ minimal = false }) {
  const curtain = useRef(null)
  useLenis()
  useRouteChange(curtain)
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-blanco focus:p-3">Saltar al contenido</a>
      <Header minimal={minimal} />
      <main id="contenido"><Suspense fallback={<div className="min-h-[70vh]" />}><Outlet /></Suspense></main>
      <Footer minimal={minimal} />
      <WhatsAppFab />
      <CartDrawer />
      <div ref={curtain} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden place-items-center bg-naranja text-blanco">
        <Iso className="h-20 w-20" />
      </div>
    </>
  )
}
