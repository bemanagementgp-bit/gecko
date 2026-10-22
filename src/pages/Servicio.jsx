import { useRef } from 'react'
import { Link } from 'react-router'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { site, money } from '../config'
import { serviceBySlug } from '../data/services'
import { usePublic } from '../lib/content'
import { faqs } from '../data/faqs'
import { Foot } from '../components/Brand'
import ProductCard from '../components/shop/ProductCard'
import { Button, Photo, Placeholder, SectionHead } from '../components/ui'
import { Waves, Truchet } from '../components/Patterns'
import { ProjectCard, ProcessSteps, CtaBand, Faq } from '../components/blocks'
import PageHero, { HeroChip } from '../components/PageHero'

// Fondo del encabezado según el pattern asignado a cada unidad.
function HeroBg({ pattern }) {
  if (pattern === 'waves') return <Waves color="rgba(217,217,217,.5)" walker="rgba(255,255,255,.45)" />
  if (pattern === 'truchet') return <div className="absolute inset-0 opacity-25"><Truchet combo="blanco" size={34} /></div>
  return <div className="frame absolute inset-[clamp(12px,2vw,24px)] border-2 border-white/40 [--chaflan:48px]" />
}

// Video de fondo del hero de cada unidad.
const heroVideo = { arquigrafia: '/media/p/farmacia-garcia/noche', 'produccion-grafica': '/media/taller/uv', 'pop-retail': '/media/p/creperie-on-the-road/impresion' }

// Categorías de la tienda relacionadas con cada unidad.
const shopCats = { 'produccion-grafica': ['vinilos', 'cortes', 'vehicular'], arquigrafia: ['corporeos', 'fachadas'], 'pop-retail': ['vinilos', 'corporeos'] }

export default function Servicio({ slug }) {
  const s = serviceBySlug[slug]
  const root = useRef(null)
  useReveal(root, [slug])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-item]', { y: 50, opacity: 0, '--chaflan': '50px', stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: '[data-items]', start: 'top 80%', once: true } })
    })
  }, { scope: root, dependencies: [slug], revertOnUpdate: true })

  const { projects, products } = usePublic()
  const related = projects.filter((p) => p.unit === slug)
  // primero los productos que se usaron en obras de esta unidad, después los de sus categorías
  const used = [...new Set(related.flatMap((p) => p.products || []))].map((s) => products.find((x) => x.slug === s)).filter(Boolean)
  const shop = [...new Set([...used, ...products.filter((p) => shopCats[slug]?.includes(p.category))])].slice(0, 4)

  return (
    <div ref={root} key={slug}>
      <title>{`${s.name} · gecko`}</title>
      <meta name="description" content={s.intro} />

      <PageHero key={slug} eyebrow={s.name} title={s.headline} lead={s.intro} media={{ type: 'video', src: heroVideo[slug] }}
        crumbs={<><Link to="/" className="hover:text-naranja">Inicio</Link> / Servicios</>}
        stats={[[related.length, 'Obras de esta unidad'], [used.length, 'Productos de sus obras'], [s.items.length, 'Servicios'], [s.steps.length, 'Pasos del proceso']]}>
        <HeroChip solid to={s.landing || '/contacto'}>{s.landing ? 'Contanos tu proyecto' : 'Pedí tu cotización'}</HeroChip>
        {s.shop && <HeroChip to="/tienda">Comprar online</HeroChip>}
      </PageHero>

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
