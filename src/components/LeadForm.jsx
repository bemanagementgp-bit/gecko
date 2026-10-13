import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { sendLead } from '../lib/leads'
import { profiles } from '../data/services'
import { Foot } from './Brand'
import { Button } from './ui'
import { Truchet } from './Patterns'

// Tipos de proyecto que ofrece cada perfil en el paso 2.
const tipos = {
  arquitectos: ['Fachada', 'Cartelería', 'Mobiliario a medida', 'Equipamiento comercial', 'Otro'],
  comercios: ['Fachada', 'Cartel frontal', 'Interior', 'Vidriera', 'Imagen completa'],
  marcas: ['Exhibidor', 'Stand', 'Activación', 'Serie para sucursales', 'Otro'],
  rapidos: ['Impresión', 'Stickers', 'Corte de rígidos', 'Vinilo de corte', 'Otro'],
}
const plazos = ['Lo antes posible', 'Este mes', '1 a 3 meses', 'Sin fecha todavía']
// TODO gecko: validar rangos de presupuesto
const presupuestos = ['Menos de $500.000', '$500.000 a $2.000.000', '$2.000.000 a $5.000.000', 'Más de $5.000.000', 'Todavía no sé']

function Chips({ name, options, value, onChange, multi = false }) {
  const toggle = (o) => (multi ? onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]) : onChange(o))
  return (
    <div role={multi ? 'group' : 'radiogroup'} aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi ? value.includes(o) : value === o
        return (
          <button key={o} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={on} onClick={() => toggle(o)}
            className={`rounded-full border-[1.5px] px-4 pb-2 pt-1 text-[18px] font-bold transition-colors ${on ? 'border-negro bg-negro text-blanco' : 'border-negro/30 bg-blanco hover:border-negro'}`}>{o}</button>
        )
      })}
    </div>
  )
}

function Field({ label, children, hint }) {
  return (
    <label className="grid gap-1.5">
      <span className="eyebrow !text-[14px] text-tinta2">{label}</span>
      {children}
      {hint && <span className="text-[15px] text-tinta2">{hint}</span>}
    </label>
  )
}

