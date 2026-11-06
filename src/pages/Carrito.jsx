import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useCart } from '../lib/cart'
import { sendOrder } from '../lib/checkout'
import { money, site } from '../config'
import { Foot } from '../components/Brand'
import { Button } from '../components/ui'
import { PatternFill } from '../components/Patterns'
import Img from '../components/Img'
import QtyStepper from '../components/shop/QtyStepper'

const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" /></svg>
)

const pasos = [
  ['Mandás el pedido', 'Se abre WhatsApp con el detalle del carrito listo para enviar.'],
  ['Te confirmamos', 'Revisamos tu archivo y te pasamos el total con envío.'],
  ['Pagás y producimos', 'Coordinamos el pago y arrancamos en el taller.'],
]

export default function Carrito() {
  const cart = useCart()
  const root = useRef(null)
  const [c, setC] = useState({ nombre: '', entrega: 'Retiro en el taller', localidad: '', notas: '' })
  const [sent, setSent] = useState('')
  const set = (k) => (e) => setC((x) => ({ ...x, [k]: e.target.value }))
  const envio = c.entrega === 'Envío a domicilio'

  const { contextSafe } = useGSAP(() => {
    gsap.from('[data-row]', { x: -30, opacity: 0, stagger: 0.06, duration: 0.6 })
  }, { scope: root })
  const remove = contextSafe((key, el) => {
    gsap.to(el, { x: 60, opacity: 0, duration: 0.35, ease: 'power3.in' })
    setTimeout(() => cart.remove(key), 350)
  })

  const send = () => setSent(sendOrder({ items: cart.items, total: cart.total, cliente: c }))

  return (
    <div ref={root}>
      <title>Carrito · Tienda · gecko</title>
      <section className="bg-blanco pb-[clamp(56px,8vw,110px)] pt-[clamp(24px,4vw,56px)]">
        <div className="wrap grid gap-8">
          <nav aria-label="Ruta" className="text-[16px] font-bold text-tinta2"><Link to="/tienda" className="hover:text-hondo">← Seguir comprando</Link></nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[clamp(44px,6vw,84px)] font-black">Tu pedido</h1>
            {cart.items.length > 0 && <p className="text-[18px] font-bold text-tinta2">{cart.count} {cart.count === 1 ? 'producto' : 'productos'}</p>}
          </div>

          {cart.items.length === 0 ? (
            <div className="frame grid justify-items-start gap-4 bg-papel p-8">
              <div className="flex gap-2">{[0, 1, 2].map((i) => <Foot key={i} className="h-8 w-8 text-gris" style={{ rotate: `${60 + i * 20}deg` }} />)}</div>
              <p className="text-[26px] font-extrabold">Tu carrito está vacío.</p>
              <Button to="/tienda" tone="orange">Ir a la tienda</Button>
            </div>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="grid gap-8">
                <ul className="border-t-2 border-negro">
                  {cart.items.map((i, k) => (
                    <li key={i.key} data-row className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 border-b border-linea py-5 sm:grid-cols-[110px_minmax(0,1fr)_auto]">
                      <Link to={`/tienda/${i.slug}`} className="frame relative aspect-square overflow-hidden bg-papel [--chaflan:12px]">
                        {i.image ? <Img src={i.image} alt="" sizes="110px" className="absolute inset-0 h-full w-full object-cover" /> : <PatternFill variant={k} className="absolute inset-0" />}
                      </Link>
                      <div className="grid min-w-0 content-start gap-1">
                        <Link to={`/tienda/${i.slug}`} className="text-[22px] font-extrabold leading-tight hover:text-hondo">{i.name}</Link>
                        <span className="text-[16px] text-tinta2">{Object.values(i.options || {}).join(' · ')}</span>
                        {i.file && <span className="truncate text-[15px] font-bold">Archivo: {i.file}</span>}
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          <QtyStepper value={i.qty} onChange={(q) => cart.setQty(i.key, q)} size="sm" label={`Cantidad de ${i.name}`} />
                          <button type="button" onClick={(e) => remove(i.key, e.currentTarget.closest('li'))} className="text-[16px] font-bold text-tinta2 underline underline-offset-4 hover:text-hondo">Quitar</button>
                        </div>
                      </div>
                      <span className="col-start-2 text-[22px] font-black tabular-nums sm:col-start-auto">{money(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <ol className="grid gap-4 sm:grid-cols-3">
                  {pasos.map(([t, d], i) => (
                    <li key={t} className="grid content-start gap-1.5 border-t-2 border-negro pt-3">
                      <span className="text-[15px] font-black text-hondo">0{i + 1}</span>
                      <b className="text-[21px] leading-tight">{t}</b>
                      <span className="text-[16px] text-tinta2">{d}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="frame grid gap-5 bg-negro p-6 text-blanco [--chaflan:18px] lg:sticky lg:top-[calc(var(--nav-space)+16px)]">
                <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                  <span className="text-[19px] font-bold">Subtotal</span>
                  <span className="text-[38px] font-black tabular-nums text-naranja">{money(cart.total)}</span>
                </div>
                <p className="text-[16px] text-humo">El total final, con envío si corresponde, te lo confirmamos por WhatsApp.</p>
                <fieldset className="grid gap-2 sm:grid-cols-2">
                  <legend className="mb-2 text-[14px] font-extrabold uppercase tracking-wider text-humo">Entrega</legend>
                  {['Retiro en el taller', 'Envío a domicilio'].map((o) => (
                    <label key={o} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] p-3 text-[17px] font-bold transition-colors ${c.entrega === o ? 'border-naranja bg-white/5' : 'border-white/20 hover:border-white/50'}`}>
                      <input type="radio" name="entrega" value={o} checked={c.entrega === o} onChange={set('entrega')} className="h-4 w-4 accent-[#F15A24]" />{o}
                    </label>
                  ))}
                </fieldset>
                {envio && <input id="c-loc" value={c.localidad} onChange={set('localidad')} autoComplete="address-level2" placeholder="Localidad y código postal" className="field text-negro" />}
                <input id="c-nombre" value={c.nombre} onChange={set('nombre')} autoComplete="name" placeholder="Tu nombre (opcional)" className="field text-negro" />
                <textarea id="c-notas" rows={2} value={c.notas} onChange={set('notas')} placeholder="Algo más que tengamos que saber (opcional)" className="field resize-y text-negro" />
                <button type="button" onClick={send} className="flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-[20px] font-extrabold text-negro transition-transform hover:scale-[1.02]">
                  <WaIcon />Enviar pedido por WhatsApp
                </button>
                {sent && (
                  <p role="status" className="text-[16px] text-humo">
                    Abrimos WhatsApp con tu pedido. ¿No se abrió? <a href={sent} target="_blank" rel="noopener" className="font-bold text-naranja underline underline-offset-4">Tocá acá</a>.
                  </p>
                )}
                <p className="flex items-center gap-2 text-[15px] text-humo"><Foot className="h-4 w-4 shrink-0 text-naranja" />Retiro sin cargo en el taller · {site.city}</p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
