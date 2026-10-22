import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { videoSrc, posterSrc, reelSrc, reelPoster } from '../lib/media'
import { reduceMotion } from '../lib/gsap'

// Clip mudo en loop: solo se reproduce mientras está en pantalla (ahorra batería y datos).
export function VideoLoop({ src, className = '', label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || reduceMotion()) return
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause() }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [src])
  return (
    <video ref={ref} src={videoSrc(src)} poster={posterSrc(src)} muted loop playsInline preload="none" aria-label={label}
      className={`h-full w-full object-cover ${className}`} />
  )
}

// Reel vertical: muestra el póster y abre el reproductor con sonido.
export function ReelCard({ reel, onOpen, className = '' }) {
  return (
    <button type="button" onClick={() => onOpen(reel)} className={`frame group relative aspect-[9/16] overflow-hidden bg-negro text-left [--chaflan:16px] ${className}`}>
      <img src={reelPoster(reel.slug)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gecko group-hover:scale-105" />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(26,26,26,.85))]" />
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-negro transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5L7 4.5Z" /></svg>
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 text-[19px] font-extrabold leading-tight text-blanco">{reel.title}</span>
    </button>
  )
}

export function ReelModal({ reel, onClose }) {
  const close = useRef(null)
  useEffect(() => {
    if (!reel) return
    window.__lenis?.stop()
    close.current?.focus()
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start() }
  }, [reel, onClose])
  if (!reel) return null
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={reel.title} className="fixed inset-0 z-[95] grid place-items-center bg-negro/90 p-4" onClick={onClose}>
      <div className="relative h-[min(86vh,820px)] aspect-[9/16] max-w-full" onClick={(e) => e.stopPropagation()}>
        <video src={reelSrc(reel.slug)} poster={reelPoster(reel.slug)} controls autoPlay playsInline className="frame h-full w-full bg-negro object-contain [--chaflan:18px]" />
        <button ref={close} type="button" onClick={onClose} aria-label="Cerrar video" className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-full bg-blanco text-[24px] font-black text-negro sm:-right-14 sm:top-0">×</button>
      </div>
    </div>,
    document.body,
  )
}

// Fila de reels con su reproductor.
export function Reels({ reels, className = '' }) {
  const [open, setOpen] = useState(null)
  return (
    <>
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
        {reels.map((r) => <ReelCard key={r.slug} reel={r} onOpen={setOpen} />)}
      </div>
      <ReelModal reel={open} onClose={() => setOpen(null)} />
    </>
  )
}
