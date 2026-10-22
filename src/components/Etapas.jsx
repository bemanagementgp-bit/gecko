import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { isGenerated } from '../lib/media'
import { Foot } from './Brand'
import Img from './Img'
import { VideoLoop } from './Video'

// "Del diseño a la obra": etapas del proyecto. En pantallas anchas la sección se fija
// y las etapas pasan en horizontal con el scroll; una huella marca el avance.
export default function Etapas({ etapas, title = 'Del diseño a la obra.' }) {
  const root = useRef(null)
  const track = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => track.current.scrollWidth - track.current.parentElement.clientWidth
      const move = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
      gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true } })
      gsap.utils.toArray('[data-etapa]', root.current).forEach((el) => {
        gsap.from(el.querySelectorAll('[data-in]'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 80%', once: true } })
      })
    })
  }, { scope: root, dependencies: [etapas.length], revertOnUpdate: true })

  return (
    <section ref={root} className="overflow-hidden bg-negro text-blanco lg:flex lg:h-screen lg:flex-col lg:justify-center">
      <div className="wrap grid gap-3 pt-[clamp(56px,8vw,100px)] lg:pt-0">
        <p className="eyebrow text-naranja">Paso a paso</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 data-split className="h-section">{title}</h2>
          <div className="relative hidden h-[3px] w-[280px] bg-carbon lg:block" aria-hidden="true">
            <div data-progress className="h-full origin-left bg-naranja" />
          </div>
        </div>
      </div>
      <div className="mt-8 pb-[clamp(56px,8vw,100px)] lg:pb-0 lg:pl-[max(32px,calc((100vw-1280px)/2+32px))]">
        <ol ref={track} className="wrap grid gap-6 lg:m-0 lg:flex lg:w-max lg:max-w-none lg:gap-6 lg:p-0 lg:pr-[10vw]">
          {etapas.map((e, i) => (
            <li key={i} data-etapa className="grid content-start gap-4 lg:w-[min(520px,40vw)]">
              <div className="frame relative aspect-[4/3] overflow-hidden bg-carbon [--chaflan:20px]">
                {e.video ? <VideoLoop src={e.video} label={e.title} /> : <Img src={e.image} alt={e.title} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}
                {!e.video && isGenerated(e.image) && <span className="absolute bottom-2 right-2 bg-negro/75 px-2 pb-0.5 text-[13px] font-bold text-humo">Imagen ilustrativa</span>}
              </div>
              <div data-in className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-naranja text-[19px] font-black text-negro">{i + 1}</span>
                <h3 className="text-[32px]">{e.title}</h3>
                {i < etapas.length - 1 && <Foot className="ml-auto hidden h-6 w-6 rotate-90 text-naranja lg:block" />}
              </div>
              <p data-in className="max-w-[46ch] text-[19px] text-humo">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
