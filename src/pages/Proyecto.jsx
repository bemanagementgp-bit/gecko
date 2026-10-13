import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { track } from '../lib/track'
import { projects, projectBySlug } from '../data/projects'
import { serviceBySlug } from '../data/services'
import { Foot } from '../components/Brand'
import { Photo, Placeholder } from '../components/ui'
import { BeforeAfter, CtaBand } from '../components/blocks'
import NoEncontrada from './NoEncontrada'

export default function Proyecto() {
  const { slug } = useParams()
  const p = projectBySlug[slug]
  const root = useRef(null)
  useReveal(root, [slug])

  useEffect(() => { if (p) track('ViewContent', { content_ids: [p.slug], content_type: 'project', content_category: p.unit }) }, [p])

  // la foto principal se abre desde el frame del manual
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-cover]', { '--chaflan': '50%', scale: 1.05, duration: 1.4, delay: 0.7, ease: 'power4.out' })
      gsap.to('[data-cover-img]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '[data-cover]', start: 'top top', end: 'bottom top', scrub: true } })
    })
  }, { scope: root, dependencies: [slug], revertOnUpdate: true })

  if (!p) return <NoEncontrada />
  const s = serviceBySlug[p.unit]
  const idx = projects.indexOf(p)
  const next = projects[(idx + 1) % projects.length]
  const landing = s?.landing || '/contacto'

  return (
    <div ref={root} key={slug}>
      <title>{`${p.title} · Proyectos · gecko`}</title>
      <meta name="description" content={`${p.necesidad} ${p.resultado}`} />

      <section className="bg-blanco pt-[clamp(40px,6vw,80px)]">
        <div className="wrap grid gap-6">
          <nav aria-label="Ruta" className="text-[16px] font-bold text-tinta2"><Link to="/proyectos" className="hover:text-naranja">← Proyectos</Link> / {s?.name}</nav>
          <h1 data-split className="display max-w-[14ch]">{p.title}</h1>
          <dl data-reveal="stagger" className="grid grid-cols-2 gap-4 border-y border-linea py-5 md:grid-cols-4">
            {[['Cliente', p.client], ['Unidad', s?.name], ['Rubro', p.rubro], ['Año', p.year]].map(([k, v]) => (
              <div key={k}><dt className="eyebrow !text-[13px] text-tinta2">{k}</dt><dd className="m-0 text-[21px] font-extrabold">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="wrap mt-8">
          <div data-cover className="frame relative overflow-hidden [--chaflan:28px]">
            <div data-cover-img><Photo src={p.cover} alt={p.title} ratio="aspect-[16/8]" frame={false} variant={idx} /></div>
            <Placeholder show={p.placeholder} />
          </div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-12 lg:grid-cols-3">
          {[['La necesidad', p.necesidad], ['El proceso', p.proceso], ['El resultado', p.resultado]].map(([t, d], i) => (
            <div key={t} data-reveal className="grid content-start gap-3 border-t-[3px] border-negro pt-4">
              <span className="flex items-center gap-2 text-[18px] font-black text-naranja"><Foot className="h-5 w-5 rotate-90" />0{i + 1}</span>
              <h2 className="text-[clamp(32px,3.2vw,44px)]">{t}</h2>
              <p className="text-[20px] text-tinta2">{d}</p>
            </div>
          ))}
        </div>
        <div data-reveal className="wrap mt-10 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2 !text-[14px] text-tinta2">Materiales</span>
          {p.materiales.map((m) => <span key={m} className="tag bg-papel !text-[16px]">{m}</span>)}
        </div>
      </section>

      {p.beforeAfter && (
        <section className="bg-papel py-[clamp(64px,9vw,120px)]">
          <div className="wrap grid gap-8">
            <h2 data-split className="h-section">Antes y después.</h2>
            <div data-reveal><BeforeAfter before={p.before} after={p.after} placeholder={p.placeholder} /></div>
          </div>
        </section>
      )}

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-4 md:grid-cols-2" data-reveal="stagger">
          {[0, 1, 2, 3].map((k) => <Photo key={k} src={p.gallery?.[k]} alt={`${p.title}, foto ${k + 1}`} variant={idx + k + 1} ratio="aspect-[4/3]"><Placeholder show={p.placeholder} /></Photo>)}
        </div>
      </section>

      <section className="border-t border-linea bg-blanco">
        <Link to={`/proyectos/${next.slug}`} className="wrap group flex flex-wrap items-center justify-between gap-6 py-12">
          <span className="grid gap-1">
            <span className="eyebrow text-tinta2">Siguiente proyecto</span>
            <span className="text-[clamp(36px,5vw,72px)] font-black leading-none transition-colors group-hover:text-naranja">{next.title}</span>
          </span>
          <Foot className="h-16 w-16 rotate-90 text-naranja transition-transform duration-500 ease-gecko group-hover:translate-x-3 group-hover:rotate-[120deg]" />
        </Link>
      </section>

      <CtaBand title="¿Querés algo así para tu proyecto?" to={landing} cta="Contanos tu proyecto" />
    </div>
  )
}
