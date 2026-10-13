// Las tres unidades de servicio, tomadas del Plan de Acción de gecko.
// pattern: combinación del manual usada en el encabezado de cada unidad.
export const services = [
  {
    slug: 'produccion-grafica',
    path: '/produccion-grafica',
    name: 'Producción gráfica',
    short: 'Impresión, vinilos, ploteos, stickers y corte de rígidos.',
    headline: 'Mandá tu archivo. Lo tenés en días.',
    intro: 'Servicios rápidos para diseñadores, agencias y comercios que ya saben lo que necesitan. Impresión sobre una amplia variedad de soportes, corte de precisión y terminaciones listas para usar.',
    pattern: 'waves',
    audience: 'Diseñadores gráficos, pequeñas empresas y emprendedores',
    items: [
      ['Impresión de gran formato', 'Vinilos, lonas, ploteos y laminado de placas.'],
      ['Stickers', 'Impresos y/o troquelados, en medidas estándar o a medida.'],
      ['Corte de rígidos', 'Polifan, MDF, acrílico, PVC, polietileno y otros soportes.'],
      ['Comunicación visual de catálogo', 'Productos estándar listos para pedir.'],
    ],
    steps: [
      ['Mandás el archivo', 'Listo para imprimir o cortar, o un boceto bien definido.'],
      ['Cotización express', 'Tarifa estándar por m², material y cantidad.'],
      ['Producción', 'Revisamos el archivo, ajustamos parámetros y producimos.'],
      ['Retiro o envío', 'Retirás en el taller o te lo mandamos.'],
    ],
    landing: null,
    shop: true,
  },
  {
    slug: 'arquigrafia',
    path: '/arquigrafia',
    name: 'Arquigrafía + espacios',
    short: 'Fachadas, cartelería y equipamiento comercial.',
    headline: 'Del frente del local al último detalle interior.',
    intro: 'Diseño y fabricación de equipamiento comercial, cartelería, productos arquitectónicos y elementos de fachada. Servicio integral, o solo ejecución para arquitectos y diseñadores de interiores.',
    pattern: 'truchet',
    audience: 'Arquitectos, diseñadores de interiores y comercios',
    items: [
      ['Fachadas', 'Diseño, fabricación e instalación de frentes comerciales.'],
      ['Cartelería', 'Corpóreos, cajas de luz, señalética interior y exterior.'],
      ['Equipamiento comercial', 'Mostradores, exhibidores y mobiliario a medida.'],
      ['Solo ejecución', 'Materializamos proyectos de estudios a partir de planos o renders.'],
    ],
    steps: [
      ['Brief técnico', 'Planos, renders o ideas base. Definimos el alcance.'],
      ['Propuesta y cotización', 'Factibilidad, materiales, tiempos e hitos.'],
      ['Detalle y aprobación', 'Planos de detalle, ajustes técnicos y maquetas si hace falta.'],
      ['Producción e instalación', 'Fabricamos en el taller e instalamos en obra, con informe final.'],
    ],
    landing: '/para-arquitectos',
    shop: false,
  },
  {
    slug: 'pop-retail',
    path: '/pop-retail',
    name: 'P.O.P. + Retail',
    short: 'Exhibidores, stands y activaciones para marcas.',
    headline: 'Un solo proveedor, de la idea a la activación.',
    intro: 'Diseño y fabricación de productos para exhibir marcas en comercios, tiendas y eventos. Stands de diferentes tamaños, activaciones y piezas publicitarias, personalizadas o basadas en catálogo.',
    pattern: 'frame',
    audience: 'Marcas, agencias de publicidad y cadenas de retail',
    items: [
      ['Exhibidores', 'De mostrador, de piso y de góndola.'],
      ['Stands', 'Modulares o a medida, para ferias y eventos.'],
      ['Activaciones', 'Piezas y estructuras para lanzamientos y acciones de marca.'],
      ['Series para retail', 'Producción repetible para varias sucursales.'],
    ],
    steps: [
      ['Brief', 'Objetivo, cantidades, fecha del evento o lanzamiento.'],
      ['Diseño y prototipo', 'Propuesta, renders y muestra física si hace falta.'],
      ['Producción en serie', 'Fabricación in-house con control de calidad.'],
      ['Entrega y montaje', 'Logística, instalación y desmontaje si corresponde.'],
    ],
    landing: '/para-marcas',
    shop: true,
  },
]

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]))

export const profiles = [
  { key: 'arquitectos', label: 'Soy arquitecto o diseñador', sub: 'Tengo el proyecto', title: 'Vos diseñás. gecko lo hace realidad.', text: 'Ejecutamos proyectos de estudios con precisión: detalle constructivo, fabricación en taller e instalación en obra.', to: '/para-arquitectos', cta: 'Ver cómo trabajamos con estudios' },
  { key: 'comercios', label: 'Tengo un comercio', sub: 'Quiero renovar mi local', title: 'Del frente de tu local al último detalle interior.', text: 'Fachada, cartelería, equipamiento e imagen. Te acompañamos desde la idea hasta la instalación.', to: '/para-comercios', cta: 'Renovar mi local' },
  { key: 'marcas', label: 'Soy una marca o agencia', sub: 'Necesito P.O.P. o un stand', title: 'Un solo proveedor, de la idea a la activación.', text: 'Exhibidores, stands y activaciones diseñados y fabricados en el mismo taller.', to: '/para-marcas', cta: 'Producir mi activación' },
  { key: 'rapidos', label: 'Necesito imprimir o cortar', sub: 'Tengo el archivo listo', title: 'Mandá tu archivo, lo tenés en días.', text: 'Vinilos, lonas, stickers y corte de rígidos. Pedí online o escribinos.', to: '/produccion-grafica', cta: 'Ver producción gráfica' },
]
