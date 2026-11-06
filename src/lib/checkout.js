import { waLink, money } from '../config'
import { track, utm } from './track'

// Por ahora el pedido se cierra por WhatsApp: armamos el mensaje con el detalle y gecko
// confirma total, envío y forma de pago desde el chat.
// Para cobrar online más adelante: crear un backend que genere el pago y reemplazar sendOrder.

export function orderMessage({ items, total, cliente = {} }) {
  const lines = ['¡Hola gecko! Quiero hacer este pedido desde la tienda:', '']
  items.forEach((i) => {
    const opts = Object.values(i.options || {}).filter(Boolean).join(' · ')
    lines.push(`• ${i.qty} × ${i.name}${opts ? ` (${opts})` : ''} — ${money(i.price * i.qty)}`)
    if (i.file) lines.push(`   Archivo: ${i.file}`)
  })
  lines.push('', `Subtotal: ${money(total)}`)
  if (cliente.entrega) lines.push(`Entrega: ${cliente.entrega}${cliente.localidad ? ` · ${cliente.localidad}` : ''}`)
  if (cliente.nombre) lines.push(`Nombre: ${cliente.nombre}`)
  if (cliente.notas) lines.push(`Notas: ${cliente.notas}`)
  if (items.some((i) => i.file)) lines.push('', 'Les adjunto los archivos de diseño en este chat.')
  lines.push('', '¿Me confirman el total y cómo seguimos?')
  return lines.join('\n')
}

// Abre WhatsApp con el pedido. Se llama directo desde el clic para que el navegador no lo bloquee.
export function sendOrder(order) {
  const url = waLink(orderMessage(order))
  track('InitiateCheckout', { value: order.total, currency: 'ARS', num_items: order.items.reduce((n, i) => n + i.qty, 0), content_ids: order.items.map((i) => i.slug) })
  track('Contact', { method: 'whatsapp', page: 'carrito', ...utm() })
  const w = window.open(url, '_blank')
  if (w) w.opener = null
  else location.href = url // bloqueador de ventanas: se abre en la misma pestaña
  return url
}
