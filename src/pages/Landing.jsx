import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { usePublic } from '../lib/content'
import { faqs } from '../data/faqs'
import { Foot } from '../components/Brand'
import { Button, SectionHead } from '../components/ui'
import { Waves, Truchet } from '../components/Patterns'
import { ProjectCard, ProcessSteps, BeforeAfter, Faq } from '../components/blocks'
import LeadForm from '../components/LeadForm'

// Una landing por público de campaña. El gancho repite la frase del anuncio de Meta Ads.
const landings = {
  arquitectos: {
    title: 'Para arquitectos y diseñadores',
    hook: '¿Tenés el proyecto diseñado pero necesitás quién lo produzca?',
    sub: 'Materializamos proyectos de estudios con precisión: detalle constructivo, fabricación en taller propio e instalación en obra.',
    pains: [
      ['Tolerancias que se respetan', 'Leemos tus planos, hacemos los de detalle y validamos antes de cortar.'],
      ['Un solo interlocutor', 'Diseño industrial, gráfica, taller y montaje en el mismo equipo.'],
      ['Tu diseño, tu crédito', 'Ejecutamos sin cambiar la idea. Vos seguís siendo el autor del proyecto.'],
    ],
    proof: (p) => p.rubro === 'Ejecución para estudios' || p.unit === 'arquigrafia',
    fileHint: 'Planos, renders o memoria técnica (PDF, DWG, imágenes)',
    beforeAfter: false,
  },
  comercios: {
    title: 'Para comercios y locales',
    hook: 'Tu local puede estar vendiendo menos por cómo se ve.',
    sub: 'Renovamos fachadas, carteles e interiores de comercios, clínicas, farmacias y gastronomía. Del frente del local al último detalle interior.',
    pains: [
      ['Que te vean desde la esquina', 'Cartelería y fachada pensadas para frenar a quien pasa.'],
      ['Sin cerrar el local', 'Planificamos la instalación para que sigas atendiendo.'],
      ['Todo resuelto en un lugar', 'Diseño, fabricación e instalación. No coordinás cinco proveedores.'],
    ],
    proof: (p) => p.unit === 'arquigrafia' && p.rubro !== 'Ejecución para estudios',
    fileHint: 'Fotos del local actual o referencias que te gusten',
    beforeAfter: true,
  },
  marcas: {
    title: 'Para marcas y agencias',
    hook: '¿Necesitás producir una activación sin coordinar cinco proveedores?',
    sub: 'Exhibidores, stands, P.O.P. y activaciones diseñados y fabricados en el mismo taller. Prototipo, serie y montaje.',
    pains: [
      ['Del render a la serie', 'Prototipamos, ajustamos con tu marca y producimos en cantidad.'],
      ['Plazos de evento', 'Trabajamos contra fecha de lanzamiento, feria o activación.'],
      ['Un solo responsable', 'Producción, logística e instalación coordinadas por nosotros.'],
    ],
    proof: (p) => p.unit === 'pop-retail',
    fileHint: 'Brief, key visual, renders o referencias',
    beforeAfter: false,
  },
}

const steps = [
  ['Nos contás', 'Completás el formulario o nos escribís por WhatsApp.'],
  ['Diseñamos', 'Propuesta, planos y presupuesto con hitos.'],
  ['Fabricamos', 'Producción en nuestro taller de La Plata.'],
  ['Instalamos', 'Montaje, cierre con ficha de conformidad y garantía.'],
]

export default function Landing({ k }) {
  const L = landings[k]
  const { projects } = usePublic()
  const root = useRef(null)
  useReveal(root, [k])
  const proof = projects.filter(L.proof).slice(0, 3)
  const ba = projects.find((p) => p.before && p.after)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.75 })
      SplitText.create('[data-hook]', {
        type: 'words', mask: 'words', autoSplit: true,
        onSplit: (self) => tl.from(self.words, { yPercent: 110, stagger: 0.05, duration: 0.9, ease: 'power4.out' }, 0),
      })
      tl.from('[data-hero-fade]', { y: 24, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.4)
    })
  }, { scope: root, dependencies: [k], revertOnUpdate: true })

  const toForm = () => {
    const el = document.getElementById('formulario')
    window.__lenis ? window.__lenis.scrollTo(el, { offset: -90, duration: 1.4 }) : el.scrollIntoView()
  }

  return (
    <div ref={root} key={k}>
      <title>{`${L.title} · gecko`}</title>
      <meta name="description" content={`${L.hook} ${L.sub}`} />

      <section className="relative overflow-hidden bg-naranja text-blanco">
        <Waves walker="rgba(255,255,255,.5)" />
        <div className="wrap relative grid gap-7 py-[clamp(56px,8vw,120px)]">
          <p data-hero-fade className="eyebrow">{L.title}</p>
          <h1 data-hook className="max-w-[17ch] text-[clamp(46px,7.4vw,108px)] font-black leading-[.94]">{L.hook}</h1>
          <p data-hero-fade className="lead max-w-[46ch]">{L.sub}</p>
          <div data-hero-fade className="flex flex-wrap gap-3"><Button onClick={toForm} tone="dark" size="lg">Contanos tu proyecto</Button></div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-4 md:grid-cols-3" data-reveal="stagger">
          {L.pains.map(([t, d], i) => (
            <div key={t} className="frame grid content-start gap-3 bg-papel p-6">
              <Foot className="h-9 w-9 text-naranja" style={{ rotate: `${60 + i * 35}deg` }} />
              <h2 className="text-[32px]">{t}</h2>
              <p className="text-[19px] text-tinta2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {L.beforeAfter && (
        <section className="bg-papel py-[clamp(56px,8vw,110px)]">
          <div className="wrap grid gap-8">
            <SectionHead eyebrow="Mirá la diferencia" title="Mismo local. Otra imagen." intro={ba ? `${ba.title}. Arrastrá para comparar.` : 'Arrastrá para comparar.'} />
            <div data-reveal><BeforeAfter before={ba?.before} after={ba?.after} placeholder={!ba} /></div>
          </div>
        </section>
      )}

      <section className="bg-negro py-[clamp(56px,8vw,110px)] text-blanco">
        <div className="wrap grid gap-12">
          <SectionHead dark eyebrow="Cómo trabajamos" title="Diseñamos. Fabricamos. Instalamos." />
          <ProcessSteps dark steps={steps} />
        </div>
      </section>

      {proof.length > 0 && (
        <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
          <div className="wrap grid gap-10">
            <SectionHead eyebrow="Casos" title="Lo que ya hicimos." />
            <div data-reveal="stagger" className="grid gap-x-5 gap-y-10 md:grid-cols-3">
              {proof.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
            </div>
          </div>
        </section>
      )}

      <section id="formulario" className="relative overflow-hidden bg-papel py-[clamp(56px,8vw,110px)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 opacity-60 lg:block"><Truchet combo="gris" size={28} /></div>
        <div className="wrap relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHead eyebrow="Tu proyecto" title="Contanos qué necesitás." intro="Son 3 pasos. Con esa información te respondemos con una propuesta concreta." />
          <div data-reveal><LeadForm origen={`Landing · ${L.title}`} perfil={k} fileHint={L.fileHint} /></div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(56px,8vw,110px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHead eyebrow="Preguntas frecuentes" title="Antes de arrancar." />
          <Faq items={faqs.general} />
        </div>
      </section>
    </div>
  )
}