export default function LeadForm({ origen, perfil: fixed, fileHint = 'Render, plano, foto o archivo de referencia (opcional)', dark = false }) {
  const id = useId()
  const [perfil, setPerfil] = useState(fixed || '')
  const steps = fixed ? ['Tu proyecto', 'Plazo y presupuesto', 'Tus datos'] : ['Tu perfil', 'Tu proyecto', 'Plazo y presupuesto', 'Tus datos']
  const [step, setStep] = useState(0)
  const [d, setD] = useState({ tipo: [], detalle: '', plazo: '', presupuesto: '', ubicacion: '', nombre: '', empresa: '', telefono: '', email: '' })
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  const root = useRef(null)
  const feet = useRef(null)
  const set = (k) => (v) => setD((x) => ({ ...x, [k]: v?.target ? v.target.value : v }))

  const name = steps[step]
  const valid = {
    'Tu perfil': !!perfil,
    'Tu proyecto': d.tipo.length > 0,
    'Plazo y presupuesto': !!d.plazo,
    'Tus datos': d.nombre.trim().length > 1 && (d.telefono.trim().length >= 6 || /\S+@\S+\.\S+/.test(d.email)),
  }[name]

  const { contextSafe } = useGSAP(() => {}, { scope: root })
  const go = contextSafe((dir) => {
    // el paso cambia ya; la animación solo acompaña (no depende de que termine)
    setStep((s) => s + dir)
    gsap.fromTo(root.current.querySelector('[data-panel]'), { x: dir * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
    if (dir > 0) gsap.fromTo(feet.current.children[step], { scale: 1.9, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(3)' })
  })

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    if (step < steps.length - 1) return go(1)
    setStatus('sending'); setError('')
    try {
      const label = profiles.find((p) => p.key === perfil)?.label || perfil
      await sendLead({
        origen, perfil,
        datos: { Perfil: label, 'Tipo de proyecto': d.tipo.join(', '), Detalle: d.detalle, Plazo: d.plazo, Presupuesto: d.presupuesto, Ubicación: d.ubicacion, Nombre: d.nombre, 'Empresa / estudio': d.empresa, Teléfono: d.telefono, Email: d.email },
        archivos: files,
      })
      setStatus('done')
    } catch (err) {
      setError(err.message); setStatus('error')
    }
  }

  const box = dark ? 'bg-carbon text-blanco' : 'bg-blanco text-negro'

  if (status === 'done') {
    return (
      <div className={`frame relative grid min-h-[420px] place-items-center overflow-hidden ${box}`}>
        <Truchet combo="naranja" spin size={26} />
        <div className="relative m-6 grid max-w-[440px] gap-3 bg-blanco p-7 text-negro">
          <Foot className="h-10 w-10 text-naranja" />
          <h3 className="text-[36px]">¡Dejaste tu huella!</h3>
          <p className="text-[19px] text-tinta2">Recibimos tu consulta. Te respondemos por el medio que nos dejaste.</p>
        </div>
      </div>
    )
  }

  return (
    <form ref={root} onSubmit={submit} noValidate className={`frame grid gap-6 p-[clamp(20px,3vw,36px)] ${box}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div ref={feet} className="flex gap-1.5" aria-hidden="true">
          {steps.map((s, i) => <Foot key={s} className={`h-7 w-7 transition-colors duration-300 ${i < step ? 'text-naranja' : i === step ? (dark ? 'text-blanco' : 'text-negro') : dark ? 'text-[#444]' : 'text-gris'}`} />)}
        </div>
        <p className="text-[17px] font-bold" aria-live="polite">Paso {step + 1} de {steps.length} · {name}</p>
      </div>

      <div data-panel className="grid min-h-[230px] content-start gap-5">
        {name === 'Tu perfil' && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {profiles.map((p) => (
              <button key={p.key} type="button" aria-pressed={perfil === p.key} onClick={() => { setPerfil(p.key); set('tipo')([]) }}
                className={`grid gap-0.5 border-[1.5px] p-4 text-left transition-colors ${perfil === p.key ? 'border-naranja bg-naranja text-negro' : dark ? 'border-[#555] hover:border-blanco' : 'border-negro/30 hover:border-negro'}`}>
                <b className="text-[21px] leading-tight">{p.label}</b><span className="text-[16px] opacity-75">{p.sub}</span>
              </button>
            ))}
          </div>
        )}
        {name === 'Tu proyecto' && (
          <>
            <Field label="¿Qué necesitás?"><Chips name="Tipo de proyecto" multi options={tipos[perfil] || tipos.comercios} value={d.tipo} onChange={set('tipo')} /></Field>
            <Field label="Contanos un poco más">
              <textarea id={`${id}-detalle`} rows={3} value={d.detalle} onChange={set('detalle')} className="field resize-y text-negro" placeholder="Medidas, materiales, cantidad, lo que tengas en mente" />
            </Field>
            <Field label="Archivos" hint={files.length ? files.map((f) => f.name).join(', ') : fileHint}>
              <input id={`${id}-files`} type="file" multiple accept=".pdf,.ai,.svg,.eps,.dwg,.png,.jpg,.jpeg" onChange={(e) => setFiles([...e.target.files])}
                className="text-[17px] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-negro file:px-4 file:pb-2 file:pt-1 file:font-bold file:text-blanco" />
            </Field>
          </>
        )}
        {name === 'Plazo y presupuesto' && (
          <>
            <Field label="¿Para cuándo?"><Chips name="Plazo" options={plazos} value={d.plazo} onChange={set('plazo')} /></Field>
            <Field label="Presupuesto estimado"><Chips name="Presupuesto" options={presupuestos} value={d.presupuesto} onChange={set('presupuesto')} /></Field>
            <Field label="¿Dónde es?"><input id={`${id}-ubi`} value={d.ubicacion} onChange={set('ubicacion')} className="field text-negro" placeholder="Ciudad o barrio" /></Field>
          </>
        )}
        {name === 'Tus datos' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre *"><input id={`${id}-nombre`} autoComplete="name" required value={d.nombre} onChange={set('nombre')} className="field text-negro" /></Field>
            <Field label="Empresa o estudio"><input id={`${id}-empresa`} autoComplete="organization" value={d.empresa} onChange={set('empresa')} className="field text-negro" /></Field>
            <Field label="WhatsApp o teléfono"><input id={`${id}-tel`} type="tel" autoComplete="tel" value={d.telefono} onChange={set('telefono')} className="field text-negro" /></Field>
            <Field label="Email"><input id={`${id}-email`} type="email" autoComplete="email" value={d.email} onChange={set('email')} className="field text-negro" /></Field>
            <p className="text-[15px] opacity-70 sm:col-span-2">Dejanos al menos un teléfono o un email para responderte.</p>
          </div>
        )}
      </div>

      {error && <p role="alert" className="font-bold text-hondo">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? <button type="button" onClick={() => go(-1)} className="text-[18px] font-bold underline-offset-4 hover:underline">← Volver</button> : <span />}
        <Button type="submit" tone="orange" disabled={!valid || status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : step < steps.length - 1 ? 'Siguiente' : 'Enviar consulta'}
        </Button>
      </div>
    </form>
  )
}
