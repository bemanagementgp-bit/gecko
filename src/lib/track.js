// Medición: Meta Pixel + GA4. Los IDs vienen de .env; sin IDs no se carga nada y track() sólo registra en consola en desarrollo.
const PIXEL = import.meta.env.VITE_META_PIXEL_ID
const GA4 = import.meta.env.VITE_GA4_ID

function loadScript(src) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function initTracking() {
  if (PIXEL && !window.fbq) {
    const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments) }
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = []
    window.fbq = window._fbq = fbq
    loadScript('https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', PIXEL)
  }
  if (GA4 && !window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA4, { send_page_view: false })
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4}`)
  }
}

// Nombres de Meta → nombres de GA4
const gaName = {
  PageView: 'page_view', ViewContent: 'view_item', Contact: 'contact', Lead: 'generate_lead',
  AddToCart: 'add_to_cart', InitiateCheckout: 'begin_checkout', Purchase: 'purchase',
}

// Un event_id compartido permite a Meta deduplicar el evento del navegador con el que mande CAPI desde el servidor.
export function track(event, params = {}) {
  const eventID = `${event}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  if (window.fbq) window.fbq('track', event, params, { eventID })
  if (window.gtag) window.gtag('event', gaName[event] || event, params)
  if (import.meta.env.DEV) console.info('[track]', event, params)
  return eventID
}

// UTM de la primera visita, para saber qué campaña trajo cada consulta.
export function utm() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('gecko-utm') || 'null')
    if (saved) return saved
    const q = new URLSearchParams(location.search)
    const data = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].filter((k) => q.get(k)).map((k) => [k, q.get(k)]))
    sessionStorage.setItem('gecko-utm', JSON.stringify(data))
    return data
  } catch {
    return {}
  }
}
