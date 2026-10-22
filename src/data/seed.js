// Contenido inicial del sitio, armado con el material real de gecko (videos-gecko/).
// Es el punto de partida: desde el panel (/panel) se edita, se agrega y se publica.
//
// Imágenes: una ruta sin extensión ("/media/p/farmacia-garcia/cover") se resuelve a
// -640.webp y -1600.webp (ver src/lib/media.js). Las que se suben desde el panel usan la misma convención.
// TODO gecko: revisar textos y precios. Los precios marcados con placeholder son de ejemplo.

const P = (slug, name) => `/media/p/${slug}/${name}`
const PR = (name) => `/media/productos/${name}`
const M = (name) => `/media/materiales/${name}`
// Imágenes generadas con IA (Higgsfield) como ejemplo: el sitio las marca como ilustrativas. Reemplazarlas por fotos reales.
const G = (name) => `/media/generado/${name}`

export const units = [
  { slug: 'produccion-grafica', name: 'Producción gráfica' },
  { slug: 'arquigrafia', name: 'Arquigrafía + espacios' },
  { slug: 'pop-retail', name: 'P.O.P. + Retail' },
]

export const categories = [
  { slug: 'corporeos', name: 'Corpóreos y luminosos', desc: 'Letras, isologos y piezas con luz, fabricados en el taller.' },
  { slug: 'fachadas', name: 'Fachadas y carteles', desc: 'Paneles, carteles de acceso y revestimientos para frentes.' },
  { slug: 'vinilos', name: 'Vinilos y vidrieras', desc: 'Esmerilados, impresos, de corte y stickers.' },
  { slug: 'vehicular', name: 'Gráfica vehicular', desc: 'Ploteos parciales e integrales para flotas y food trucks.' },
  { slug: 'cortes', name: 'Cortes e impresión', desc: 'Acrílico, polifan y rígidos impresos, a medida.' },
]

export const materials = [
  { slug: 'acm', name: 'Aluminio compuesto (ACM)', image: G('acm-muestras'), desc: 'Dos láminas de aluminio con núcleo de polietileno. Liviano, rígido y sin óxido: es la base de fachadas, cajas de letras y revestimientos.', uses: 'Fachadas, cajas de letras, revestimientos' },
  { slug: 'acm-perforado', name: 'ACM perforado', image: G('panel-perforado-detalle'), desc: 'Paneles de aluminio compuesto calados con patrones de perforación. Dejan pasar la luz y arman degradés sobre el frente.', uses: 'Pieles de fachada, celosías, frentes iluminados' },
  { slug: 'acrilico', name: 'Acrílico', image: M('acrilico'), desc: 'Placa transparente o de color, cortada con router o láser. Difunde la luz de manera pareja.', uses: 'Frentes de letras, isologos, exhibidores' },
  { slug: 'led', name: 'Iluminación LED', image: M('led'), desc: 'Módulos y tiras LED de bajo consumo, programables. Iluminan desde adentro o perfilan el contorno.', uses: 'Letras iluminadas, cruces de farmacia, contornos' },
  { slug: 'chapa', name: 'Chapa galvanizada', image: M('chapa-galvanizada'), desc: 'Chapa plegada para los laterales de letras y cajas. Le da cuerpo y resistencia a la intemperie.', uses: 'Laterales de corpóreos, cajas de luz' },
  { slug: 'vinilo-esmerilado', name: 'Vinilo esmerilado', image: M('vinilo-esmerilado'), desc: 'Vinilo translúcido que imita el vidrio arenado. Da privacidad sin quitar luz y admite tramas y logos calados.', uses: 'Vidrieras, puertas, divisiones' },
  { slug: 'vinilo-impreso', name: 'Vinilo impreso', image: M('vinilo-impreso'), desc: 'Vinilo autoadhesivo impreso a todo color, con laminado de protección.', uses: 'Vidrieras, ploteos, ambientación' },
  { slug: 'vinilo-corte', name: 'Vinilo de corte', image: M('vinilos-color'), desc: 'Vinilo de color sólido cortado con plotter. Letras y logos nítidos, de larga duración.', uses: 'Vidrieras, señalética, vehículos' },
  { slug: 'polifan', name: 'Polifan (EPS)', image: PR('polifan-2'), desc: 'Poliestireno expandido de alta densidad, cortado con hilo caliente. Volumen grande con muy poco peso.', uses: 'Letras de gran tamaño, escenografía, maquetas' },
  { slug: 'pvc', name: 'PVC espumado', image: M('pvc'), desc: 'Placa rígida y liviana, fácil de cortar e imprimir. Buena para interior y exterior.', uses: 'Carteles, letras planas, señalética' },
  { slug: 'madera', name: 'Madera y MDF', image: M('mdf'), desc: 'Placas cortadas con router CNC, en crudo o pintadas. Calidez y textura natural.', uses: 'Corpóreos, luminosos con forma, mobiliario' },
  { slug: 'pla', name: 'Impresión 3D', image: M('impresion-3d'), desc: 'Piezas impresas en PLA para prototipos y formas que no salen de una placa.', uses: 'Prototipos, piezas especiales, maquetas' },
]

