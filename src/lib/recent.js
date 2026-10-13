// Productos vistos recientemente (solo en este navegador).
const KEY = 'gecko-vistos'

export function getRecent() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function pushRecent(slug) {
  try {
    const list = [slug, ...getRecent().filter((s) => s !== slug)].slice(0, 8)
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch { /* sin almacenamiento */ }
}
