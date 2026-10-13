import { forwardRef } from 'react'
import { ISO, FOOT, FOOT_BOX, LETTERS } from '../brand/paths'

export function Logo({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 731 200" role="img" aria-label="gecko" className={className} {...rest}>
      <path fill="currentColor" fillRule="evenodd" d={ISO} />
      {LETTERS.map((d, i) => <path key={i} fill="currentColor" d={d} />)}
    </svg>
  )
}

// Same logo with separately addressable parts, for the GSAP entrance timeline.
export const AnimatedLogo = forwardRef(function AnimatedLogo({ className = '' }, ref) {
  return (
    <svg ref={ref} viewBox="0 0 731 200" role="img" aria-label="gecko" className={className} style={{ overflow: 'visible' }}>
      <path data-part="pent" fill="currentColor" fillRule="evenodd" d={ISO} />
      {LETTERS.map((d, i) => <path key={i} data-part="letter" fill="currentColor" d={d} />)}
    </svg>
  )
})

export function Foot({ className = '', ...rest }) {
  return (
    <svg viewBox={FOOT_BOX.join(' ')} aria-hidden="true" className={className} {...rest}>
      <path fill="currentColor" d={FOOT} />
    </svg>
  )
}

export function Iso({ className = '' }) {
  return (
    <svg viewBox="0 0 190 200" aria-hidden="true" className={className}>
      <path fill="currentColor" fillRule="evenodd" d={ISO} />
    </svg>
  )
}

export function logoTimeline(gsap, svg) {
  const pent = svg.querySelector('[data-part="pent"]')
  const letters = svg.querySelectorAll('[data-part="letter"]')
  return gsap.timeline()
    .from(pent, { scale: 0.2, rotate: -72, opacity: 0, transformOrigin: '50% 50%', duration: 1, ease: 'back.out(1.6)' })
    .from(letters, { yPercent: 70, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'power4.out' }, 0.45)
}
