import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/motion'
import { ISO } from '../brand/paths'
import { Foot } from '../components/Brand'
import { Photo, Placeholder, SectionHead } from '../components/ui'
import { Truchet, Waves } from '../components/Patterns'
import { CtaBand, Stat } from '../components/blocks'
import { usePublic } from '../lib/content'
import { VideoLoop, Reels } from '../components/Video'
import Img from '../components/Img'

// Equipo según el Plan de Acción de gecko. TODO gecko: confirmar nombres públicos, roles y fotos.
const equipo = [
  ['Rodrigo', 'Diseñador industrial', 'Proyectos y coordinación general. Diseña para comercios e interpreta proyectos de estudios.'],
  ['Renzo', 'Diseñador gráfico', 'Área gráfica y servicios rápidos: impresión, corte, asesoramiento y catálogo.'],
  ['Agustín', 'Diseñador industrial', 'Producción en taller y ejecución en obra. Instalaciones de mediana y gran escala.'],
  ['Emanuel', 'Taller', 'Producción, montaje e instalaciones.'],
]
const maquinas = [
  ['Router CNC', 'Corte y fresado de MDF, acrílico, PVC y polifan.'],
  ['Corte láser', 'Precisión para acrílico, madera y piezas finas.'],
  ['Impresión de gran formato', 'Vinilos, lonas y placas laminadas.'],
  ['Impresión 3D', 'Prototipos, piezas especiales y maquetas.'],
  ['Plotter de corte', 'Vinilo de corte y stickers troquelados.'],
  ['Armado y terminación', 'Pintura, ensamble y control de calidad.'],
]
const valores = ['Adaptabilidad', 'Innovación', 'Honestidad', 'Compromiso', 'Creatividad']

// La historia: dos líneas que corren en paralelo y se unen en gecko, dibujadas con el scroll.
function Historia() {
  const root = useRef(null)
  useGSAP(() => {
    const lines = gsap.utils.toArray('[data-draw]')
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      lines.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }) })
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
        .to(lines.slice(0, 2), { strokeDashoffset: 0, ease: 'none', duration: 2 })
        .to(lines[2], { strokeDashoffset: 0, ease: 'none', duration: 0.8 })
        .from('[data-iso]', { scale: 0, rotate: -90, transformOrigin: '50% 50%', ease: 'back.out(2)', duration: 0.6 })
        .from('[data-label]', { opacity: 0, y: 10, stagger: 0.1, duration: 0.4 }, 0.2)
    })
  }, { scope: root })
  return (
    <div ref={root} className="frame bg-negro p-[clamp(20px,3vw,40px)] text-blanco">
      <svg viewBox="0 0 900 230" role="img" className="h-auto w-full" aria-label="INOVO Industrial y ERRE Comunicación Visual recorren más de 10 años en paralelo y se unen en gecko">
        <path data-draw fill="none" stroke="#9A938D" strokeWidth="6" strokeLinecap="round" d="M20 50 H420 C520 50 540 118 610 118" />
        <path data-draw fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" d="M20 186 H420 C520 186 540 118 610 118" />
        <path data-draw fill="none" stroke="#F15A24" strokeWidth="10" strokeLinecap="round" d="M610 118 H800" />
        <g className="font-sans font-extrabold">
          <text data-label x="20" y="32" fontSize="24" fill="#BDB6B0">INOVO Industrial</text>
          <text data-label x="20" y="222" fontSize="24" fill="#FFFFFF">ERRE Comunicación Visual</text>
          <text data-label x="210" y="124" fontSize="22" fill="#BDB6B0" textAnchor="middle">+10 años en paralelo</text>
          <text data-label x="640" y="100" fontSize="20" fill="#F15A24">fusión</text>
        </g>
        <g data-iso><path transform="translate(806 86) scale(.33)" fill="#F15A24" fillRule="evenodd" d={ISO} /></g>
      </svg>
    </div>
  )
}

