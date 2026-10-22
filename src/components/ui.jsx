import { Link } from 'react-router'
import { Foot } from './Brand'
import { PatternFill } from './Patterns'
import Img from './Img'

const tones = {
  dark: 'bg-negro text-blanco hover:bg-carbon',
  orange: 'bg-naranja text-negro hover:bg-[#ff6a33]',
  white: 'bg-blanco text-negro hover:bg-papel',
  ghost: 'border-[1.5px] border-current bg-transparent hover:bg-current/10',
}

// Botón o link con la huella que avanza al pasar el cursor.
export function Button({ to, href, tone = 'dark', size = 'md', className = '', children, foot = true, ...rest }) {
  const sz = size === 'lg' ? 'px-7 pb-3.5 pt-2.5 text-[22px]' : size === 'sm' ? 'px-3.5 pb-1.5 pt-0.5 text-[16px]' : 'px-5 pb-2.5 pt-1.5 text-[19px]'
  const cls = `group inline-flex items-center gap-2.5 rounded-full font-extrabold transition-colors duration-200 disabled:opacity-40 ${tones[tone]} ${sz} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {foot && <Foot className="h-[0.8em] w-[0.8em] rotate-90 transition-transform duration-300 ease-gecko group-hover:translate-x-1 group-hover:rotate-[110deg]" />}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  if (href) return <a href={href} target="_blank" rel="noopener" className={cls} {...rest}>{inner}</a>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

export function Eyebrow({ children, className = 'text-naranja' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

// Marca visible solo en desarrollo para contenido que gecko todavía tiene que reemplazar.
export function Placeholder({ show, className = '' }) {
  if (!show || !import.meta.env.DEV) return null
  return <span className={`pointer-events-none absolute left-2.5 top-2.5 z-10 bg-blanco px-1.5 text-[11px] font-extrabold uppercase tracking-widest text-hondo ${className}`}>Contenido de ejemplo</span>
}

// Foto con el frame del manual. Sin `src` muestra un pattern de la marca en su lugar.
export function Photo({ src, alt = '', variant = 0, ratio = 'aspect-[4/3]', className = '', frame = true, sizes, eager, imgClass = '', children }) {
  return (
    <div className={`relative overflow-hidden bg-papel ${ratio} ${frame ? 'frame' : ''} ${className}`}>
      {src ? <Img src={src} alt={alt} sizes={sizes} eager={eager} className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
        : <PatternFill variant={variant} className="absolute inset-0" />}
      {children}
    </div>
  )
}

export function SectionHead({ eyebrow, title, intro, dark, className = '' }) {
  return (
    <div className={`grid max-w-[900px] gap-4 ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 data-split className="h-section">{title}</h2>
      {intro && <p data-reveal className={`max-w-[58ch] text-[clamp(19px,1.6vw,22px)] ${dark ? 'text-humo' : 'text-tinta2'}`}>{intro}</p>}
    </div>
  )
}
