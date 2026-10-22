import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../lib/gsap'
import { imgSrc } from '../lib/media'

// Visor de fotos a pantalla completa, con flechas del teclado.
export default function Lightbox({ images, index, onIndex, onClose, title = '' }) {
  const img = useRef(null)
  const open = index != null
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start() }
  }, [open, index, images.length, onIndex, onClose])
  useEffect(() => { if (open && img.current) gsap.fromTo(img.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.35 }) }, [open, index])
  if (!open) return null
  const go = (d) => onIndex((index + d + images.length) % images.length)
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${title}, foto ${index + 1} de ${images.length}`} className="fixed inset-0 z-[95] grid grid-rows-[auto_1fr_auto] bg-negro/95 text-blanco">
      <div className="flex items-center justify-between p-4">
        <span className="text-[17px] font-bold tabular-nums">{title} · {index + 1} / {images.length}</span>
        <button type="button" onClick={onClose} aria-label="Cerrar" autoFocus className="grid h-11 w-11 place-items-center rounded-full bg-blanco text-[24px] font-black text-negro">×</button>
      </div>
      <div className="relative grid min-h-0 place-items-center px-4" onClick={onClose}>
        <img ref={img} src={imgSrc(images[index], 1600)} alt="" onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); go(-1) }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-blanco/90 text-[24px] font-black text-negro">‹</button>
            <button type="button" aria-label="Foto siguiente" onClick={(e) => { e.stopPropagation(); go(1) }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-blanco/90 text-[24px] font-black text-negro">›</button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto p-3" data-lenis-prevent>
        {images.map((s, i) => (
          <button key={s + i} type="button" onClick={() => onIndex(i)} aria-label={`Foto ${i + 1}`}
            className={`h-16 w-20 shrink-0 overflow-hidden transition-opacity ${i === index ? 'outline-2 outline-naranja' : 'opacity-50 hover:opacity-100'}`}>
            <img src={imgSrc(s, 640)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
