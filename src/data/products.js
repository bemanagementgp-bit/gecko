// Catálogo de la tienda. TODO gecko: productos, precios, variantes, plazos y fotos reales.
// Todo lo marcado placeholder: true es de ejemplo.
// options: cada valor suma `add` al precio base o lo multiplica por `mult`. `units` indica cuántas unidades trae (para el precio unitario).
// custom: admite subir un archivo de diseño. images: rutas en /public/tienda/<slug>/ cuando existan.
export const categories = [
  { slug: 'comunicacion-visual', name: 'Comunicación visual', desc: 'Señalética y carteles estándar, listos para pedir.' },
  { slug: 'stickers-vinilos', name: 'Stickers y vinilos', desc: 'Impresos y/o troquelados, estándar o personalizados.' },
  { slug: 'materiales', name: 'Materiales y cortes', desc: 'Placas de la industria gráfica, enteras o cortadas a medida.' },
  { slug: 'pop', name: 'P.O.P. de catálogo', desc: 'Exhibidores base listos para marcar.' },
]

export const products = [
  {
    slug: 'stickers-troquelados', name: 'Stickers troquelados', category: 'stickers-vinilos', base: 18000, custom: true, featured: 1, badge: 'Más pedido',
    desc: 'Stickers con la forma de tu diseño, impresos en vinilo y troquelados uno por uno. Ideales para packaging, merchandising y eventos.',
    options: [
      { name: 'Medida', values: [{ label: '5 × 5 cm', mult: 1 }, { label: '7 × 7 cm', mult: 1.5 }, { label: '10 × 10 cm', mult: 2.2 }] },
      { name: 'Cantidad', values: [{ label: '50 u.', mult: 1, units: 50 }, { label: '100 u.', mult: 1.7, units: 100 }, { label: '250 u.', mult: 3.6, units: 250 }] },
      { name: 'Terminación', values: [{ label: 'Brillante', add: 0 }, { label: 'Mate', add: 2500 }] },
    ],
    specs: [['Material', 'Vinilo blanco autoadhesivo'], ['Impresión', 'Full color'], ['Corte', 'Troquelado digital a la forma'], ['Uso', 'Interior y exterior']],
    leadTime: '3 a 5 días hábiles', placeholder: true,
  },
  {
    slug: 'vinilo-de-corte', name: 'Vinilo de corte para vidriera', category: 'stickers-vinilos', base: 22000, custom: true,
    desc: 'Letras y logos en vinilo de corte, listos para aplicar. Incluye transfer para que lo coloques vos.',
    options: [
      { name: 'Tamaño', values: [{ label: 'Hasta 0,5 m²', mult: 1 }, { label: 'Hasta 1 m²', mult: 1.8 }, { label: 'Hasta 2 m²', mult: 3.2 }] },
      { name: 'Color', values: [{ label: 'Blanco', add: 0 }, { label: 'Negro', add: 0 }, { label: 'Esmerilado', add: 6000 }] },
    ],
    specs: [['Material', 'Vinilo de corte de alta duración'], ['Incluye', 'Transfer para aplicar'], ['Uso', 'Vidrieras, paredes, vehículos']],
    leadTime: '2 a 4 días hábiles', placeholder: true,
  },
  {
    slug: 'carteles-senaletica', name: 'Carteles de señalética', category: 'comunicacion-visual', base: 9500, featured: 2,
    desc: 'Baños, salida, matafuego, prohibido fumar y más. Normativos y con la estética de tu local.',
    options: [
      { name: 'Modelo', values: [{ label: 'Baño', add: 0 }, { label: 'Salida', add: 0 }, { label: 'Matafuego', add: 0 }, { label: 'Prohibido fumar', add: 0 }] },
      { name: 'Material', values: [{ label: 'PVC 3 mm', add: 0 }, { label: 'Acrílico 3 mm', add: 4500 }] },
      { name: 'Medida', values: [{ label: '20 × 20 cm', mult: 1 }, { label: '30 × 30 cm', mult: 1.6 }] },
    ],
    specs: [['Impresión', 'UV directa'], ['Fijación', 'Cinta doble faz incluida'], ['Uso', 'Interior']],
    leadTime: '2 a 3 días hábiles', placeholder: true,
  },
  {
    slug: 'cartel-pvc-impreso', name: 'Cartel de PVC impreso', category: 'comunicacion-visual', base: 26000, custom: true, badge: 'Nuevo',
    desc: 'Tu diseño impreso sobre PVC espumado, para interior o exterior.',
    options: [
      { name: 'Medida', values: [{ label: '50 × 70 cm', mult: 1 }, { label: '70 × 100 cm', mult: 1.8 }, { label: '100 × 150 cm', mult: 3.4 }] },
      { name: 'Espesor', values: [{ label: '3 mm', add: 0 }, { label: '5 mm', add: 7000 }] },
    ],
    specs: [['Material', 'PVC espumado blanco'], ['Impresión', 'UV directa full color'], ['Uso', 'Interior y exterior']],
    leadTime: '3 a 5 días hábiles', placeholder: true,
  },
  {
    slug: 'placa-acrilico', name: 'Placa de acrílico cortada a medida', category: 'materiales', base: 15000, featured: 3,
    desc: 'Acrílico cristal o de color, cortado con láser a la medida que necesites. Cantos pulidos por el propio corte.',
    options: [
      { name: 'Medida', values: [{ label: '30 × 30 cm', mult: 1 }, { label: '50 × 50 cm', mult: 2.4 }, { label: '60 × 90 cm', mult: 4.8 }] },
      { name: 'Espesor', values: [{ label: '3 mm', mult: 1 }, { label: '5 mm', mult: 1.5 }] },
      { name: 'Color', values: [{ label: 'Cristal', add: 0 }, { label: 'Blanco', add: 0 }, { label: 'Negro', add: 0 }, { label: 'Naranja', add: 1500 }] },
    ],
    specs: [['Material', 'Acrílico cast'], ['Corte', 'Láser, canto pulido'], ['Tolerancia', '± 0,5 mm']],
    leadTime: '2 a 4 días hábiles', placeholder: true,
  },
  {
    slug: 'placa-mdf', name: 'MDF cortado con router', category: 'materiales', base: 12000, custom: true,
    desc: 'Corte de MDF con router CNC según tu archivo vectorial. Para letras, piezas, maquetas y mobiliario.',
    options: [
      { name: 'Espesor', values: [{ label: '3 mm', mult: 1 }, { label: '9 mm', mult: 1.4 }, { label: '18 mm', mult: 2 }] },
      { name: 'Superficie', values: [{ label: 'Hasta 0,5 m²', mult: 1 }, { label: 'Hasta 1 m²', mult: 1.8 }] },
    ],
    specs: [['Material', 'MDF crudo'], ['Corte', 'Router CNC'], ['Archivo', 'Vectorial (AI, SVG, DXF, PDF)']],
    leadTime: '3 a 5 días hábiles', placeholder: true,
  },
  {
    slug: 'exhibidor-mostrador', name: 'Exhibidor de mostrador', category: 'pop', base: 38000, custom: true, featured: 4,
    desc: 'Exhibidor de acrílico para mostrador, con frente personalizable con tu marca.',
    options: [
      { name: 'Modelo', values: [{ label: 'Escalonado', add: 0 }, { label: 'Con cabezal', add: 8000 }] },
      { name: 'Cantidad', values: [{ label: '1 u.', mult: 1, units: 1 }, { label: '5 u.', mult: 4.5, units: 5 }, { label: '10 u.', mult: 8.5, units: 10 }] },
    ],
    specs: [['Material', 'Acrílico 3 mm'], ['Personalización', 'Impresión UV en el frente'], ['Entrega', 'Armado']],
    leadTime: '7 a 10 días hábiles', placeholder: true,
  },
  {
    slug: 'porta-folletos', name: 'Porta folletos de acrílico', category: 'pop', base: 11000,
    desc: 'Porta folletos A5 o A4, de mesa o de pared.',
    options: [
      { name: 'Formato', values: [{ label: 'A5', add: 0 }, { label: 'A4', add: 3000 }] },
      { name: 'Montaje', values: [{ label: 'De mesa', add: 0 }, { label: 'De pared', add: 1500 }] },
    ],
    specs: [['Material', 'Acrílico cristal 2 mm'], ['Formato', 'A5 o A4 vertical']],
    leadTime: '3 a 5 días hábiles', placeholder: true,
  },
]

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]))
export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))

export function priceFor(product, selection = []) {
  let p = product.base
  product.options.forEach((opt, i) => {
    const v = opt.values[selection[i] ?? 0]
    if (v.mult) p *= v.mult
    if (v.add) p += v.add
  })
  return Math.round(p / 100) * 100
}

// Unidades que trae la variante elegida (para mostrar el precio unitario), o null si no aplica.
export function unitsFor(product, selection = []) {
  for (let i = 0; i < product.options.length; i++) {
    const v = product.options[i].values[selection[i] ?? 0]
    if (v.units > 1) return v.units
  }
  return null
}

export function optionsLabel(product, selection = []) {
  return Object.fromEntries(product.options.map((o, i) => [o.name, o.values[selection[i] ?? 0].label]))
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
export function searchProducts(q) {
  const t = norm(q.trim())
  if (!t) return products
  return products.filter((p) => norm(`${p.name} ${p.desc} ${categoryBySlug[p.category].name} ${p.options.flatMap((o) => o.values.map((v) => v.label)).join(' ')}`).includes(t))
}
