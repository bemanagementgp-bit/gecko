// Datos de contacto y cuentas. Los valores marcados TODO los tiene que confirmar gecko.
export const site = {
  name: 'gecko',
  tagline: 'Soluciones creativas',
  claim: 'Diseñamos. Fabricamos. Instalamos.',
  whatsapp: import.meta.env.VITE_WHATSAPP || '5492210000000', // TODO: número real de WhatsApp Business
  email: 'hola@gecko.estudio', // TODO: confirmar casilla
  instagram: 'gecko.estudio',
  city: 'La Plata, Buenos Aires',
  address: 'Dirección del taller', // TODO: dirección real para retiro y mapa
  hours: 'Lunes a viernes de 9 a 18 h', // TODO: confirmar horario de retiro
  url: 'https://gecko.estudio', // TODO: dominio definitivo
}

export const waLink = (text = '') =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const money = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
