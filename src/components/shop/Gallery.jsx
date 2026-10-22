import { useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { imgSrc, isGenerated } from '../../lib/media'
import Img from '../Img'
import { Placeholder } from '../ui'
import { PatternFill } from '../Patterns'

// Galería con miniaturas, cambio con fundido y zoom que sigue al cursor.
export default function Gallery({ product, variant = 0 }) {
  const slides = product.images?.length ? product.images : [null]
  const [idx, setIdx] = useState(0)
  const stage = useRef(null)
  const zoomRef = useRef(null)

  const pick = (k) => {
    if (k === idx) return
    gsap.fromTo(stage.current, { opacity: 0.2, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
    setIdx(k)
  }
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    gsap.to(zoomRef.current, { scale: 1.6, transformOrigin: `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`, duration: 0.4 })
  }
  const leave = () => gsap.to(zoomRef.current, { scale: 1, duration: 0.5 })
  const s = slides[idx]

  return (
    <div className="grid gap-3">
      <div className="frame relative aspect-square cursor-zoom-in overflow-hidden bg-papel" onPointerMove={move} onPointerLeave={leave}>
        <div ref={stage} className="absolute inset-0">
          <div ref={zoomRef} className="absolute inset-0">
            {s ? <img src={imgSrc(s, 1600)} alt={product.name} className="h-full w-full object-cover" /> : <PatternFill variant={variant} className="absolute inset-0" />}
          </div>
        </div>
        <Placeholder show={product.placeholder} />
        {isGenerated(s) && <span className="absolute bottom-3 left-3 bg-blanco/85 px-2 pb-0.5 text-[13px] font-bold text-tinta2">Imagen ilustrativa</span>}
        {slides.length > 1 && <span className="absolute bottom-3 right-3 bg-negro px-2 pb-0.5 text-[14px] font-bold tabular-nums text-blanco">{idx + 1} / {slides.length}</span>}
      </div>
      {slides.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="tablist" aria-label="Fotos del producto">
          {slides.map((t, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === idx} aria-label={`Foto ${k + 1}`} onClick={() => pick(k)}
              className={`frame relative aspect-square overflow-hidden [--chaflan:10px] transition-opacity ${k === idx ? 'outline-3 outline-offset-2 outline-naranja' : 'opacity-60 hover:opacity-100'}`}>
              <Img src={t} alt="" sizes="120px" className="absolute inset-0 h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
