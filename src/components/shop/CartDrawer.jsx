import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { gsap, useGSAP, reduceMotion } from '../../lib/gsap'
import { useCart } from '../../lib/cart'
import { money } from '../../config'
import { Foot } from '../Brand'
import { Button } from '../ui'
import { PatternFill } from '../Patterns'
import Img from '../Img'
import QtyStepper from './QtyStepper'
import { sendOrder } from '../../lib/checkout'

// Carrito lateral: se abre al agregar un producto, sin sacar a la persona de la página.
export default function CartDrawer() {
  const cart = useCart()
  const panel = useRef(null)
  const overlay = useRef(null)
  const wrap = useRef(null)
  const closeBtn = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => { cart.close() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(() => {
    const d = reduceMotion() ? 0 : 1
    if (cart.isOpen) {
      window.__lenis?.stop()
      gsap.set(wrap.current, { visibility: 'visible' })
      gsap.to(overlay.current, { opacity: 1, duration: 0.3 * d })
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.55 * d, ease: 'power4.out' })
      gsap.from(panel.current.querySelectorAll('[data-line]'), { x: 40, opacity: 0, stagger: 0.05, duration: 0.5 * d, delay: 0.15 * d })
      closeBtn.current?.focus()
    } else {
      window.__lenis?.start()
      gsap.to(overlay.current, { opacity: 0, duration: 0.25 * d })
      gsap.to(panel.current, { xPercent: 100, duration: 0.4 * d, ease: 'power3.in' })
      // se oculta por tiempo, no por el final de la animación: nunca queda tapando la página
      const t = setTimeout(() => { if (wrap.current) wrap.current.style.visibility = 'hidden' }, 420 * d)
      return () => clearTimeout(t)
    }
  }, { dependencies: [cart.isOpen] })

  useEffect(() => {
    if (!cart.isOpen) return
    const onKey = (e) => e.key === 'Escape' && cart.close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cart.isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} className={`invisible fixed inset-0 z-[80] ${cart.isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cart.isOpen}>
      <div ref={overlay} onClick={cart.close} className="absolute inset-0 bg-negro/60 opacity-0 backdrop-blur-[2px]" />
      <aside ref={panel} role="dialog" aria-modal="true" aria-label="Carrito" className="absolute inset-y-0 right-0 flex w-full max-w-[460px] translate-x-full flex-col bg-blanco shadow-2xl">
        <div className="flex items-center justify-between border-b border-linea px-6 py-4">
          <p className="text-[28px] font-black">Tu carrito <span className="text-naranja">{cart.count}</span></p>
          <button ref={closeBtn} type="button" onClick={cart.close} aria-label="Cerrar carrito" className="grid h-11 w-11 place-items-center rounded-full text-[26px] hover:bg-papel">×</button>
        </div>

        {cart.items.length === 0 ? (
          <div className="grid flex-1 content-center justify-items-center gap-4 p-8 text-center">
            <div className="flex gap-2">{[0, 1, 2].map((i) => <Foot key={i} className="h-8 w-8 text-gris" style={{ rotate: `${70 + i * 20}deg` }} />)}</div>
            <p className="text-[24px] font-extrabold">Todavía no agregaste nada.</p>
            <Button to="/tienda" tone="orange" onClick={cart.close}>Ver la tienda</Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
              {cart.items.map((i) => (
                <li key={i.key} data-line className={`grid grid-cols-[76px_minmax(0,1fr)] gap-4 border-b border-linea py-4 ${cart.lastAdded === i.key ? 'bg-[linear-gradient(90deg,#FFF0E9,transparent)]' : ''}`}>
                  <Link to={`/tienda/${i.slug}`} onClick={cart.close} className="frame relative aspect-square overflow-hidden [--chaflan:10px]">{i.image ? <Img src={i.image} alt="" sizes="76px" className="absolute inset-0 h-full w-full object-cover" /> : <PatternFill variant={i.variant ?? 0} className="absolute inset-0" />}</Link>
                  <div className="grid gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/tienda/${i.slug}`} onClick={cart.close} className="text-[20px] font-extrabold leading-tight hover:text-hondo">{i.name}</Link>
                      <span className="text-[19px] font-black tabular-nums">{money(i.price * i.qty)}</span>
                    </div>
                    <span className="text-[15px] text-tinta2">{Object.values(i.options).join(' · ')}</span>
                    {i.file && <span className="truncate text-[14px] font-bold">Archivo: {i.file}</span>}
                    <div className="mt-1 flex items-center justify-between">
                      <QtyStepper size="sm" value={i.qty} onChange={(q) => cart.setQty(i.key, q)} label={`Cantidad de ${i.name}`} />
                      <button type="button" onClick={() => cart.remove(i.key)} className="text-[15px] font-bold text-tinta2 underline underline-offset-4 hover:text-hondo">Quitar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="grid gap-3 border-t-2 border-negro px-6 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[19px] font-bold">Subtotal</span>
                <span className="text-[30px] font-black tabular-nums">{money(cart.total)}</span>
              </div>
              <p className="text-[15px] text-tinta2">Mandanos el pedido por WhatsApp: te confirmamos el total, el envío y cómo pagar.</p>
              <button type="button" onClick={() => sendOrder({ items: cart.items, total: cart.total })}
                className="flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-[19px] font-extrabold text-negro transition-transform hover:scale-[1.02]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" /></svg>
                Enviar pedido por WhatsApp
              </button>
              <div className="flex items-center justify-between text-[16px] font-bold">
                <Link to="/tienda/carrito" onClick={cart.close} className="underline underline-offset-4 hover:text-hondo">Agregar datos de entrega</Link>
                <button type="button" onClick={cart.close} className="underline underline-offset-4 hover:text-hondo">Seguir comprando</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
