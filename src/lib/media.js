// Convención de imágenes del sitio:
//   "/media/p/x/cover" o "https://…/uploads/abc"  → ruta base, existen -640.webp y -1600.webp
//   "data:…", "blob:…" o un archivo con extensión  → se usa tal cual
const direct = (s) => /^(data:|blob:)/.test(s) || /\.(webp|jpe?g|png|gif|avif|svg)(\?|$)/i.test(s)

export function imgSrc(base, w = 1600) {
  if (!base) return ''
  return direct(base) ? base : `${base}-${w >= 1000 ? 1600 : 640}.webp`
}

export function imgSrcSet(base) {
  if (!base || direct(base)) return undefined
  return `${base}-640.webp 640w, ${base}-1600.webp 1600w`
}

// Imágenes de ejemplo generadas con IA: se marcan como ilustrativas hasta reemplazarlas.
export const isGenerated = (s) => typeof s === 'string' && s.includes('/media/generado/')

export const videoSrc = (base) => (base?.endsWith('.mp4') ? base : `${base}.mp4`)
export const posterSrc = (base) => (base?.endsWith('.mp4') ? base.replace(/\.mp4$/, '.webp') : `${base}.webp`)
export const reelSrc = (slug) => `/media/reels/${slug}.mp4`
export const reelPoster = (slug) => `/media/reels/${slug}.webp`

// Redimensiona una imagen en el navegador y la devuelve como WebP (para subir desde el panel).
export async function resizeToWebp(file, max) {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k)
  c.height = Math.round(bmp.height * k)
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
  return new Promise((res) => c.toBlob(res, 'image/webp', 0.8))
}
