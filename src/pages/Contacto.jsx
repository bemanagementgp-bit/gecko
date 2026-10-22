import { useRef } from 'react'
import { useReveal } from '../lib/motion'
import { track } from '../lib/track'
import { site, waLink } from '../config'
import { faqs } from '../data/faqs'
import { Foot } from '../components/Brand'
import { Button, SectionHead } from '../components/ui'
import { Waves } from '../components/Patterns'
import { Faq } from '../components/blocks'
import LeadForm from '../components/LeadForm'
import PageHero, { HeroChip } from '../components/PageHero'

export default function Contacto() {
  const root = useRef(null)
  useReveal(root)
  const canales = [
    ['WhatsApp', 'La vía más rápida', waLink('Hola gecko, quiero hacer una consulta.')],
    ['Email', site.email, `mailto:${site.email}`],
    ['Instagram', `@${site.instagram}`, `https://instagram.com/${site.instagram}`],
  ]
  return (
    <div ref={root}>
      <title>Contacto · gecko</title>
      <meta name="description" content="Contanos tu proyecto: fachadas, cartelería, P.O.P., stands o producción gráfica. gecko, La Plata." />

      <PageHero eyebrow="Contacto" title="Dejá tu huella."
        lead="Contanos qué necesitás en cuatro pasos. Con esos datos te respondemos con una propuesta concreta."
        media={{ type: 'video', src: '/media/taller/letras' }}>
        <HeroChip solid onClick={() => document.getElementById('formulario-contacto')?.scrollIntoView({ behavior: 'smooth' })}>Completar el formulario</HeroChip>
        <HeroChip onClick={() => window.open(canales[0][2], '_blank', 'noopener')}>Escribir por WhatsApp</HeroChip>
      </PageHero>

      <section id="formulario-contacto" className="scroll-mt-20 bg-papel py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div data-reveal><LeadForm origen="Contacto" /></div>
          <aside className="grid content-start gap-6">
            <div data-reveal="stagger" className="grid gap-3">
              {canales.map(([t, d, href]) => (
                <a key={t} href={href} target="_blank" rel="noopener" onClick={() => t === 'WhatsApp' && track('Contact', { method: 'whatsapp', page: '/contacto' })}
                  className="frame group flex items-center justify-between gap-4 bg-blanco p-5 transition-colors hover:bg-negro hover:text-blanco [--chaflan:16px]">
                  <span><b className="block text-[26px] leading-tight">{t}</b><span className="text-[17px] opacity-70">{d}</span></span>
                  <Foot className="h-7 w-7 rotate-90 text-naranja transition-transform duration-500 group-hover:rotate-[120deg]" />
                </a>
              ))}
            </div>
            <div data-reveal className="frame grid gap-2 bg-negro p-6 text-blanco">
              <p className="eyebrow text-naranja">El taller</p>
              <p className="text-[22px] font-bold leading-tight">{site.address}<br />{site.city}</p>
              <p className="text-[17px] text-humo">Retiros: {site.hours}</p>
              {/* TODO: reemplazar por el link real de Google Maps del taller */}
              <div className="mt-2"><Button href={`https://www.google.com/maps/search/${encodeURIComponent(`${site.address}, ${site.city}`)}`} tone="orange" size="sm">Cómo llegar</Button></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHead eyebrow="Antes de escribirnos" title="Preguntas frecuentes." />
          <Faq items={faqs.general} />
        </div>
      </section>
    </div>
  )
}
