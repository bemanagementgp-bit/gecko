import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useCart } from '../lib/cart'
import { startCheckout, checkoutMode } from '../lib/checkout'
import { money, site } from '../config'
import { Foot } from '../components/Brand'
import { Button } from '../components/ui'
import { PatternFill, Truchet } from '../components/Patterns'
import QtyStepper from '../components/shop/QtyStepper'

const pasos = ['Tus datos', 'Entrega', 'Confirmar']

function Field({ label, children, className = '' }) {
  return <label className={`grid gap-1.5 ${className}`}><span className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">{label}</span>{children}</label>
}

export default function Carrito() {
  const cart = useCart()
  const root = useRef(null)
  const panel = useRef(null)
  const feet = useRef(null)
  const [step, setStep] = useState(0)
  const [c, setC] = useState({ nombre: '', email: '', telefono: '', entrega: 'Retiro en el taller', direccion: '', localidad: '', cp: '', factura: false, cuit: '', notas: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const set = (k) => (e) => setC((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const envio = c.entrega === 'Envío a domicilio'

  const valid = [
    c.nombre.trim().length > 1 && /\S+@\S+\.\S+/.test(c.email) && c.telefono.replace(/\D/g, '').length >= 8,
    !envio || (c.direccion.trim().length > 4 && c.localidad.trim().length > 1 && /^\w{4,8}$/.test(c.cp.trim())),
    !c.factura || c.cuit.replace(/\D/g, '').length === 11,
  ]

  const { contextSafe } = useGSAP(() => {
    gsap.from('[data-row]', { x: -30, opacity: 0, stagger: 0.06, duration: 0.6 })
  }, { scope: root })

  const go = contextSafe((to) => {
    if (to > step && !valid[step]) return
    setStep(to)
    gsap.fromTo(panel.current, { x: to > step ? 40 : -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
    if (to > step) gsap.fromTo(feet.current.children[step], { scale: 1.8, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(3)' })
  })

  const pay = async () => {
    setStatus('sending'); setError('')
    try {
      await startCheckout({ items: cart.items, total: cart.total, cliente: c })
      setStatus('done')
    } catch (err) {
      setError(err.message); setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <section className="relative grid min-h-[72vh] place-items-center overflow-hidden bg-naranja">
        <title>Pedido enviado · gecko</title>
        <Truchet combo="naranja" spin size={30} />
        <div className="frame relative m-6 grid max-w-[540px] gap-3 bg-blanco p-8">
          <Foot className="h-12 w-12 text-naranja" />
          <h1 className="text-[44px] font-black">¡Pedido enviado!</h1>
          <p className="text-[19px] text-tinta2">Te escribimos a {c.email} para confirmar el pedido{cart.items.some((i) => i.file) ? ', revisar tus archivos' : ''} y coordinar la entrega.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button to="/tienda" tone="dark" onClick={cart.clear}>Volver a la tienda</Button>
          </div>
        </div>
      </section>
    )
  }

  const inputCls = 'field'

  return (
    <div ref={root}>
      <title>Carrito · Tienda · gecko</title>
      <section className="bg-blanco py-[clamp(32px,5vw,72px)]">
        <div className="wrap grid gap-8">
          <nav aria-label="Ruta" className="text-[16px] font-bold text-tinta2"><Link to="/tienda" className="hover:text-naranja">← Seguir comprando</Link></nav>
          <h1 className="text-[clamp(48px,6vw,88px)] font-black">Finalizar compra</h1>

          {cart.items.length === 0 ? (
            <div className="frame grid justify-items-start gap-4 bg-papel p-8">
              <div className="flex gap-2">{[0, 1, 2].map((i) => <Foot key={i} className="h-8 w-8 text-gris" style={{ rotate: `${60 + i * 20}deg` }} />)}</div>
              <p className="text-[26px] font-extrabold">Tu carrito está vacío.</p>
              <Button to="/tienda" tone="orange">Ir a la tienda</Button>
            </div>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              {/* checkout en 3 pasos */}
              <div className="frame grid gap-6 bg-papel p-[clamp(20px,3vw,36px)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <ol ref={feet} className="flex items-center gap-2" aria-label="Pasos">
                    {pasos.map((s, i) => (
                      <li key={s}>
                        <button type="button" onClick={() => i < step && go(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}
                          className={`flex items-center gap-1.5 text-[17px] font-extrabold ${i === step ? 'text-negro' : i < step ? 'text-hondo hover:underline' : 'text-tinta2/60'}`}>
                          <Foot className={`h-6 w-6 ${i < step ? 'text-naranja' : i === step ? 'text-negro' : 'text-gris'}`} />{s}
                        </button>
                      </li>
                    ))}
                  </ol>
                  <span className="text-[16px] font-bold text-tinta2">Paso {step + 1} de 3</span>
                </div>

                <div ref={panel} className="grid gap-4">
                  {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Nombre y apellido *" className="sm:col-span-2"><input id="c-nombre" autoComplete="name" value={c.nombre} onChange={set('nombre')} className={inputCls} /></Field>
                      <Field label="Email *"><input id="c-email" type="email" autoComplete="email" value={c.email} onChange={set('email')} className={inputCls} /></Field>
                      <Field label="WhatsApp *"><input id="c-tel" type="tel" autoComplete="tel" value={c.telefono} onChange={set('telefono')} placeholder="221 555 5555" className={inputCls} /></Field>
                      <label className="flex cursor-pointer items-center gap-2 text-[17px] font-bold sm:col-span-2"><input id="c-factura" type="checkbox" checked={c.factura} onChange={set('factura')} className="h-5 w-5 accent-[#F15A24]" />Necesito factura A</label>
                      {c.factura && <Field label="CUIT *"><input id="c-cuit" inputMode="numeric" value={c.cuit} onChange={set('cuit')} placeholder="30-12345678-9" className={inputCls} /></Field>}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="grid gap-4">
                      <fieldset className="grid gap-2.5 sm:grid-cols-2">
                        <legend className="sr-only">Forma de entrega</legend>
                        {[['Retiro en el taller', `Sin cargo · ${site.city}`], ['Envío a domicilio', 'Costo según la dirección']].map(([o, d]) => (
                          <label key={o} className={`frame flex cursor-pointer items-start gap-3 border-[1.5px] bg-blanco p-4 [--chaflan:12px] ${c.entrega === o ? 'border-naranja ring-2 ring-naranja' : 'border-negro/20'}`}>
                            <input type="radio" name="entrega" value={o} checked={c.entrega === o} onChange={set('entrega')} className="mt-1.5 h-4 w-4 accent-[#F15A24]" />
                            <span><b className="block text-[20px]">{o}</b><span className="text-[16px] text-tinta2">{d}</span></span>
                          </label>
                        ))}
                      </fieldset>
                      {envio ? (
                        <div className="grid gap-4 sm:grid-cols-[2fr_1.3fr_1fr]">
                          <Field label="Dirección *"><input id="c-dir" autoComplete="street-address" value={c.direccion} onChange={set('direccion')} className={inputCls} /></Field>
                          <Field label="Localidad *"><input id="c-loc" autoComplete="address-level2" value={c.localidad} onChange={set('localidad')} className={inputCls} /></Field>
                          <Field label="CP *"><input id="c-cp" autoComplete="postal-code" value={c.cp} onChange={set('cp')} className={inputCls} /></Field>
                        </div>
                      ) : (
                        <p className="text-[18px] text-tinta2">Retirás en <b className="text-negro">{site.address}, {site.city}</b>. {site.hours}. Te avisamos cuando esté listo.</p>
                      )}
                      <Field label="Notas para el pedido"><textarea id="c-notas" rows={2} value={c.notas} onChange={set('notas')} placeholder="Horario de entrega, referencias del archivo, etc." className={`${inputCls} resize-y`} /></Field>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="grid gap-3 text-[18px]">
                      {[['Contacto', `${c.nombre} · ${c.email} · ${c.telefono}`, 0], ['Entrega', envio ? `${c.direccion}, ${c.localidad} (${c.cp})` : `Retiro en el taller · ${site.city}`, 1], ['Facturación', c.factura ? `Factura A · CUIT ${c.cuit}` : 'Consumidor final', 0]].map(([k, v, s]) => (
                        <div key={k} className="flex items-start justify-between gap-4 border-b border-linea pb-3">
                          <span><b className="block text-[15px] uppercase tracking-wider text-tinta2">{k}</b>{v}</span>
                          <button type="button" onClick={() => go(s)} className="text-[16px] font-bold underline underline-offset-4">Editar</button>
                        </div>
                      ))}
                      <p className="text-[16px] text-tinta2">
                        {checkoutMode === 'mercadopago' ? 'Vas a pagar en Mercado Pago. Si hay envío, te pasamos el costo antes de despacharlo.' : 'Te mandamos el pedido por WhatsApp para confirmarlo y pasarte el link de pago.'}
                      </p>
                    </div>
                  )}
                </div>

                {error && <p role="alert" className="font-bold text-hondo">{error}</p>}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {step > 0 ? <button type="button" onClick={() => go(step - 1)} className="text-[18px] font-bold underline-offset-4 hover:underline">← Volver</button> : <span />}
                  {step < 2
                    ? <Button tone="dark" onClick={() => go(step + 1)} disabled={!valid[step]}>Continuar</Button>
                    : <Button tone="orange" size="lg" onClick={pay} disabled={status === 'sending'}>{status === 'sending' ? 'Procesando…' : checkoutMode === 'mercadopago' ? `Pagar ${money(cart.total)}` : 'Enviar pedido'}</Button>}
                </div>
              </div>

              {/* resumen */}
              <aside className="frame grid gap-4 bg-negro p-6 text-blanco lg:sticky lg:top-24">
                <p className="text-[26px] font-black">Tu pedido</p>
                <ul className="grid max-h-[46vh] gap-0 overflow-y-auto pr-1" data-lenis-prevent>
                  {cart.items.map((i) => (
                    <li key={i.key} data-row className="grid grid-cols-[60px_minmax(0,1fr)_auto] items-start gap-3 border-b border-[#333] py-3">
                      <span className="frame relative aspect-square overflow-hidden [--chaflan:8px]"><PatternFill variant={i.variant ?? 0} className="absolute inset-0" /></span>
                      <span className="grid gap-1">
                        <Link to={`/tienda/${i.slug}`} className="text-[18px] font-extrabold leading-tight hover:text-naranja">{i.name}</Link>
                        <span className="text-[14px] text-humo">{Object.values(i.options).join(' · ')}</span>
                        {i.file && <span className="truncate text-[13px] font-bold text-humo">Archivo: {i.file}</span>}
                        <span className="mt-1 flex items-center gap-3">
                          <QtyStepper size="sm" value={i.qty} onChange={(q) => cart.setQty(i.key, q)} label={`Cantidad de ${i.name}`} />
                          <button type="button" onClick={() => cart.remove(i.key)} className="text-[14px] font-bold text-humo underline underline-offset-4 hover:text-naranja">Quitar</button>
                        </span>
                      </span>
                      <span className="text-[18px] font-black tabular-nums">{money(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="grid gap-1.5 text-[18px]">
                  <div className="flex justify-between"><dt className="text-humo">Subtotal</dt><dd className="m-0 tabular-nums">{money(cart.total)}</dd></div>
                  <div className="flex justify-between"><dt className="text-humo">Entrega</dt><dd className="m-0">{envio ? 'A cotizar' : 'Sin cargo'}</dd></div>
                  <div className="mt-2 flex items-baseline justify-between border-t border-[#444] pt-3"><dt className="text-[20px] font-bold">Total</dt><dd className="m-0 text-[36px] font-black tabular-nums text-naranja">{money(cart.total)}</dd></div>
                </dl>
                <p className="flex items-center gap-2 text-[15px] text-humo"><Foot className="h-4 w-4 text-naranja" />Pago seguro con Mercado Pago: tarjeta, cuotas o transferencia.</p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
