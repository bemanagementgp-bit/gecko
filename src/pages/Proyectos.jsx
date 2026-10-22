import { useLayoutEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { gsap, Flip } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { services } from '../data/services'
import { usePublic } from '../lib/content'
import { ProjectCard, CtaBand } from '../components/blocks'
import { Truchet } from '../components/Patterns'
import PageHero, { HeroChip } from '../components/PageHero'

function Filter({ label, options, value, onChange }) {
  return (
    <div className="grid gap-2">
      <span className="eyebrow !text-[14px] text-tinta2">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {[['', 'Todos'], ...options].map(([v, l]) => (
          <button key={v || 'all'} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
            className={`rounded-full border-[1.5px] px-4 pb-2 pt-1 text-[18px] font-bold transition-colors ${value === v ? 'border-negro bg-negro text-blanco' : 'border-negro/25 hover:border-negro'}`}>{l}</button>
        ))}
      </div>
    </div>
  )
}

export default function Proyectos() {
  const { projects } = usePublic()
  const rubros = [...new Set(projects.map((p) => p.rubro).filter(Boolean))]
  const root = useRef(null)
  const grid = useRef(null)
  const flipState = useRef(null)
  const [params, setParams] = useSearchParams()
  const unidad = params.get('unidad') || ''
  const rubro = params.get('rubro') || ''
  useReveal(root)

  // Flip: se guarda la posición de las tarjetas antes de filtrar y se animan a la nueva grilla.
  const update = (key, v) => {
    flipState.current = Flip.getState(grid.current.children)
    const next = new URLSearchParams(params)
    v ? next.set(key, v) : next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.7, ease: 'power3.inOut', stagger: 0.03, absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
    })
    flipState.current = null
  }, [unidad, rubro])

  const list = projects.filter((p) => (!unidad || p.unit === unidad) && (!rubro || p.rubro === rubro))

  return (
    <div ref={root}>
      <title>Proyectos · gecko</title>
      <meta name="description" content="Fachadas, cartelería, stands, exhibidores y producción gráfica realizados por gecko." />
      <PageHero eyebrow="Proyectos" title="Cada proyecto, una huella en la ciudad."
        lead="Casos reales contados de punta a punta: qué necesitaba el cliente, cómo lo resolvimos y con qué productos."
        media={{ type: 'mosaic', images: projects.flatMap((p) => [p.cover, ...(p.gallery || []).slice(0, 2)]).filter(Boolean).slice(0, 24) }}
        stats={[[projects.length, 'Obras'], [rubros.length, 'Rubros'], [3, 'Unidades'], [new Set(projects.flatMap((p) => p.products || [])).size, 'Productos en la tienda']]}>
        <HeroChip solid to="/contacto">Contanos tu proyecto</HeroChip>
        <HeroChip onClick={() => document.getElementById('obras')?.scrollIntoView({ behavior: 'smooth' })}>Ver las obras</HeroChip>
      </PageHero>

      <section id="obras" className="scroll-mt-20 bg-blanco py-[clamp(48px,7vw,96px)]">
        <div className="wrap grid gap-10">
          <div data-reveal className="grid gap-5 border-b border-linea pb-8 lg:grid-cols-2">
            <Filter label="Unidad" options={services.map((s) => [s.slug, s.name])} value={unidad} onChange={(v) => update('unidad', v)} />
            <Filter label="Rubro" options={rubros.map((r) => [r, r])} value={rubro} onChange={(v) => update('rubro', v)} />
          </div>
          <p className="text-[18px] font-bold text-tinta2" aria-live="polite">{list.length} {list.length === 1 ? 'proyecto' : 'proyectos'}</p>
          <div ref={grid} className="grid gap-x-5 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => <div key={p.slug} data-flip-id={p.slug}><ProjectCard p={p} i={i} /></div>)}
          </div>
          {list.length === 0 && <p className="text-[22px] font-bold">No hay proyectos con esos filtros todavía.</p>}
        </div>
      </section>

      <CtaBand title="El próximo puede ser el tuyo." />
    </div>
  )
}
