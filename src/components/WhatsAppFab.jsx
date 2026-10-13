import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { gsap, reduceMotion } from '../lib/gsap'
import { track } from '../lib/track'
import { waLink } from '../config'

// Mensaje precargado según la página, para que la consulta llegue con contexto.
const messages = {
  '/produccion-grafica': 'Hola gecko, quiero cotizar una impresión o corte.',
  '/arquigrafia': 'Hola gecko, quiero consultar por un proyecto de fachada o cartelería.',
  '/pop-retail': 'Hola gecko, quiero consultar por exhibidores o un stand.',
  '/para-arquitectos': 'Hola gecko, tengo un proyecto diseñado y necesito quién lo produzca.',
  '/para-comercios': 'Hola gecko, quiero renovar la imagen de mi local.',
  '/para-marcas': 'Hola gecko, necesito producir una activación / P.O.P.',
  '/tienda': 'Hola gecko, tengo una consulta sobre la tienda.',
}

// "Adhesión": el botón queda pegado en pantalla y se acerca al cursor cuando pasa cerca.
export default function WhatsAppFab() {
  const btn = useRef(null)
  const { pathname } = useLocation()
  const key = Object.keys(messages).find((k) => pathname.startsWith(k))
  const text = messages[key] || 'Hola gecko, quiero hacer una consulta.'

  useEffect(() => {
    const el = btn.current
    gsap.fromTo(el, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.8, delay: 1.2, ease: 'back.out(2)' })
    if (reduceMotion() || matchMedia('(pointer: coarse)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      const near = Math.hypot(dx, dy) < 160
      xTo(near ? dx * 0.35 : 0); yTo(near ? dy * 0.35 : 0)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <a ref={btn} href={waLink(text)} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" onClick={() => track('Contact', { method: 'whatsapp', page: pathname })}
      className="fixed bottom-[calc(20px+env(safe-area-inset-bottom,0px))] right-5 z-40 grid transition-[bottom] duration-500 in-[.has-buybar]:bottom-[calc(96px+env(safe-area-inset-bottom,0px))] lg:in-[.has-buybar]:bottom-[calc(20px+env(safe-area-inset-bottom,0px))] h-16 w-16 place-items-center rounded-full bg-naranja text-negro shadow-[0_12px_30px_-10px_rgba(26,26,26,.6)] ring-4 ring-white">
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" /></svg>
    </a>
  )
}
