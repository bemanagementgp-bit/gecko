import { waLink, money } from '../config'
import { track, utm } from './track'
import { cartFiles } from './cart'

const ENDPOINT = import.meta.env.VITE_CHECKOUT_ENDPOINT

// 'mercadopago' cuando hay backend de pago configurado; 'whatsapp' mientras tanto.
export const checkoutMode = ENDPOINT ? 'mercadopago' : 'whatsapp'

// Inicia el pago del carrito.
// Con VITE_CHECKOUT_ENDPOINT: se envía el pedido (con los archivos) y el backend responde { init_point } de Mercado Pago.
// Sin endpoint (hasta que se defina la plataforma de la tienda): el pedido se envía por WhatsApp para confirmar y cobrar.
export async function startCheckout({ items, total, cliente }) {
  const eventId = track('InitiateCheckout', { value: total, currency: 'ARS', num_items: items.reduce((n, i) => n + i.qty, 0), content_ids: items.map((i) => i.slug) })

  if (ENDPOINT) {
    const body = new FormData()
    body.append('pedido', JSON.stringify({ items, total, cliente, utm: utm(), eventId }))
    items.forEach((i) => { const f = cartFiles.get(i.key); if (f) body.append(`archivo:${i.key}`, f) })
    const res = await fetch(ENDPOINT, { method: 'POST', body })
    if (!res.ok) throw new Error('No pudimos iniciar el pago. Probá de nuevo o terminá tu pedido por WhatsApp.')
    const { init_point } = await res.json()
    location.href = init_point
    return { via: 'mercadopago' }
  }

  const lines = [
    'Hola gecko, quiero hacer este pedido desde la tienda:',
    ...items.map((i) => `• ${i.qty} × ${i.name} (${Object.values(i.options).join(', ')}) — ${money(i.price * i.qty)}${i.file ? ` · archivo: ${i.file}` : ''}`),
    `Total: ${money(total)}`,
    `Entrega: ${cliente.entrega}${cliente.direccion ? ` — ${cliente.direccion}, ${cliente.localidad} (${cliente.cp})` : ''}`,
    `Nombre: ${cliente.nombre}${cliente.telefono ? ` · Tel: ${cliente.telefono}` : ''}${cliente.email ? ` · ${cliente.email}` : ''}`,
    cliente.factura ? `Factura A · CUIT ${cliente.cuit}` : '',
    cliente.notas ? `Notas: ${cliente.notas}` : '',
  ].filter(Boolean)
  if (items.some((i) => i.file)) lines.push('Les adjunto los archivos en este chat.')
  window.open(waLink(lines.join('\n')), '_blank', 'noopener')
  return { via: 'whatsapp' }
}
