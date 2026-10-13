// Casos del portfolio. TODO gecko: reemplazar por los 12 proyectos reales con fotos.
// placeholder: true muestra la marca "Contenido de ejemplo" en desarrollo.
// images: rutas en /public/proyectos/<slug>/ cuando existan; mientras tanto se usa un pattern de la marca.
export const projects = [
  {
    slug: 'creperie-fachada', title: 'Fachada Crêperie', client: 'Crêperie', unit: 'arquigrafia', rubro: 'Gastronomía', year: 2025,
    necesidad: 'Un frente que se leyera desde la esquina y transmitiera el carácter artesanal del local.',
    proceso: 'Diseño de letras corpóreas en script, despiece para router CNC y pintura en taller.',
    resultado: 'Letrero corpóreo instalado sobre estructura metálica, con iluminación indirecta.',
    materiales: ['MDF 18 mm', 'Pintura poliuretánica', 'Estructura metálica'], featured: true, beforeAfter: true, placeholder: true,
  },
  {
    slug: 'black-cream', title: 'Black Cream', client: 'Black Cream', unit: 'arquigrafia', rubro: 'Gastronomía', year: 2025,
    necesidad: 'Una fachada nocturna que se destacara en una calle comercial con mucha competencia.',
    proceso: 'Letras con luz LED, gráfica de vidriera y ambientación interior con vinilos.',
    resultado: 'Frente iluminado y vidriera integrada a la identidad del local.',
    materiales: ['Acrílico', 'LED', 'Vinilo impreso'], featured: true, beforeAfter: true, placeholder: true,
  },
  {
    slug: 'farmacia-integral', title: 'Imagen integral de farmacia', client: 'Farmacia de barrio', unit: 'arquigrafia', rubro: 'Salud', year: 2025,
    necesidad: 'Renovar una farmacia sin identidad visual definida y ordenar la circulación interna.',
    proceso: 'Identidad, cartel frontal, señalética interior y exhibidores de mostrador.',
    resultado: 'Local renovado en 3 semanas sin cerrar la atención al público.',
    materiales: ['ACM', 'Vinilo de corte', 'Acrílico'], featured: true, beforeAfter: true, placeholder: true,
  },
  {
    slug: 'estudio-mostrador', title: 'Mostrador para estudio de arquitectura', client: 'Estudio de arquitectura', unit: 'arquigrafia', rubro: 'Ejecución para estudios', year: 2024,
    necesidad: 'Materializar un mostrador diseñado por el estudio, con tolerancias muy ajustadas.',
    proceso: 'Planos de detalle, corte CNC, armado y laqueado en taller.',
    resultado: 'Mostrador instalado según render, con informe de final de obra.',
    materiales: ['MDF', 'Laca', 'Acero'], featured: true, placeholder: true,
  },
  {
    slug: 'stand-feria', title: 'Stand modular para feria', client: 'Marca de consumo', unit: 'pop-retail', rubro: 'Eventos', year: 2025,
    necesidad: 'Un stand reutilizable para tres ferias en el año, fácil de transportar.',
    proceso: 'Diseño modular, prototipo, producción e instalación en predio.',
    resultado: 'Stand de 3x3 m que se arma en 2 horas y se usó en tres eventos.',
    materiales: ['Aluminio', 'Lona tensada', 'PVC'], featured: true, placeholder: true,
  },
  {
    slug: 'exhibidores-sucursales', title: 'Exhibidores para 20 sucursales', client: 'Cadena de retail', unit: 'pop-retail', rubro: 'Retail', year: 2024,
    necesidad: 'Un exhibidor de mostrador repetible para toda la cadena.',
    proceso: 'Prototipo, ajuste con la marca y producción en serie.',
    resultado: '20 unidades entregadas en plazo, embaladas por sucursal.',
    materiales: ['Acrílico', 'Impresión UV'], featured: true, placeholder: true,
  },
  {
    slug: 'vinilos-oficina', title: 'Ambientación con vinilos', client: 'Oficina corporativa', unit: 'produccion-grafica', rubro: 'Corporativo', year: 2024,
    necesidad: 'Privacidad en salas vidriadas sin perder luz, con la marca de la empresa.',
    proceso: 'Diseño de pattern, impresión y ploteo de vinilo esmerilado.',
    resultado: '60 m² instalados en un fin de semana.',
    materiales: ['Vinilo esmerilado', 'Vinilo de corte'], placeholder: true,
  },
  {
    slug: 'stickers-marca', title: 'Stickers troquelados para marca', client: 'Emprendimiento local', unit: 'produccion-grafica', rubro: 'Packaging', year: 2025,
    necesidad: 'Stickers para packaging con forma de logo, en cantidad y rápido.',
    proceso: 'Revisión de archivo, impresión y troquelado digital.',
    resultado: '2.000 stickers entregados en 48 horas.',
    materiales: ['Vinilo blanco', 'Laminado mate'], placeholder: true,
  },
]

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))
export const rubros = [...new Set(projects.map((p) => p.rubro))]
