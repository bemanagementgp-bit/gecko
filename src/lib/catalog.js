// Cálculos de la tienda sobre los productos cargados (seed o panel).

export function priceFor(product, selection = []) {
  if (!product?.base) return 0
  let p = product.base
  ;(product.options || []).forEach((opt, i) => {
    const v = opt.values?.[selection[i] ?? 0]
    if (!v) return
    if (v.mult) p *= v.mult
    if (v.add) p += v.add
  })
  return Math.round(p / 100) * 100
}

// Unidades que trae la variante elegida (para el precio unitario), o null si no aplica.
export function unitsFor(product, selection = []) {
  const opts = product.options || []
  for (let i = 0; i < opts.length; i++) {
    const v = opts[i].values?.[selection[i] ?? 0]
    if (v?.units > 1) return v.units
  }
  return null
}

export function optionsLabel(product, selection = []) {
  return Object.fromEntries((product.options || []).map((o, i) => [o.name, o.values?.[selection[i] ?? 0]?.label]))
}

// Productos a cotizar no tienen precio fijo: se piden por formulario o WhatsApp.
export const isQuote = (p) => !!p.quote || !p.base

const norm = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
export function searchProducts(list, q, categories = []) {
  const t = norm(q.trim())
  if (!t) return list
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
  return list.filter((p) => norm(`${p.name} ${p.desc} ${cat[p.category] || ''} ${(p.options || []).flatMap((o) => (o.values || []).map((v) => v.label)).join(' ')}`).includes(t))
}

export const slugify = (s = '') => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
