import { imgSrc, imgSrcSet } from '../lib/media'

// Imagen responsive: elige entre 640 y 1600 px según el ancho en pantalla.
export default function Img({ src, alt = '', sizes = '(min-width: 1024px) 50vw, 100vw', className = '', eager = false, ...rest }) {
  if (!src) return null
  return (
    <img src={imgSrc(src)} srcSet={imgSrcSet(src)} sizes={sizes} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      className={className} {...rest} />
  )
}
