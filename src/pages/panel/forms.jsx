import { useContent } from '../../lib/content'
import { Field, Text, Area, Num, Select, Toggle, Chips, ImageField, ImagesField, Pairs, OptionsEditor, HotspotEditor, EtapasEditor } from './fields'

// Secciones del formulario: cada una es una tarjeta con título y ayuda.
export function Section({ title, help, children }) {
  return (
    <section className="grid gap-4 rounded-xl border-[1.5px] border-linea bg-blanco p-5">
      <div><h2 className="text-[24px]">{title}</h2>{help && <p className="mt-1 text-[16px] text-tinta2">{help}</p>}</div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}

export const blank = {
  projects: () => ({ slug: '', title: '', client: '', unit: '', rubro: '', year: new Date().getFullYear(), published: false, gallery: [], products: [], materials: [], hotspots: [], clips: [], reels: [], etapas: [] }),
  products: () => ({ slug: '', name: '', category: '', base: undefined, quote: false, custom: false, published: false, images: [], options: [], specs: [], materials: [] }),
  materials: () => ({ slug: '', name: '', desc: '', uses: '', image: '', published: true }),
}

export function ProjectForm({ item, set }) {
  const { units, products, materials, reels, tallerClips } = useContent()
  const videos = [...(item.clips || []).map((v, i) => ({ src: v, label: `Clip de la obra ${i + 1}` })), ...tallerClips.map((v) => ({ src: v.src, label: `Taller: ${v.label}` }))]
  const used = products.filter((p) => item.products?.includes(p.slug))
  const f = (k) => ({ value: item[k], onChange: (v) => set({ [k]: v }) })
  return (
    <>
      <Section title="Datos de la obra" help="Lo que aparece en la tarjeta y en la cabecera del proyecto.">
        <Field label="Título *"><Text {...f('title')} placeholder="Farmacia García" /></Field>
        <Field label="Cliente"><Text {...f('client')} /></Field>
        <Field label="Unidad"><Select {...f('unit')} options={units} /></Field>
        <Field label="Rubro" hint="Se usa para filtrar en Proyectos. Ej.: Salud, Gastronomía."><Text {...f('rubro')} /></Field>
        <Field label="Año"><Num {...f('year')} /></Field>
        <Field label="Lugar"><Text {...f('location')} placeholder="La Plata" /></Field>
        <Field label="Resumen" hint="Una o dos líneas: qué se hizo." wide><Area {...f('summary')} rows={2} /></Field>
      </Section>
      <Section title="La historia" help="Tres bloques cortos. Escribilos como se lo contarías a un cliente.">
        <Field label="La necesidad" wide><Area {...f('necesidad')} /></Field>
        <Field label="El proceso" wide><Area {...f('proceso')} /></Field>
        <Field label="El resultado" wide><Area {...f('resultado')} /></Field>
      </Section>
      <Section title="Fotos" help="La portada es la foto grande de arriba. La galería se ve en mosaico y se abre a pantalla completa.">
        <Field label="Portada *" wide><ImageField {...f('cover')} /></Field>
        <Field label="Galería" wide><ImagesField {...f('gallery')} onCover={(src) => set({ cover: src })} /></Field>
        <Field label="Antes" hint="Opcional. Con antes y después aparece el comparador."><ImageField {...f('before')} /></Field>
        <Field label="Después"><ImageField {...f('after')} /></Field>
      </Section>
      <Section title="Del diseño a la obra" help="Opcional. Pasos del proyecto con foto o video: relevamiento, diseño, planos, fabricación, instalación, resultado.">
        <Field label="Etapas" wide><EtapasEditor {...f('etapas')} videos={videos} /></Field>
      </Section>
      <Section title="Lo que usamos" help="Los productos aparecen en la barra lateral del proyecto y en la tienda como &quot;Usado en esta obra&quot;.">
        <Field label="Productos usados" wide><Chips {...f('products')} options={products} /></Field>
        <Field label="Materiales" wide><Chips {...f('materials')} options={materials} /></Field>
        <Field label="Puntos sobre la portada" wide><HotspotEditor image={item.cover} {...f('hotspots')} products={used} /></Field>
      </Section>
      <Section title="Videos" help="Reels ya publicados del estudio que cuentan esta obra.">
        <Field label="Reels relacionados" wide><Chips {...f('reels')} options={reels.map((r) => ({ slug: r.slug, name: r.title }))} /></Field>
      </Section>
      <Section title="Publicación">
        <Toggle {...f('published')} label="Publicado en el sitio" />
        <Field label="Destacado en la home" hint="1 = el primero. Vacío = no se destaca."><Num {...f('featured')} min={1} /></Field>
      </Section>
    </>
  )
}

export function ProductForm({ item, set }) {
  const { categories, materials } = useContent()
  const f = (k) => ({ value: item[k], onChange: (v) => set({ [k]: v }) })
  return (
    <>
      <Section title="Producto">
        <Field label="Nombre *"><Text {...f('name')} placeholder="Cruz de farmacia LED" /></Field>
        <Field label="Categoría"><Select {...f('category')} options={categories} /></Field>
        <Field label="Descripción" wide><Area {...f('desc')} rows={4} /></Field>
        <Field label="Etiqueta" hint="Opcional. Ej.: Nuevo, Más pedido."><Text {...f('badge')} /></Field>
        <Field label="Plazo de producción"><Text {...f('leadTime')} placeholder="3 a 5 días hábiles" /></Field>
      </Section>
      <Section title="Precio y venta" help="Los productos a cotizar muestran un formulario en lugar del botón de compra.">
        <Toggle {...f('quote')} label="Se vende a cotizar (sin precio fijo)" />
        <Toggle {...f('custom')} label="El cliente sube su diseño" />
        {!item.quote && <Field label="Precio base (ARS)" hint="Precio de la opción más chica. Las opciones lo modifican."><Num {...f('base')} min={0} /></Field>}
        <Field label="Opciones" wide><OptionsEditor {...f('options')} quote={item.quote} /></Field>
      </Section>
      <Section title="Fotos" help="La primera es la de la tarjeta; la segunda aparece al pasar el cursor.">
        <Field label="Fotos *" wide><ImagesField {...f('images')} /></Field>
      </Section>
      <Section title="Ficha técnica">
        <Field label="Especificaciones" wide><Pairs {...f('specs')} a="Dato (ej. Material)" b="Valor (ej. Acrílico 3 mm)" /></Field>
        <Field label="Materiales" wide><Chips {...f('materials')} options={materials} /></Field>
      </Section>
      <Section title="Publicación">
        <Toggle {...f('published')} label="Publicado en la tienda" />
        <Field label="Destacado" hint="1 = el primero en la home y la tienda."><Num {...f('featured')} min={1} /></Field>
      </Section>
    </>
  )
}

export function MaterialForm({ item, set }) {
  const f = (k) => ({ value: item[k], onChange: (v) => set({ [k]: v }) })
  return (
    <Section title="Material" help="Los materiales se muestran en cada proyecto y producto que los usa.">
      <Field label="Nombre *"><Text {...f('name')} placeholder="Aluminio compuesto (ACM)" /></Field>
      <Field label="Usos" hint="Ej.: Fachadas, cajas de letras"><Text {...f('uses')} /></Field>
      <Field label="Descripción" wide><Area {...f('desc')} /></Field>
      <Field label="Foto" wide><ImageField {...f('image')} /></Field>
    </Section>
  )
}