export default function Taller() {
  const { tallerClips, reels } = usePublic()
  const root = useRef(null)
  useReveal(root)
  return (
    <div ref={root}>
      <title>El taller · gecko</title>
      <meta name="description" content="gecko nace de la fusión de INOVO Industrial y ERRE Comunicación Visual. Diseño industrial y gráfico con taller propio en La Plata." />

      <section className="relative overflow-hidden bg-naranja text-blanco">
        <Waves walker="rgba(255,255,255,.5)" />
        <div className="wrap relative grid gap-6 py-[clamp(64px,9vw,130px)]">
          <p className="eyebrow">El taller y el equipo</p>
          <h1 data-split className="display max-w-[12ch]">Dos marcas, una sola huella.</h1>
          <p data-reveal className="lead max-w-[46ch]">Somos la fusión de INOVO Industrial y ERRE Comunicación Visual. Diseñadores industriales y gráficos de la UNLP que decidimos unir el estudio y el taller.</p>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-10">
          <SectionHead eyebrow="Nuestra historia" title="Más de diez años en paralelo. Ahora, juntos." intro="Durante una década crecimos por separado: uno desde la fabricación y el diseño industrial, el otro desde la gráfica y la comunicación visual. gecko junta las dos cosas para acompañar cada proyecto desde la idea hasta la instalación." />
          <Historia />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat n={10} prefix="+" label="años de oficio" />
            <Stat n={2} label="marcas fusionadas" />
            <Stat n={3} label="unidades de servicio" />
            <Stat n={100} suffix="%" label="producción in-house" />
          </div>
        </div>
      </section>

      <section className="bg-negro py-[clamp(64px,9vw,120px)] text-blanco">
        <div className="wrap grid gap-10">
          <SectionHead dark eyebrow="Equipamiento" title="Las máquinas son la prueba, no el producto." intro="Tener el taller propio nos deja controlar calidad, plazos y costos en cada pieza." />
          <div data-reveal="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {maquinas.map(([t, d], i) => (
              <div key={t} className="frame group relative grid min-h-[200px] content-end overflow-hidden bg-carbon p-6">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"><Truchet combo="negro" size={20} /></div>
                <span className="absolute right-5 top-4 text-[48px] font-black text-[#3a3a3a]">0{i + 1}</span>
                <h3 className="relative text-[30px]">{t}</h3>
                <p className="relative text-[18px] text-humo">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4" data-reveal="stagger">
            {tallerClips.map((v) => (
              <figure key={v.src} className="frame relative m-0 aspect-[3/4] overflow-hidden bg-carbon [--chaflan:16px]">
                <VideoLoop src={v.src} label={v.label} />
                <figcaption className="absolute bottom-2 left-2 bg-negro/80 px-2 pb-0.5 text-[14px] font-bold">{v.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blanco py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-10">
          <SectionHead eyebrow="El equipo" title="Las personas detrás de cada pieza." />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div data-frame className="frame relative aspect-[3/4] overflow-hidden bg-papel sm:aspect-[4/3] lg:aspect-auto">
              <Img src="/media/taller/equipo" alt="El equipo de gecko trabajando en el taller" sizes="(min-width: 1024px) 55vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div data-reveal="stagger" className="grid content-start gap-5">
              {equipo.map(([n, r, d]) => (
                <div key={n} className="grid gap-1 border-t-2 border-negro pt-3">
                  <b className="text-[28px] leading-tight">{n}</b><span className="text-[17px] font-bold text-hondo">{r}</span><p className="text-[17px] text-tinta2">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-papel py-[clamp(64px,9vw,120px)]">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div className="grid content-start gap-6">
            <SectionHead eyebrow="Por qué un gecko" title="Se adapta, se adhiere, deja huella." />
            <p data-reveal className="text-[20px] text-tinta2">El gecko se adapta a cualquier terreno, como nosotros a cada proyecto. Se adhiere a cualquier superficie, como los vinilos que producimos. Y deja su huella: la que queremos dejar en la ciudad con cada trabajo.</p>
          </div>
          <div className="grid content-start gap-8">
            <div data-reveal className="grid gap-2"><p className="eyebrow text-hondo">Misión</p><p className="text-[24px] font-bold leading-snug">Brindar soluciones creativas, innovadoras y adaptables que potencien la comunicación visual de nuestros clientes.</p></div>
            <div data-reveal className="grid gap-2"><p className="eyebrow text-hondo">Visión</p><p className="text-[24px] font-bold leading-snug">Ser un referente en diseño de calidad y soluciones gráficas, arquigráficas y visuales para profesionales, emprendedores, comercios y grandes marcas.</p></div>
            <div data-reveal="stagger" className="flex flex-wrap gap-2">
              {valores.map((v, i) => <span key={v} className="flex items-center gap-2 rounded-full bg-negro px-4 pb-2 pt-1 text-[19px] font-extrabold text-blanco"><Foot className="h-4 w-4 text-naranja" style={{ rotate: `${i * 40}deg` }} />{v}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-negro py-[clamp(64px,9vw,120px)] text-blanco">
        <div className="wrap grid gap-10">
          <SectionHead dark eyebrow="Reels" title="El taller, en primera persona." />
          <Reels reels={reels} />
        </div>
      </section>

      <CtaBand title="Vení a conocer el taller." text="Coordinamos una visita para que veas cómo trabajamos y charlemos tu proyecto." cta="Coordinar una visita" />
    </div>
  )
}
