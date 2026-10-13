import { gsap, SplitText, useGSAP } from './gsap'

const calm = '(prefers-reduced-motion: no-preference)'

// Animaciones de entrada declarativas dentro de `scope`:
//   data-split   → títulos que suben línea por línea
//   data-reveal  → bloques que suben y aparecen (data-reveal="stagger" anima sus hijos en cascada)
//   data-frame   → bloques con frame cuyo corte se cierra al entrar
export function useReveal(scope, deps = []) {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(calm, () => {
      const root = scope.current
      root.querySelectorAll('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 110, stagger: 0.09, duration: 1, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
        })
      })
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        const targets = el.dataset.reveal === 'stagger' ? el.children : el
        gsap.from(targets, {
          y: 44, opacity: 0, stagger: 0.08, duration: 0.9,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      // data-count="10" data-prefix="+" → cuenta desde 0 al entrar
      root.querySelectorAll('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count), pre = el.dataset.prefix || '', o = { n: 0 }
        gsap.to(o, {
          n: end, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = pre + Math.round(o.n) },
        })
      })
      root.querySelectorAll('[data-frame]').forEach((el) => {
        gsap.from(el, { '--chaflan': '64px', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    })
  }, { scope, dependencies: deps, revertOnUpdate: true })
}

export { gsap, useGSAP }
