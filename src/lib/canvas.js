import { useEffect, useRef } from 'react'
import { FOOT, FOOT_BOX } from '../brand/paths'
import { reduceMotion } from './gsap'

export const C = { naranja: '#F15A24', negro: '#1A1A1A', gris: '#D9D9D9', blanco: '#FFFFFF' }

let footPath
const getFoot = () => (footPath ??= new Path2D(FOOT))

// The logo footprint's toes point up-right; this offset turns them toward +x.
export const TOE = Math.PI / 4

export function stampFoot(ctx, x, y, size, ang, mirror, alpha, color) {
  const [bx, by, bw, bh] = FOOT_BOX
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.rotate(ang)
  const sc = size / Math.max(bw, bh)
  ctx.scale(mirror ? -sc : sc, sc)
  ctx.translate(-(bx + bw / 2), -(by + bh / 2))
  ctx.fill(getFoot())
  ctx.restore()
}

// Pattern I: horizontal lines, flatter at the top and wavier toward the bottom, parted by the pointer.
export function drawWaves(ctx, w, h, t, ptr, color, count) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.3
  for (let i = 0; i < count; i++) {
    const y0 = ((i + 0.5) * h) / count
    const amp = 2 + (i / count) * 18
    ctx.beginPath()
    for (let x = -10; x <= w + 10; x += 8) {
      let y = y0 + amp * Math.sin(x * 0.0065 + t * 0.0005 + i * 0.18)
      if (ptr.x != null) {
        const dx = x - ptr.x, dy = y - ptr.y
        y += (dy >= 0 ? 1 : -1) * 38 * Math.exp(-(dx * dx + dy * dy) / (2 * 90 * 90))
      }
      x <= -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

// A gecko crossing the canvas: alternating left/right prints that fade after landing.
export function drawWalker(ctx, w, h, t, color, yBase, size = 26) {
  const step = size * 2.5
  const period = Math.ceil((w + 200) / step) * 170 + 2200
  const tt = t % period
  for (let k = 0; ; k++) {
    const born = k * 170
    if (born > tt) break
    const age = tt - born, life = 2400
    if (age > life) continue
    const x = -60 + k * step
    const yc = yBase + Math.sin(x * 0.008) * h * 0.12
    const dir = Math.atan2(Math.cos(x * 0.008) * 0.008 * h * 0.12, 1)
    const side = k % 2 ? 1 : -1
    const off = size * 0.7
    const a = age < 200 ? age / 200 : 1 - (age - 200) / (life - 200)
    stampFoot(ctx, x - Math.sin(dir) * side * off, yc + Math.cos(dir) * side * off, size, dir + TOE + side * 0.35, side < 0, Math.max(0, a), color)
  }
}

// Sizes a canvas to its box at device resolution and runs `draw` every frame while it is on screen.
export function useCanvasLoop(draw, { animate = true } = {}) {
  const ref = useRef(null)
  const ptr = useRef({ x: null, y: null })
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let size = { w: 0, h: 0 }, raf = 0, onScreen = true
    const still = reduceMotion() || !animate

    const fit = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2)
      cv.width = Math.max(1, r.width * d)
      cv.height = Math.max(1, r.height * d)
      ctx.setTransform(d, 0, 0, d, 0, 0)
      size = { w: r.width, h: r.height }
      if (still) paint(1400)
    }
    const paint = (t) => drawRef.current(ctx, size.w, size.h, t, ptr.current)
    const loop = (t) => { paint(t); if (onScreen) raf = requestAnimationFrame(loop) }

    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    fit()
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      cancelAnimationFrame(raf)
      if (onScreen && !still) raf = requestAnimationFrame(loop)
    })
    io.observe(cv)

    const host = cv.parentElement
    const move = (e) => {
      const r = cv.getBoundingClientRect()
      ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (still) paint(1400)
    }
    const leave = () => { ptr.current = { x: null, y: null }; if (still) paint(1400) }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave)
    }
  }, [animate])

  return ref
}

export function trailURI(fill, vertical) {
  const [bx, by, bw, bh] = FOOT_BOX
  const s = 28, sc = 14 / Math.max(bw, bh)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'><g transform='translate(${s / 2} ${s / 2}) rotate(${vertical ? 135 : 45}) scale(${sc}) translate(${-(bx + bw / 2)} ${-(by + bh / 2)})'><path fill='${fill}' d='${FOOT}'/></g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
