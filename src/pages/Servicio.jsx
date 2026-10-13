import { useRef } from 'react'
import { Link } from 'react-router'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { site, money } from '../config'
import { serviceBySlug } from '../data/services'
import { projects } from '../data/projects'
import { products, priceFor } from '../data/products'
import { faqs } from '../data/faqs'
import { Foot } from '../components/Brand'
import ProductCard from '../components/shop/ProductCard'
import { Button, Photo, Placeholder, SectionHead } from '../components/ui'
import { Waves, Truchet } from '../components/Patterns'
import { ProjectCard, ProcessSteps, CtaBand, Faq } from '../components/blocks'

// Fondo del encabezado según el pattern asignado a cada unidad.
function HeroBg({ pattern }) {
  if (pattern === 'waves') return <Waves color="rgba(217,217,217,.5)" walker="rgba(255,255,255,.45)" />
  if (pattern === 'truchet') return <div className="absolute inset-0 opacity-25"><Truchet combo="blanco" size={34} /></div>
  return <div className="frame absolute inset-[clamp(12px,2vw,24px)] border-2 border-white/40 [--chaflan:48px]" />
}

// Categorías de la tienda relacionadas con cada unidad.
const shopCats = { 'produccion-grafica': ['stickers-vinilos', 'materiales', 'comunicacion-visual'], 'pop-retail': ['pop'] }

export default function Servicio({ slug }) {
  const s = serviceBySlug[slug]
  const root = useRef(null)
  useReveal(root, [slug])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.75 })
      SplitText.create('[data-hero-title]', {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (self) => tl.from(self.lines, { yPercent: 110, stagger: 0.1, duration: 1, ease: 'power4.out' }, 0),
      })
      tl.from('[data-hero-fade]', { y: 24, opacity: 0, stagger: 0.08, duration: 0.7 }, 0.3)
      gsap.from('[data-item]', { y: 50, opacity: 0, '--chaflan': '50px', stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: '[data-items]', start: 'top 80%', once: true } })
    })
  }, { scope: root, dependencies: [slug], revertOnUpdate: true })

  const related = projects.filter((p) => p.unit === slug)
  const shop = products.filter((p) => shopCats[slug]?.includes(p.category)).slice(0, 4)

  return (
    <div ref={root} key={slug}>
      <title>{`${s.name} · gecko`}</title>
      <meta name="description" content={s.intro} />

      <section className="relative overflow-hidden bg-naranja text-blanco">
        <HeroBg pattern={s.pattern} />
        <div className="wrap relative grid gap-6 py-[clamp(64px,9vw,130px)]">
          <nav data-hero-fade aria-label="Ruta" className="text-[16px] font-bold text-cafe"><Link to="/" className="hover:underline">Inicio</Link> / Servicios</nav>
          <p data-hero-fade className="eyebrow">{s.name}</p>
          <h1 data-hero-title className="display max-w-[13ch]">{s.headline}</h1>
          <p data-hero-fade className="lead max-w-[44ch]">{s.intro}</p>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Button to={s.landing || '/contacto'} tone="dark" size="lg">{s.landing ? 'Contanos tu proyecto' : 'Pedí tu cotización'}</Button>
            {s.shop && <Button to="/tienda" tone="ghost" size="lg">Comprar online</Button>}
          </div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-10">
          <SectionHead eyebrow="Qué hacemos" title={`Todo lo de ${s.name.toLowerCase()}, en un solo lugar.`} intro={`Pensado para ${s.audience.toLowerCase()}.`} />
          <div data-items className="grid gap-3.5 sm:grid-cols-2">
            {s.items.map(([t, d], i) => (
              <div key={t} data-item className="frame grid grid-cols-[auto_1fr] items-start gap-4 bg-papel p-6">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-negro text-naranja"><Foot className="h-7 w-7" style={{ rotate: `${45 + i * 30}deg` }} /></span>
                <div className="grid gap-1"><h3 className="text-[30px]">{t}</h3><p className="text-[18px] text-tinta2">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-negro py-[clamp(64px,9vw,120px)] text-blanco">
        <div className="wrap grid gap-12">
          <SectionHead dark eyebrow="El proceso" title="Paso a paso, sin sorpresas." />
          <ProcessSteps dark steps={s.steps} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
          <div className="wrap grid gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="Proyectos" title="Casos de esta unidad." />
              <Button to={`/proyectos?unidad=${slug}`} tone="ghost">Ver todos</Button>
            </div>
            <div data-reveal="stagger" className="grid gap-x-5 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {related.slice(0, 3).map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
            </div>
          </div>
        </section>
      )}

      {shop.length > 0 && (
        <section className="bg-papel py-[clamp(64px,9vw,120px)]">
          <div className="wrap grid gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="Tienda" title="Pedilo online." intro="Productos estándar con precio a la vista. Subís tu archivo y lo producimos." />
              <Button to="/tienda">Ver la tienda</Button>
            </div>
            <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {shop.map((p) => <ProductCard key={p.slug} p={p} i={products.indexOf(p)} />)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHead eyebrow="Preguntas frecuentes" title="Lo que más nos consultan." intro={`¿Otra duda? Escribinos por WhatsApp o a ${site.email}.`} />
          <Faq items={faqs.general} />
        </div>
      </section>

      <CtaBand title={s.landing ? 'Hagamos tu proyecto realidad.' : 'Mandanos tu archivo.'} to={s.landing || '/contacto'} cta={s.landing ? 'Contanos tu proyecto' : 'Pedí tu cotización'} />
    </div>
  )
}
