import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { site, money } from '../config'
import { services, profiles } from '../data/services'
import { projects } from '../data/projects'
import { products, priceFor } from '../data/products'
import { Foot } from '../components/Brand'
import ProductCard from '../components/shop/ProductCard'
import { Button, Photo, Placeholder, SectionHead } from '../components/ui'
import { Waves, Truchet } from '../components/Patterns'
import { ProjectCard, ProcessSteps, Marquee, CtaBand, Stat } from '../components/blocks'

// Huella gigante en blanco: se "pisa" al cargar y gira levemente con el scroll.
function HeroMark() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current, { scale: 1.6, rotate: -40, opacity: 0, duration: 0.9, delay: 1, ease: 'back.out(2.2)', transformOrigin: '50% 50%' })
      gsap.to(root.current, { rotate: 18, yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 20%', end: 'bottom top', scrub: true } })
    })
  }, { scope: root })
  return <Foot ref={root} className="block h-auto w-full text-blanco" />
}

function Hero() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.75 })
      SplitText.create('[data-hero-title]', {
        type: 'words,chars', mask: 'words', autoSplit: true,
        onSplit: (self) => tl.from(self.chars, { yPercent: 115, stagger: 0.02, duration: 0.9, ease: 'power4.out' }, 0),
      })
      tl.from('[data-hero-fade]', { y: 26, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.5)
      gsap.to('[data-hero-copy]', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    })
  }, { scope: root })

  return (
    <section ref={root} className="relative overflow-hidden bg-naranja text-blanco">
      <Waves walker="rgba(255,255,255,.55)" />
      <div className="wrap relative grid items-center gap-10 py-[clamp(56px,8vw,120px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div data-hero-copy className="grid gap-7">
          <p data-hero-fade className="eyebrow">{site.tagline} · {site.city}</p>
          <h1 data-hero-title className="display max-w-[10ch]">Diseñamos. Fabricamos. Instalamos.</h1>
          <p data-hero-fade className="lead max-w-[38ch]">Comunicación visual y espacios comerciales, desde la idea hasta la instalación. Diseño, taller y montaje bajo un mismo techo.</p>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Button to="/contacto" tone="dark" size="lg">Contanos tu proyecto</Button>
            <Button to="/proyectos" tone="ghost" size="lg">Ver proyectos</Button>
          </div>
        </div>
        <div className="mx-auto w-[min(440px,72vw)] lg:w-full"><HeroMark /></div>
      </div>
    </section>
  )
}

