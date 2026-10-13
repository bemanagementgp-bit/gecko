import { waLink } from '../config'
import { track, utm } from './track'

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

// Envía una consulta. Con VITE_LEAD_ENDPOINT configurado la manda como JSON (CRM / automatización);
// si no, arma el mensaje y abre WhatsApp. En ambos casos dispara Lead con el mismo event_id que va al CRM.
export async function sendLead({ origen, perfil, datos, archivos = [] }) {
  const eventId = track('Lead', { content_category: perfil, content_name: origen })
  const payload = { origen, perfil, datos, archivos: archivos.map((f) => f.name), utm: utm(), eventId, pagina: location.pathname, fecha: new Date().toISOString(), etapa: 'Nuevo' }

  if (ENDPOINT) {
    const body = new FormData()
    body.append('payload', JSON.stringify(payload))
    archivos.forEach((f) => body.append('archivos', f))
    const res = await fetch(ENDPOINT, { method: 'POST', body })
    if (!res.ok) throw new Error('No pudimos enviar la consulta. Probá de nuevo o escribinos por WhatsApp.')
    return { via: 'crm' }
  }

  const lines = [`Hola gecko, les escribo desde la web (${origen}).`, ...Object.entries(datos).filter(([, v]) => v).map(([k, v]) => `• ${k}: ${v}`)]
  if (archivos.length) lines.push(`• Archivos: ${archivos.map((f) => f.name).join(', ')} (los adjunto en este chat)`)
  window.open(waLink(lines.join('\n')), '_blank', 'noopener')
  return { via: 'whatsapp' }
}
