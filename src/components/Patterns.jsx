import { useEffect, useRef } from 'react'
import { C, useCanvasLoop, drawWaves, drawWalker } from '../lib/canvas'
import { reduceMotion } from '../lib/gsap'

// Pattern I del manual, vivo. Combinaciones válidas: naranja/gris, blanco/naranja, gris/blanco.
export function Waves({ color = 'rgba(217,217,217,.45)', count = 36, walker = null, className = 'absolute inset-0 h-full w-full' }) {
  const ref = useCanvasLoop((ctx, w, h, t, ptr) => {
    ctx.clearRect(0, 0, w, h)
    drawWaves(ctx, w, h, t, ptr, color, count)
    if (walker) drawWalker(ctx, w, h, t, walker, h * 0.84, Math.max(20, Math.min(30, w / 50)))
  })
  return <canvas ref={ref} aria-hidden="true" className={className} />
}

const combos = { naranja: [C.gris, C.naranja], blanco: [C.blanco, C.naranja], gris: [C.blanco, C.gris], negro: ['#262626', C.naranja] }

// Pattern II del manual como piezas hexagonales que giran 60° al pasar el cursor.
export function Truchet({ combo = 'naranja', size = 30, className = 'absolute inset-0 h-full w-full', spin = false }) {
  const cv = useRef(null)
  useEffect(() => {
    const el = cv.current, ctx = el.getContext('2d')
    const s = { tiles: [], R: size, w: 0, h: 0, raf: 0 }
    const [bg, fg] = combos[combo]
    const still = reduceMotion()
    const draw = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, s.w, s.h)
      ctx.strokeStyle = fg; ctx.lineWidth = s.R * 0.44; ctx.lineCap = 'round'
      let moving = false
      for (const t of s.tiles) {
        if (Math.abs(t.to - t.a) > 0.001) { t.a += (t.to - t.a) * (still ? 1 : 0.14); moving = true }
        const v = []
        for (let k = 0; k < 6; k++) { const an = -Math.PI / 2 + (k * Math.PI) / 3 + t.a; v.push([t.x + s.R * Math.cos(an), t.y + s.R * Math.sin(an)]) }
        for (const k of [0, 2, 4]) {
          const p = v[k], n = v[(k + 1) % 6], q = v[(k + 5) % 6]
          const a1 = Math.atan2(n[1] - p[1], n[0] - p[0])
          let d = Math.atan2(q[1] - p[1], q[0] - p[0]) - a1
          while (d > Math.PI) d -= 2 * Math.PI
          while (d < -Math.PI) d += 2 * Math.PI
          ctx.beginPath(); ctx.arc(p[0], p[1], s.R / 2, a1, a1 + d, d < 0); ctx.stroke()
        }
      }
      s.raf = moving ? requestAnimationFrame(draw) : 0
    }
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(draw) }
    const build = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2)
      el.width = Math.max(1, r.width * dpr); el.height = Math.max(1, r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      s.w = r.width; s.h = r.height
      const hw = Math.sqrt(3) * s.R; s.tiles = []
      for (let row = -1; row * 1.5 * s.R < s.h + s.R * 2; row++)
        for (let col = -1; col * hw < s.w + hw; col++) {
          const a = (Math.random() < 0.5 ? 0 : 1) * (Math.PI / 3)
          s.tiles.push({ x: col * hw + (row % 2 ? hw / 2 : 0), y: row * 1.5 * s.R, a, to: a })
        }
      cancelAnimationFrame(s.raf); s.raf = 0; draw()
    }
    const ro = new ResizeObserver(build); ro.observe(el)
    let last = null
    const move = (e) => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
      let best = null, bd = Infinity
      for (const t of s.tiles) { const d = (t.x - x) ** 2 + (t.y - y) ** 2; if (d < bd) { bd = d; best = t } }
      if (best && best !== last) { best.to += Math.PI / 3; last = best; kick() }
    }
    const host = el.parentElement
    host.addEventListener('pointermove', move)
    // spin: unas piezas giran solas de vez en cuando (pantallas de espera y "gracias")
    const timer = spin && !still ? setInterval(() => { for (let i = 0; i < 4; i++) { const t = s.tiles[(Math.random() * s.tiles.length) | 0]; if (t) t.to += Math.PI / 3 } kick() }, 500) : 0
    return () => { ro.disconnect(); host.removeEventListener('pointermove', move); cancelAnimationFrame(s.raf); clearInterval(timer) }
  }, [combo, size, spin])
  return <canvas ref={cv} aria-hidden="true" className={className} />
}

// Relleno de marca para fotos que todavía no existen. Se reemplaza por <img> cuando gecko entregue el material.
export function PatternFill({ variant = 0, className = '' }) {
  const bgs = [
    'bg-[repeating-radial-gradient(circle_at_20%_110%,var(--color-naranja)_0_9px,var(--color-gris)_9px_18px)]',
    'bg-[repeating-linear-gradient(170deg,#fff_0_8px,var(--color-naranja)_8px_10px)]',
    'bg-[repeating-radial-gradient(circle_at_80%_-10%,var(--color-gris)_0_7px,#fff_7px_14px)]',
    'bg-[repeating-linear-gradient(10deg,var(--color-naranja)_0_7px,var(--color-gris)_7px_9px)]',
  ]
  return <div className={`${bgs[variant % bgs.length]} ${className}`} />
}