// "Adaptación": cada perfil entra por su propia puerta.
function Perfiles() {
  const [hover, setHover] = useState(0)
  const navigate = useNavigate()
  return (
    <section className="border-b border-linea bg-blanco py-[clamp(64px,9vw,120px)]">
      <div className="wrap grid gap-10">
        <SectionHead eyebrow="Empezá por acá" title="¿Qué te trae a gecko?" intro="Elegí lo que más se parece a tu situación y te mostramos lo que hicimos para gente como vos." />
        <div data-reveal="stagger" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {profiles.map((p, i) => (
            <button key={p.key} type="button" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => navigate(p.to)}
              className={`frame group grid min-h-[260px] content-between gap-6 p-6 text-left transition-colors duration-300 ${hover === i ? 'bg-negro text-blanco' : 'bg-papel'}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[clamp(28px,2.4vw,34px)] font-black leading-[1]">{p.label}</span>
                <Foot className={`h-9 w-9 shrink-0 transition-all duration-500 ease-gecko ${hover === i ? 'rotate-90 text-naranja' : 'rotate-45 text-gris'}`} />
              </div>
              <div className="grid gap-2">
                <b className={`text-[21px] leading-tight ${hover === i ? 'text-naranja' : 'text-hondo'}`}>{p.title}</b>
                <span className={`text-[17px] ${hover === i ? 'text-humo' : 'text-tinta2'}`}>{p.text}</span>
                <span className="mt-2 text-[17px] font-extrabold underline decoration-2 underline-offset-4">{p.cta} →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const headers = {
  waves: <Waves color="rgba(241,90,36,.7)" count={20} />,
  truchet: <Truchet combo="naranja" size={22} />,
  frame: <div className="absolute inset-0 bg-naranja"><div className="frame absolute inset-5 bg-blanco [--chaflan:30px]"><Truchet combo="gris" size={18} /></div></div>,
}

function Servicios() {
  return (
    <section className="border-b border-linea bg-papel py-[clamp(64px,9vw,120px)]">
      <div className="wrap grid gap-10">
        <SectionHead eyebrow="Servicios" title="Tres unidades, un mismo taller." intro="Ordenamos todo lo que hacemos en tres áreas para que encuentres rápido lo que necesitás." />
        <div data-reveal="stagger" className="grid gap-4 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} to={s.path} className="frame group grid bg-blanco transition-transform duration-500 ease-gecko hover:-translate-y-1.5">
              <div className="relative h-48 overflow-hidden bg-blanco">{headers[s.pattern]}</div>
              <div className="grid gap-3 p-6">
                <h3 className="text-[34px] transition-colors group-hover:text-hondo">{s.name}</h3>
                <p className="text-[18px] text-tinta2">{s.intro}</p>
                <ul className="grid gap-1 text-[17px] font-bold">
                  {s.items.map(([t]) => <li key={t} className="flex items-center gap-2"><Foot className="h-3.5 w-3.5 rotate-90 text-naranja" />{t}</li>)}
                </ul>
                <span className="mt-2 text-[18px] font-extrabold">Ver {s.name.toLowerCase()} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Destacados() {
  const list = projects.filter((p) => p.featured).slice(0, 6)
  return (
    <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
      <div className="wrap grid gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Proyectos" title="El trabajo terminado habla por nosotros." />
          <Button to="/proyectos" tone="ghost">Ver todos los proyectos</Button>
        </div>
        <div data-reveal="stagger" className="grid gap-x-5 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}

const maquinas = ['Router CNC', 'Corte láser', 'Impresión de gran formato', 'Impresión 3D', 'Plotter de corte', 'Taller de armado']

function TallerTeaser() {
  return (
    <section className="relative overflow-hidden bg-negro text-blanco">
      <div className="wrap grid gap-12 py-[clamp(72px,10vw,140px)] lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <SectionHead dark eyebrow="El taller" title="Todo pasa bajo el mismo techo." intro="Somos la fusión de INOVO Industrial y ERRE Comunicación Visual: más de 10 años de diseño industrial y gráfico (UNLP), con producción propia." />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <Stat n={10} prefix="+" label="años de oficio" />
            <Stat n={3} label="unidades de servicio" />
            <Stat n={100} suffix="%" label="producción in-house" />
          </div>
          <div><Button to="/taller" tone="orange">Conocé el taller</Button></div>
        </div>
        <div className="grid content-center gap-3">
          <Photo variant={3} ratio="aspect-[16/10]" alt="El taller de gecko"><Placeholder show /></Photo>
          <div data-reveal="stagger" className="flex flex-wrap gap-2">
            {maquinas.map((m) => <span key={m} className="tag border-[1.5px] border-[#444] !text-[16px]">{m}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Proceso() {
  return (
    <section className="border-b border-linea bg-blanco py-[clamp(64px,9vw,120px)]">
      <div className="wrap grid gap-12">
        <SectionHead eyebrow="Cómo trabajamos" title="De la idea a la instalación, sin pasamanos." />
        <ProcessSteps steps={[
          ['Escuchamos', 'Entendemos qué necesitás, dónde va y cuánto querés invertir.'],
          ['Diseñamos', 'Propuesta, renders y planos de detalle. Validás antes de producir.'],
          ['Fabricamos', 'Router CNC, láser, impresión y armado en nuestro taller.'],
          ['Instalamos', 'Montaje en obra, cierre con ficha de conformidad y garantía.'],
        ]} />
      </div>
    </section>
  )
}

function TiendaTeaser() {
  const list = products.filter((p) => p.featured).slice(0, 4)
  return (
    <section className="bg-papel py-[clamp(64px,9vw,120px)]">
      <div className="wrap grid gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Tienda online" title="Lo que no necesita reunión, pedilo online." />
          <Button to="/tienda" tone="dark">Ir a la tienda</Button>
        </div>
        <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.slug} p={p} i={products.indexOf(p)} />)}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const root = useRef(null)
  useReveal(root)
  return (
    <div ref={root}>
      <title>gecko · Diseñamos. Fabricamos. Instalamos.</title>
      <meta name="description" content="Estudio y taller de comunicación visual en La Plata: producción gráfica, arquigrafía, fachadas, P.O.P. y retail. Diseño, fabricación e instalación." />
      <Hero />
      <Perfiles />
      <Marquee words={['Diseñamos', 'Fabricamos', 'Instalamos', 'Soluciones creativas', 'Materializamos tus ideas']} />
      <Servicios />
      <Destacados />
      <TallerTeaser />
      <Proceso />
      <TiendaTeaser />
      <CtaBand title="¿Tenés un proyecto en mente?" text="Contanos qué necesitás. Te respondemos con una propuesta, plazos y presupuesto." />
    </div>
  )
}