const sizes3 = (a, b, c) => [{ label: a, mult: 1 }, { label: b, mult: 1.6 }, { label: c, mult: 2.4 }]

export const products = [
  {
    slug: 'cruz-farmacia-led', name: 'Cruz de farmacia LED', category: 'corporeos', base: 420000, badge: 'Más pedido', featured: 1,
    desc: 'La cruz que indica "farmacia de turno" a una cuadra. Estructura de chapa plegada pintada, módulos LED verdes de alto brillo y secuencias de animación programables.',
    images: [G('cruz-led-estudio'), PR('cruz-led'), PR('cruz-led-3'), PR('cruz-led-2'), PR('cruz-led-4')],
    options: [
      { name: 'Medida', values: sizes3('60 × 60 cm', '80 × 80 cm', '100 × 100 cm') },
      { name: 'Caras', values: [{ label: 'Simple faz', add: 0 }, { label: 'Doble faz', mult: 1.7 }] },
    ],
    specs: [['Estructura', 'Chapa plegada pintada'], ['Iluminación', 'LED verde de alto brillo'], ['Animación', 'Secuencias programables'], ['Uso', 'Exterior']],
    materials: ['chapa', 'led'], leadTime: '7 a 10 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'letras-corporeas-iluminadas', name: 'Letras corpóreas iluminadas', category: 'corporeos', quote: true, featured: 2,
    desc: 'Letras con volumen y luz propia: frente de acrílico, laterales de chapa o ACM y LED interior. Se leen de día y de noche.',
    images: [G('letras-iluminadas-estudio'), PR('letras-iluminadas'), PR('letras-iluminadas-2'), PR('letras-corporeas-4')],
    options: [
      { name: 'Altura de letra', values: [{ label: 'Hasta 30 cm' }, { label: '30 a 60 cm' }, { label: 'Más de 60 cm' }] },
      { name: 'Iluminación', values: [{ label: 'Frontal' }, { label: 'Contorno (halo)' }, { label: 'Frontal + contorno' }] },
    ],
    specs: [['Frente', 'Acrílico difusor'], ['Laterales', 'Chapa galvanizada o ACM'], ['Iluminación', 'LED interior'], ['Instalación', 'Incluida en La Plata y alrededores']],
    materials: ['acrilico', 'chapa', 'led', 'acm'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'letras-corporeas', name: 'Letras corpóreas', category: 'corporeos', quote: true, featured: 3,
    desc: 'Letras con volumen, sin iluminación, en el material que mejor acompañe la marca: acrílico, PVC, ACM, madera o polifan.',
    images: [PR('letras-corporeas'), PR('letras-corporeas-3'), PR('letras-corporeas-2')],
    options: [
      { name: 'Material', values: [{ label: 'Acrílico' }, { label: 'PVC' }, { label: 'ACM' }, { label: 'Madera' }, { label: 'Polifan' }] },
      { name: 'Altura de letra', values: [{ label: 'Hasta 30 cm' }, { label: '30 a 60 cm' }, { label: 'Más de 60 cm' }] },
    ],
    specs: [['Corte', 'Router CNC o láser'], ['Terminación', 'Pintura, vinilo o natural'], ['Uso', 'Interior y exterior']],
    materials: ['acrilico', 'pvc', 'acm', 'madera', 'polifan'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'isologo-corporeo', name: 'Isologo corpóreo de pared', category: 'corporeos', quote: true,
    desc: 'El logo de la marca en volumen, en capas y colores, para recepciones, salas y fachadas.',
    images: [G('isologo-estudio'), PR('isologo-corporeo'), PR('isologo-corporeo-2')],
    options: [{ name: 'Ancho', values: [{ label: 'Hasta 1 m' }, { label: '1 a 2 m' }, { label: 'Más de 2 m' }] }],
    specs: [['Construcción', 'Capas superpuestas con separadores'], ['Terminación', 'Pintura o vinilo de color'], ['Uso', 'Interior']],
    materials: ['acrilico', 'pvc', 'madera'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'luminoso-con-forma', name: 'Luminoso con forma', category: 'corporeos', quote: true,
    desc: 'Carteles luminosos que siguen la silueta del logo o de un objeto, con LED perimetral. Ideales para gastronomía y locales con identidad fuerte.',
    images: [PR('luminoso-forma')],
    options: [{ name: 'Tamaño', values: [{ label: 'Hasta 60 cm' }, { label: '60 a 120 cm' }, { label: 'Más de 120 cm' }] }],
    specs: [['Base', 'Madera o acrílico'], ['Iluminación', 'LED perimetral'], ['Uso', 'Interior y exterior cubierto']],
    materials: ['madera', 'acrilico', 'led'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'panel-perforado', name: 'Fachada en ACM perforado', category: 'fachadas', quote: true, featured: 4,
    desc: 'Piel de fachada en aluminio compuesto perforado con un patrón de puntos a medida. Renueva el frente sin obra húmeda y, con LED detrás, de noche se convierte en cartel.',
    images: [G('panel-perforado-detalle'), PR('panel-perforado'), PR('panel-perforado-3'), PR('panel-perforado-2')],
    options: [
      { name: 'Superficie', values: [{ label: 'Hasta 10 m²' }, { label: '10 a 30 m²' }, { label: 'Más de 30 m²' }] },
      { name: 'Iluminación', values: [{ label: 'Sin luz' }, { label: 'Con LED detrás' }] },
    ],
    specs: [['Material', 'ACM perforado'], ['Estructura', 'Bastidor metálico sobre la fachada existente'], ['Patrón', 'Diseñado a medida (degradés, logos)'], ['Obra', 'Sin obra húmeda']],
    materials: ['acm-perforado', 'acm', 'led'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'cartel-de-acceso', name: 'Cartel de acceso', category: 'fachadas', quote: true,
    desc: 'Carteles de ingreso para barrios, clubes, empresas y edificios, con letras corpóreas sobre muro o estructura propia.',
    images: [PR('cartel-acceso')],
    options: [{ name: 'Largo', values: [{ label: 'Hasta 2 m' }, { label: '2 a 4 m' }, { label: 'Más de 4 m' }] }],
    specs: [['Letras', 'Corpóreas en ACM o chapa'], ['Fijación', 'Sobre muro existente o estructura'], ['Uso', 'Exterior']],
    materials: ['acm', 'chapa'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'vinilo-esmerilado', name: 'Vinilo esmerilado para vidrieras', category: 'vinilos', base: 38000, custom: true, featured: 5,
    desc: 'Privacidad con luz: vinilo esmerilado con tramas, degradés o el logo calado. Viste la vidriera con la identidad del local.',
    images: [G('vinilo-esmerilado-detalle'), PR('vinilo-esmerilado'), PR('vinilo-esmerilado-2'), PR('vinilo-esmerilado-3')],
    options: [
      { name: 'Superficie', values: [{ label: 'Hasta 2 m²', mult: 1 }, { label: 'Hasta 5 m²', mult: 2.3 }, { label: 'Hasta 10 m²', mult: 4.2 }] },
      { name: 'Diseño', values: [{ label: 'Liso', add: 0 }, { label: 'Con trama o logo calado', add: 15000 }] },
      { name: 'Colocación', values: [{ label: 'Sin colocación', add: 0 }, { label: 'Con colocación', mult: 1.35 }] },
    ],
    specs: [['Material', 'Vinilo esmerilado'], ['Corte', 'Plotter de corte'], ['Uso', 'Cara interior o exterior del vidrio']],
    materials: ['vinilo-esmerilado'], leadTime: '3 a 5 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'vinilo-impreso-vidriera', name: 'Vinilo impreso para vidrieras', category: 'vinilos', base: 32000, custom: true,
    desc: 'Tu campaña a todo color sobre el vidrio. Impresión de alta resolución con laminado, lista para cambiar cuando cambia la promo.',
    images: [PR('vinilo-impreso'), PR('vinilo-impreso-3'), PR('vinilo-impreso-2')],
    options: [
      { name: 'Superficie', values: [{ label: 'Hasta 2 m²', mult: 1 }, { label: 'Hasta 5 m²', mult: 2.3 }, { label: 'Hasta 10 m²', mult: 4.2 }] },
      { name: 'Colocación', values: [{ label: 'Sin colocación', add: 0 }, { label: 'Con colocación', mult: 1.35 }] },
    ],
    specs: [['Impresión', 'Full color, alta resolución'], ['Terminación', 'Laminado de protección'], ['Uso', 'Vidrieras y superficies lisas']],
    materials: ['vinilo-impreso'], leadTime: '3 a 5 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'vinilo-de-corte', name: 'Vinilo de corte', category: 'vinilos', base: 22000, custom: true,
    desc: 'Letras, logos y señalética en vinilo de corte, listos para aplicar con transfer.',
    images: [PR('vinilo-corte'), PR('vinilo-corte-2')],
    options: [
      { name: 'Tamaño', values: [{ label: 'Hasta 0,5 m²', mult: 1 }, { label: 'Hasta 1 m²', mult: 1.8 }, { label: 'Hasta 2 m²', mult: 3.2 }] },
      { name: 'Color', values: [{ label: 'Blanco', add: 0 }, { label: 'Negro', add: 0 }, { label: 'Esmerilado', add: 6000 }] },
    ],
    specs: [['Material', 'Vinilo de corte de alta duración'], ['Incluye', 'Transfer para aplicar']],
    materials: ['vinilo-corte'], leadTime: '2 a 4 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'stickers-troquelados', name: 'Stickers troquelados', category: 'vinilos', base: 18000, custom: true,
    desc: 'Stickers con la forma de tu diseño, impresos y troquelados uno por uno en el plotter.',
    images: [PR('stickers'), PR('stickers-2'), PR('stickers-3')],
    options: [
      { name: 'Medida', values: [{ label: '5 × 5 cm', mult: 1 }, { label: '7 × 7 cm', mult: 1.5 }, { label: '10 × 10 cm', mult: 2.2 }] },
      { name: 'Cantidad', values: [{ label: '50 u.', mult: 1, units: 50 }, { label: '100 u.', mult: 1.7, units: 100 }, { label: '250 u.', mult: 3.6, units: 250 }] },
    ],
    specs: [['Material', 'Vinilo blanco autoadhesivo'], ['Corte', 'Troquelado digital a la forma']],
    materials: ['vinilo-impreso'], leadTime: '3 a 5 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'ploteo-vehicular', name: 'Ploteo vehicular', category: 'vehicular', quote: true,
    desc: 'La flota como medio de comunicación: ploteos parciales o integrales en vinilo impreso o de corte, para utilitarios, vans y trailers.',
    images: [PR('ploteo'), PR('ploteo-2'), PR('ploteo-3')],
    options: [
      { name: 'Cobertura', values: [{ label: 'Parcial' }, { label: 'Integral' }] },
      { name: 'Vehículo', values: [{ label: 'Auto' }, { label: 'Utilitario / van' }, { label: 'Trailer / food truck' }] },
    ],
    specs: [['Material', 'Vinilo impreso laminado o de corte'], ['Colocación', 'En el taller']],
    materials: ['vinilo-impreso', 'vinilo-corte'], leadTime: 'Según proyecto', published: true,
  },
  {
    slug: 'letras-polifan', name: 'Letras de polifan', category: 'cortes', base: 9000, custom: true,
    desc: 'Letras y formas de gran tamaño cortadas con hilo caliente. Livianas, para eventos, vidrieras y escenografía.',
    images: [PR('polifan'), PR('polifan-2'), PR('polifan-3')],
    options: [
      { name: 'Altura', values: [{ label: '20 cm', mult: 1 }, { label: '40 cm', mult: 1.8 }, { label: '60 cm', mult: 2.6 }] },
      { name: 'Espesor', values: [{ label: '5 cm', add: 0 }, { label: '10 cm', mult: 1.4 }] },
      { name: 'Terminación', values: [{ label: 'Natural', add: 0 }, { label: 'Pintada', mult: 1.5 }] },
    ],
    specs: [['Precio', 'Por letra'], ['Material', 'Polifan de alta densidad'], ['Corte', 'Hilo caliente']],
    materials: ['polifan'], leadTime: '3 a 5 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'acrilico-a-medida', name: 'Acrílico cortado a medida', category: 'cortes', base: 15000,
    desc: 'Placas y piezas de acrílico cortadas con router CNC o láser según tu archivo.',
    images: [PR('acrilico-cnc'), PR('acrilico-cnc-2')],
    options: [
      { name: 'Medida', values: [{ label: '30 × 30 cm', mult: 1 }, { label: '50 × 50 cm', mult: 2.4 }, { label: '60 × 90 cm', mult: 4.8 }] },
      { name: 'Espesor', values: [{ label: '3 mm', mult: 1 }, { label: '5 mm', mult: 1.5 }] },
      { name: 'Color', values: [{ label: 'Cristal', add: 0 }, { label: 'Blanco', add: 0 }, { label: 'Negro', add: 0 }, { label: 'Naranja', add: 1500 }] },
    ],
    specs: [['Corte', 'Router CNC o láser'], ['Archivo', 'Vectorial (AI, SVG, DXF, PDF)']],
    materials: ['acrilico'], leadTime: '2 a 4 días hábiles', placeholder: true, published: true,
  },
  {
    slug: 'impresion-uv-rigidos', name: 'Cartel impreso en rígido', category: 'cortes', base: 26000, custom: true,
    desc: 'Tu diseño impreso con tinta UV directo sobre PVC, ACM o acrílico. Colores intensos y resistentes.',
    images: [PR('impresion-uv')],
    options: [
      { name: 'Medida', values: [{ label: '50 × 70 cm', mult: 1 }, { label: '70 × 100 cm', mult: 1.8 }, { label: '100 × 150 cm', mult: 3.4 }] },
      { name: 'Soporte', values: [{ label: 'PVC 3 mm', add: 0 }, { label: 'ACM 3 mm', mult: 1.5 }, { label: 'Acrílico 3 mm', mult: 1.7 }] },
    ],
    specs: [['Impresión', 'UV directa full color'], ['Uso', 'Interior y exterior']],
    materials: ['pvc', 'acm', 'acrilico'], leadTime: '3 a 5 días hábiles', placeholder: true, published: true,
  },
]

export const projects = [
  {
    slug: 'farmacia-garcia', title: 'Farmacia García', client: 'Farmacia García', unit: 'arquigrafia', rubro: 'Salud', location: 'La Plata', year: 2025, featured: 1,
    summary: 'Fachada integral sin obra húmeda: piel de ACM perforado con degradé de puntos iluminado, letras corpóreas, isologo con luz, cruz LED y vidrieras esmeriladas.',
    necesidad: 'Una farmacia de barrio con un frente viejo y sin identidad, que tenía que destacarse en una avenida comercial y renovarse sin una obra larga.',
    proceso: 'Diseñamos un patrón de perforaciones que arma un degradé verde y azul, fabricamos la estructura y los paneles en el taller y montamos todo sobre la fachada existente. Sumamos letras corpóreas iluminadas, el isologo con luz, la cruz LED y vinilo esmerilado con trama en todas las vidrieras.',
    resultado: 'Un frente que de día se lee limpio y de noche se convierte en un cartel de luz.',
    cover: P('farmacia-garcia', 'cover'),
    gallery: ['noche-frente', 'largaexpo', 'isologo', 'letras', 'vidriera-noche', 'cruz', 'vinilo', 'vidriera-dia', 'panel-dia', 'acceso', 'acceso-dia', 'instalacion-vinilo', 'obra-1', 'obra-2'].map((n) => P('farmacia-garcia', n)),
    before: P('farmacia-garcia', 'antes'), after: P('farmacia-garcia', 'dia'),
    etapas: [
      { title: 'Relevamiento', text: 'Medimos el frente, relevamos la estructura existente y fotografiamos el local. El punto de partida: una fachada sin identidad y un cartel que no se veía de noche.', image: P('farmacia-garcia', 'antes') },
      { title: 'Diseño', text: 'Propuesta en 3D: una piel de ACM perforado con un degradé de puntos en los colores de la marca, que de noche se ilumina desde atrás.', image: G('garcia-render') },
      { title: 'Ingeniería', text: 'Planos de frente y de detalle: patrón de perforaciones, modulación de paneles, subestructura metálica y ubicación de cada pieza.', image: G('garcia-plano') },
      { title: 'Fabricación', text: 'En el taller cortamos y perforamos los paneles, fabricamos las letras corpóreas, el isologo y la cruz LED.', video: '/media/taller/cruz' },
      { title: 'Instalación', text: 'Montamos la subestructura y los paneles sobre la fachada existente, sin obra húmeda.', image: P('farmacia-garcia', 'obra-2'), video: '/media/p/farmacia-garcia/instalacion' },
      { title: 'Resultado', text: 'De día, un frente limpio y moderno. De noche, toda la fachada funciona como cartel.', image: P('farmacia-garcia', 'noche-frente') },
    ],
    reels: ['gecko-v7-antes-despues-farmacia-garcia', 'gecko-v6-fachada-sin-obra', 'gecko-v3-perdiendo-clientes'],
    clips: ['/media/p/farmacia-garcia/noche', '/media/p/farmacia-garcia/instalacion'],
    materials: ['acm-perforado', 'acm', 'acrilico', 'led', 'chapa', 'vinilo-esmerilado'],
    products: ['panel-perforado', 'letras-corporeas-iluminadas', 'isologo-corporeo', 'cruz-farmacia-led', 'vinilo-esmerilado'],
    hotspots: [
      { x: 41, y: 31, product: 'letras-corporeas-iluminadas' },
      { x: 80, y: 40, product: 'isologo-corporeo' },
      { x: 22, y: 9, product: 'panel-perforado' },
      { x: 12.5, y: 51, product: 'cruz-farmacia-led' },
      { x: 73, y: 74, product: 'vinilo-esmerilado' },
    ],
    published: true,
  },
  {
    slug: 'farmacia-sanchez', title: 'Farmacia Sánchez', client: 'Farmacia Sánchez', unit: 'arquigrafia', rubro: 'Salud', location: 'La Plata', year: 2025, featured: 4,
    summary: 'Identidad aplicada a vidrieras y puertas con vinilo esmerilado con trama, logo calado y datos de contacto.',
    necesidad: 'Ordenar la imagen de las vidrieras, dar privacidad al interior y que la marca se viera desde la vereda.',
    proceso: 'Diseñamos una trama de cuadrados en degradé que deja ver el interior arriba y lo cubre abajo, con el logo y los teléfonos calados. Cortamos en plotter y colocamos en todas las aberturas.',
    resultado: 'Vidrieras con identidad propia que dejan pasar la luz y presentan la farmacia antes de entrar.',
    cover: P('farmacia-sanchez', 'cover'),
    gallery: ['vidriera', 'puerta', 'puerta-2', 'detalle'].map((n) => P('farmacia-sanchez', n)),
    clips: ['/media/p/farmacia-sanchez/vidriera'],
    materials: ['vinilo-esmerilado', 'vinilo-corte'], products: ['vinilo-esmerilado', 'vinilo-de-corte'],
    hotspots: [{ x: 32, y: 62, product: 'vinilo-esmerilado' }], published: true,
  },
  {
    slug: 'farmacia-roux', title: 'Farmacia Roux', client: 'Farmacia Roux', unit: 'arquigrafia', rubro: 'Salud', year: 2026,
    summary: 'Renovación de frente con revestimiento de ACM, gráfica de gran formato en vinilo y señalética de turno.',
    necesidad: 'Actualizar una fachada de dos plantas con una identidad nueva, sin una obra larga.',
    proceso: 'Revestimos el frente con ACM, aplicamos la gráfica de la marca en vinilo sobre vidrios y paneles y sumamos la señalética de turno.',
    resultado: 'Un frente sobrio, con la marca a gran escala y una lectura clara desde la calle.',
    cover: P('farmacia-roux', 'cover'), gallery: [], clips: ['/media/p/farmacia-roux/vinilo'],
    reels: ['gecko-v5-acm-aluminio-compuesto'],
    materials: ['acm', 'vinilo-impreso', 'vinilo-corte'], products: ['vinilo-impreso-vidriera', 'vinilo-de-corte'], published: true,
  },
  {
    slug: 'club-rambla', title: 'Club Rambla', client: 'Club Rambla', unit: 'arquigrafia', rubro: 'Fitness', year: 2026, featured: 3,
    summary: 'Gimnasio y café: vinilos de vidriera con la marca y un friso de ACM perforado en todo el frente.',
    necesidad: 'Un club que necesitaba presentarse como "más que un gimnasio" en una esquina de mucho paso.',
    proceso: 'Aplicamos vinilos con la marca y los mensajes del club en las ventanas del frente y en el café, y revestimos el remate de la fachada con paneles de ACM perforado.',
    resultado: 'Un frente negro y contundente donde la marca y el friso perforado se reconocen desde lejos.',
    cover: P('club-rambla', 'cover'),
    gallery: ['frente', 'lateral', 'vidrio', 'cafe'].map((n) => P('club-rambla', n)),
    materials: ['acm-perforado', 'vinilo-impreso', 'vinilo-corte'], products: ['panel-perforado', 'vinilo-impreso-vidriera', 'vinilo-de-corte'],
    hotspots: [{ x: 50, y: 20, product: 'panel-perforado' }, { x: 74, y: 52, product: 'vinilo-impreso-vidriera' }], published: true,
  },
  {
    slug: 'amalaya', title: 'Vidrieras Amalaya', client: 'Amalaya', unit: 'pop-retail', rubro: 'Vinos', year: 2026, featured: 5,
    summary: 'Campaña de bodega en vidriera: vinilo impreso a gran escala en todos los paños del local.',
    necesidad: 'Llevar la campaña "Cafayate, terroir de gran altura" al punto de venta con impacto desde la vereda.',
    proceso: 'Imprimimos la campaña en vinilo de alta resolución, dividida por paños, y la colocamos en el local.',
    resultado: 'La vidriera se convirtió en el soporte más grande de la campaña.',
    cover: P('amalaya', 'cover'), gallery: ['instalacion', 'detalle', 'aplicacion'].map((n) => P('amalaya', n)),
    clips: ['/media/p/amalaya/instalacion'], materials: ['vinilo-impreso'], products: ['vinilo-impreso-vidriera'],
    hotspots: [{ x: 50, y: 50, product: 'vinilo-impreso-vidriera' }], published: true,
  },
  {
    slug: 'ev-days', title: 'EV Days · Nueva Captiva', client: 'Chevrolet', unit: 'pop-retail', rubro: 'Automotriz', year: 2025,
    summary: 'Vidriera de lanzamiento para concesionaria: gráfica impresa de gran formato en altura.',
    necesidad: 'Comunicar el lanzamiento de un vehículo eléctrico en el frente vidriado de una concesionaria.',
    proceso: 'Imprimimos la campaña en vinilo y la colocamos en altura sobre la vidriera, paño por paño.',
    resultado: 'El lanzamiento se ve desde la avenida.',
    cover: P('ev-days', 'cover'), gallery: [], clips: ['/media/p/ev-days/instalacion'],
    materials: ['vinilo-impreso'], products: ['vinilo-impreso-vidriera'], published: true,
  },
  {
    slug: 'colfarma', title: 'Colegio de Farmacéuticos', client: 'COLFARMA', unit: 'arquigrafia', rubro: 'Institucional', year: 2025, featured: 6,
    summary: 'Isologo corpóreo en capas para la sala institucional del Colegio de Farmacéuticos de la Provincia de Buenos Aires.',
    necesidad: 'Una pieza institucional para la sala principal, a la altura de la marca.',
    proceso: 'Fabricamos el isologo en capas de distintos colores y espesores, con separadores para que proyecte sombra, y lo instalamos con el nombre en letras corpóreas.',
    resultado: 'La identidad del Colegio en volumen, protagonista de la sala.',
    cover: P('colfarma', 'cover'), gallery: ['sala', 'isologo', 'detalle', 'pared'].map((n) => P('colfarma', n)),
    materials: ['pvc', 'acrilico'], products: ['isologo-corporeo', 'letras-corporeas'],
    hotspots: [{ x: 37, y: 33, product: 'isologo-corporeo' }, { x: 60, y: 31, product: 'letras-corporeas' }], published: true,
  },
  {
    slug: 'cala', title: 'Cala', client: 'Cala', unit: 'arquigrafia', rubro: 'Comercio', year: 2025,
    summary: 'Letras corpóreas de gran tamaño sobre fachada y gráfica de acceso.',
    necesidad: 'Una marca que tenía que leerse desde la vereda de enfrente en una calle angosta.',
    proceso: 'Cortamos las letras en el taller, las terminamos y las instalamos sobre la marquesina, con vinilos en el acceso.',
    resultado: 'Una marca con volumen y presencia en el frente.',
    cover: P('cala', 'cover'), gallery: ['frente', 'acceso'].map((n) => P('cala', n)),
    materials: ['pvc', 'vinilo-corte'], products: ['letras-corporeas', 'vinilo-de-corte'],
    hotspots: [{ x: 50, y: 40, product: 'letras-corporeas' }], published: true,
  },
  {
    slug: 'crayon', title: 'Juguetería Crayón', client: 'Crayón', unit: 'arquigrafia', rubro: 'Retail', year: 2026,
    summary: 'Letras corpóreas de colores para el frente de una juguetería.',
    necesidad: 'Un frente que hable el lenguaje de los chicos antes de abrir la persiana.',
    proceso: 'Fabricamos cada letra en un color distinto y las montamos sobre el frente recién pintado.',
    resultado: 'Una fachada alegre que se reconoce aun con el local cerrado.',
    cover: P('crayon', 'cover'), gallery: [], materials: ['pvc', 'acm'], products: ['letras-corporeas'],
    hotspots: [{ x: 50, y: 25, product: 'letras-corporeas' }], published: true,
  },
  {
    slug: 'campos-de-la-enriqueta', title: 'Campos de la Enriqueta', client: 'Club de campo Campos de la Enriqueta', unit: 'arquigrafia', rubro: 'Club de campo', year: 2025,
    summary: 'Cartel de acceso con letras corpóreas sobre muro.',
    necesidad: 'Señalizar el ingreso del club de campo con una pieza sobria y duradera.',
    proceso: 'Fabricamos el isologo y las letras corpóreas y los fijamos sobre el muro de ingreso.',
    resultado: 'Un acceso que anuncia el lugar con elegancia.',
    cover: P('campos-de-la-enriqueta', 'cover'), gallery: [], materials: ['acm', 'chapa'], products: ['cartel-de-acceso', 'letras-corporeas'],
    hotspots: [{ x: 52, y: 52, product: 'cartel-de-acceso' }], published: true,
  },
  {
    slug: 'grupo-tannat', title: 'Grupo Tannat', client: 'Grupo Tannat', unit: 'produccion-grafica', rubro: 'Transporte', year: 2025, featured: 2,
    summary: 'Ploteo de van de traslados ejecutivos con un recorrido gráfico que envuelve el vehículo.',
    necesidad: 'Que la flota de traslados comunicara la marca con una estética sobria, a tono con el servicio.',
    proceso: 'Diseñamos un recorrido de líneas y puntos que conecta los costados del vehículo, lo cortamos en vinilo y lo colocamos en el taller.',
    resultado: 'Una van que comunica sin perder la elegancia del servicio.',
    cover: P('grupo-tannat', 'cover'), gallery: ['logo', 'trasera', 'lateral', 'perfil'].map((n) => P('grupo-tannat', n)),
    clips: ['/media/p/grupo-tannat/recorrido'], materials: ['vinilo-corte'], products: ['ploteo-vehicular'],
    hotspots: [{ x: 60, y: 45, product: 'ploteo-vehicular' }], published: true,
  },
  {
    slug: 'creperie-on-the-road', title: 'Crêperie on the Road', client: 'Crêperie', unit: 'pop-retail', rubro: 'Gastronomía', year: 2025,
    summary: 'Ploteo integral de trailer gastronómico con un collage de la historia de la marca.',
    necesidad: 'Convertir el trailer en una pieza de marca para eventos y festivales.',
    proceso: 'Imprimimos el collage en vinilo de gran formato, lo laminamos y lo colocamos en el taller cubriendo todo el trailer.',
    resultado: 'Un food truck que se fotografía solo en cada evento.',
    cover: P('creperie-on-the-road', 'cover'), gallery: ['lateral', 'frente', 'taller', 'antes', 'aplicacion'].map((n) => P('creperie-on-the-road', n)),
    clips: ['/media/p/creperie-on-the-road/impresion', '/media/p/creperie-on-the-road/recorrido'],
    materials: ['vinilo-impreso'], products: ['ploteo-vehicular'],
    hotspots: [{ x: 55, y: 45, product: 'ploteo-vehicular' }], published: true,
  },
  {
    slug: 'pro-laser', title: 'Pro Láser Solution', client: 'Pro Láser Solution', unit: 'produccion-grafica', rubro: 'Servicios', year: 2026,
    summary: 'Ploteo de utilitario para empresa de limpieza láser, con textura de óxido que muestra el servicio.',
    necesidad: 'Que el vehículo explicara el servicio de un vistazo: limpieza láser de superficies.',
    proceso: 'Diseñamos una gráfica que pasa de óxido a superficie limpia, la imprimimos en vinilo y la colocamos en el taller.',
    resultado: 'El utilitario muestra el antes y después del servicio en la calle.',
    cover: P('pro-laser', 'cover'), gallery: ['lateral', 'frente'].map((n) => P('pro-laser', n)),
    clips: ['/media/p/pro-laser/recorrido'], materials: ['vinilo-impreso'], products: ['ploteo-vehicular'],
    hotspots: [{ x: 60, y: 55, product: 'ploteo-vehicular' }], published: true,
  },
]

// Reels editados (public/media/reels). title: cómo se muestran en el sitio.
export const reels = [
  { slug: 'gecko-v7-antes-despues-farmacia-garcia', title: 'Antes y después: Farmacia García' },
  { slug: 'gecko-v6-fachada-sin-obra', title: 'Cambiá tu fachada sin obra' },
  { slug: 'gecko-v4-mucho-mas-que-un-cartel', title: 'Mucho más que un cartel' },
  { slug: 'gecko-v5-acm-aluminio-compuesto', title: 'ACM: aluminio compuesto' },
  { slug: 'gecko-v3-perdiendo-clientes', title: '¿Tu local está perdiendo clientes?' },
  { slug: 'gecko-v2-48-horas', title: 'Tu archivo, producido en 48 horas' },
  { slug: 'gecko-v1-disenador-idioma', title: 'Hablamos el idioma del diseñador' },
]

// Clips del taller (public/media/taller), en loop y sin audio.
export const tallerClips = [
  { src: '/media/taller/cnc', label: 'Router CNC' },
  { src: '/media/taller/cruz', label: 'Armado de cruz LED' },
  { src: '/media/taller/uv', label: 'Impresión UV' },
  { src: '/media/taller/polifan', label: 'Corte de polifan' },
  { src: '/media/taller/plotter', label: 'Plotter de corte' },
  { src: '/media/taller/acm', label: 'Plegado de ACM' },
  { src: '/media/taller/corporeas', label: 'Corpóreos en chapa' },
  { src: '/media/taller/3d', label: 'Impresión 3D' },
]
