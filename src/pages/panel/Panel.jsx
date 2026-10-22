import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router'
import { useContent } from '../../lib/content'
import { imgSrc } from '../../lib/media'
import { slugify } from '../../lib/catalog'
import { Logo } from '../../components/Brand'
import { ProjectForm, ProductForm, MaterialForm, blank } from './forms'

const TYPES = {
  projects: { label: 'Proyectos', one: 'proyecto', title: 'title', thumb: (x) => x.cover, sub: (x) => [x.client, x.rubro, x.year].filter(Boolean).join(' · '), url: (x) => `/proyectos/${x.slug}`, Form: ProjectForm },
  products: { label: 'Productos', one: 'producto', title: 'name', thumb: (x) => x.images?.[0], sub: (x) => (x.quote ? 'A cotizar' : x.base ? `$ ${x.base.toLocaleString('es-AR')}` : 'Sin precio'), url: (x) => `/tienda/${x.slug}`, Form: ProductForm },
  materials: { label: 'Materiales', one: 'material', title: 'name', thumb: (x) => x.image, sub: (x) => x.uses, url: null, Form: MaterialForm },
}

function Login() {
  const { signIn } = useContent()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('')
    try { await signIn(email, pw) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-naranja p-4">
      <form onSubmit={submit} className="frame grid w-full max-w-[420px] gap-4 bg-blanco p-8">
        <Logo className="h-9 w-auto justify-self-start" />
        <h1 className="text-[34px]">Panel de contenido</h1>
        <label className="grid gap-1.5"><span className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">Email</span>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="field" /></label>
        <label className="grid gap-1.5"><span className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">Contraseña</span>
          <input id="password" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="field" /></label>
        {error && <p role="alert" className="font-bold text-hondo">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-full bg-negro px-5 pb-3 pt-2 text-[19px] font-extrabold text-blanco disabled:opacity-50">{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </div>
  )
}

function Banner() {
  const c = useContent()
  const [busy, setBusy] = useState(false)
  if (c.mode === 'demo') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF0E9] px-5 py-3 text-[16px]">
        <span><b>Modo demo.</b> Los cambios se guardan solo en este navegador. Para publicar de verdad hay que conectar la base de datos (ver README).</span>
        <button type="button" onClick={() => c.resetDemo()} className="font-bold underline underline-offset-4">Volver al contenido inicial</button>
      </div>
    )
  }
  if (c.empty) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF0E9] px-5 py-3 text-[16px]">
        <span><b>La base está vacía.</b> El sitio muestra el contenido inicial hasta que lo importes.</span>
        <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await c.importSeed() } catch (e) { alert(e.message) } setBusy(false) }} className="rounded-full bg-negro px-4 pb-1.5 pt-0.5 font-extrabold text-blanco">{busy ? 'Importando…' : 'Importar contenido inicial'}</button>
      </div>
    )
  }
  return null
}

function List({ type }) {
  const c = useContent()
  const T = TYPES[type]
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const list = c[type].filter((x) => (x[T.title] || '').toLowerCase().includes(q.toLowerCase()))
  const move = async (i, d) => {
    const slugs = c[type].map((x) => x.slug)
    const [s] = slugs.splice(i, 1); slugs.splice(i + d, 0, s)
    try { await c.reorder(type, slugs) } catch (e) { setStatus(e.message) }
  }
  const togglePub = async (x) => { try { await c.save(type, { ...x, published: x.published === false }, x.slug) } catch (e) { setStatus(e.message) } }
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[44px]">{T.label}</h1>
        <Link to={`/panel/${type}/nuevo`} className="rounded-full bg-naranja px-5 pb-2.5 pt-1.5 text-[18px] font-extrabold">+ Nuevo {T.one}</Link>
      </div>
      <input id="buscar" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar ${T.label.toLowerCase()}…`} className="field max-w-[420px]" />
      {status && <p role="alert" className="font-bold text-hondo">{status}</p>}
      <ul className="grid gap-2">
        {list.map((x) => {
          const i = c[type].indexOf(x)
          const pub = x.published !== false
          return (
            <li key={x.slug} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border-[1.5px] border-linea bg-blanco p-3">
              <Link to={`/panel/${type}/${x.slug}`} className="block aspect-square overflow-hidden rounded-lg bg-papel">{T.thumb(x) && <img src={imgSrc(T.thumb(x), 640)} alt="" className="h-full w-full object-cover" />}</Link>
              <Link to={`/panel/${type}/${x.slug}`} className="grid min-w-0">
                <b className="truncate text-[21px] leading-tight hover:text-hondo">{x[T.title] || '(sin nombre)'}</b>
                <span className="truncate text-[15px] text-tinta2">{T.sub(x)}</span>
              </Link>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {type !== 'materials' && (
                  <button type="button" onClick={() => togglePub(x)} className={`rounded-full px-3 pb-1 pt-0.5 text-[14px] font-extrabold ${pub ? 'bg-[#E3F4E6] text-[#1E6B30]' : 'bg-papel text-tinta2'}`} title="Cambiar estado">
                    {pub ? 'Publicado' : 'Borrador'}
                  </button>
                )}
                {!q && <>
                  <button type="button" aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)} className="h-9 w-9 rounded-full border-[1.5px] border-linea font-bold disabled:opacity-30">↑</button>
                  <button type="button" aria-label="Bajar" disabled={i === c[type].length - 1} onClick={() => move(i, 1)} className="h-9 w-9 rounded-full border-[1.5px] border-linea font-bold disabled:opacity-30">↓</button>
                </>}
              </div>
            </li>
          )
        })}
      </ul>
      {list.length === 0 && <p className="text-[18px] text-tinta2">No hay {T.label.toLowerCase()} con esa búsqueda.</p>}
    </div>
  )
}

function Editor({ type, slug }) {
  const c = useContent()
  const nav = useNavigate()
  const T = TYPES[type]
  const isNew = slug === 'nuevo'
  const original = isNew ? null : c.bySlug(type, slug)
  const [item, setItem] = useState(() => original || blank[type]())
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [dirty, setDirty] = useState(false)
  useEffect(() => { if (original) setItem(original) }, [original?.slug]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!dirty) return
    const h = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  if (!isNew && !original) return <p className="text-[20px]">No encontramos ese {T.one}. <Link to={`/panel/${type}`} className="underline">Volver</Link></p>
  const set = (patch) => { setItem((x) => ({ ...x, ...patch })); setDirty(true); setMsg('') }
  const name = item[T.title] || ''
  const save = async () => {
    const s = item.slug || slugify(name)
    if (!name.trim()) { setMsg('Falta el nombre.'); return }
    setBusy(true); setMsg('')
    try {
      const next = { ...item, slug: s, order: item.order ?? c[type].length }
      await c.save(type, next, original?.slug)
      setDirty(false); setMsg('Guardado ✓')
      if (isNew || s !== slug) nav(`/panel/${type}/${s}`, { replace: true })
    } catch (e) { setMsg(e.message) } finally { setBusy(false) }
  }
  const del = async () => {
    setBusy(true)
    try { await c.remove(type, original.slug); nav(`/panel/${type}`) } catch (e) { setMsg(e.message); setBusy(false) }
  }
  const Form = T.Form
  return (
    <div className="grid gap-5 pb-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><Link to={`/panel/${type}`} className="text-[16px] font-bold text-tinta2 hover:text-naranja">← {T.label}</Link><h1 className="text-[40px]">{isNew ? `Nuevo ${T.one}` : name}</h1></div>
        {!isNew && T.url && item.published !== false && <a href={T.url(item)} target="_blank" rel="noopener" className="text-[17px] font-bold underline underline-offset-4">Ver en el sitio ↗</a>}
      </div>
      <Form item={item} set={set} />
      <details className="rounded-xl border-[1.5px] border-linea bg-blanco p-5">
        <summary className="cursor-pointer text-[18px] font-bold">Avanzado</summary>
        <label className="mt-3 grid max-w-[420px] gap-1.5"><span className="text-[14px] font-extrabold uppercase tracking-wider text-tinta2">Dirección (slug)</span>
          <input value={item.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} placeholder={slugify(name) || 'se-genera-solo'} className="field" />
          <span className="text-[15px] text-tinta2">Es la parte final de la URL. Si lo dejás vacío se arma con el nombre.</span></label>
      </details>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-linea bg-blanco/95 px-5 py-3 backdrop-blur md:left-[260px]">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {!isNew && (confirmDel ? (
              <span className="flex items-center gap-2 text-[16px] font-bold">¿Eliminar definitivamente?
                <button type="button" onClick={del} disabled={busy} className="rounded-full bg-hondo px-3 pb-1 pt-0.5 text-blanco">Sí, eliminar</button>
                <button type="button" onClick={() => setConfirmDel(false)} className="underline">Cancelar</button></span>
            ) : <button type="button" onClick={() => setConfirmDel(true)} className="text-[16px] font-bold text-hondo underline underline-offset-4">Eliminar</button>)}
            <span aria-live="polite" className={`text-[16px] font-bold ${msg.includes('✓') ? 'text-[#1E6B30]' : 'text-hondo'}`}>{msg || (dirty ? 'Cambios sin guardar' : '')}</span>
          </div>
          <button type="button" onClick={save} disabled={busy} className="rounded-full bg-negro px-6 pb-2.5 pt-1.5 text-[18px] font-extrabold text-blanco disabled:opacity-50">{busy ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const c = useContent()
  const cards = Object.entries(TYPES).map(([k, T]) => ({ k, T, n: c[k].length, drafts: c[k].filter((x) => x.published === false).length }))
  return (
    <div className="grid gap-6">
      <h1 className="text-[44px]">Panel de contenido</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ k, T, n, drafts }) => (
          <Link key={k} to={`/panel/${k}`} className="grid gap-1 rounded-xl border-[1.5px] border-linea bg-blanco p-5 hover:border-negro">
            <span className="text-[48px] font-black leading-none text-naranja">{n}</span>
            <b className="text-[22px]">{T.label}</b>
            {drafts > 0 && <span className="text-[15px] text-tinta2">{drafts} en borrador</span>}
          </Link>
        ))}
      </div>
      <div className="grid gap-2 rounded-xl border-[1.5px] border-linea bg-blanco p-5 text-[17px]">
        <b className="text-[22px]">Cómo cargar una obra nueva</b>
        <ol className="list-decimal space-y-1 pl-5 text-tinta2">
          <li>Si usaste productos que no están en la tienda, crealos primero en <Link to="/panel/products" className="font-bold text-negro underline">Productos</Link>.</li>
          <li>En <Link to="/panel/projects/nuevo" className="font-bold text-negro underline">Proyectos → Nuevo</Link> completá los datos, la historia y subí las fotos.</li>
          <li>Marcá los productos y materiales usados, y ubicá los puntos sobre la portada.</li>
          <li>Activá "Publicado" y guardá. Tomá como ejemplo <Link to="/panel/projects/farmacia-garcia" className="font-bold text-negro underline">Farmacia García</Link>.</li>
        </ol>
      </div>
    </div>
  )
}

export default function Panel() {
  const c = useContent()
  const { type, slug } = useParams()
  const [menu, setMenu] = useState(false)
  useEffect(() => { document.documentElement.classList.remove('lenis', 'lenis-smooth') }, [])
  const valid = useMemo(() => !type || TYPES[type], [type])
  if (c.mode === 'supabase' && !c.session) return <Login />
  return (
    <div className="min-h-screen bg-papel md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <title>Panel · gecko</title>
      <meta name="robots" content="noindex" />
      <aside className={`fixed inset-y-0 left-0 z-30 w-[260px] flex-col gap-1 bg-negro p-5 text-blanco md:sticky md:top-0 md:flex md:h-screen ${menu ? 'flex' : 'hidden'}`}>
        <Link to="/panel" className="mb-6"><Logo className="h-8 w-auto text-blanco" /></Link>
        {Object.entries(TYPES).map(([k, T]) => (
          <NavLink key={k} to={`/panel/${k}`} onClick={() => setMenu(false)} className={({ isActive }) => `rounded-lg px-3 py-2 text-[19px] font-bold ${isActive ? 'bg-naranja text-negro' : 'hover:bg-carbon'}`}>{T.label}</NavLink>
        ))}
        <div className="mt-auto grid gap-2 text-[16px]">
          <a href="/" target="_blank" rel="noopener" className="font-bold text-humo hover:text-blanco">Ver el sitio ↗</a>
          {c.mode === 'supabase' && <button type="button" onClick={c.signOut} className="text-left font-bold text-humo hover:text-blanco">Cerrar sesión</button>}
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center gap-3 border-b border-linea bg-blanco px-5 py-3 md:hidden">
          <button type="button" onClick={() => setMenu((m) => !m)} aria-label="Menú" className="rounded-full bg-negro px-4 pb-1.5 pt-0.5 font-bold text-blanco">Menú</button>
          <Logo className="h-6 w-auto" />
        </div>
        <Banner />
        {c.error && <p className="bg-[#FFF0E9] px-5 py-2 font-bold text-hondo">{c.error}</p>}
        <main className="mx-auto max-w-[1000px] p-5 md:p-8">
          {!valid ? <p>Sección inexistente.</p> : !type ? <Home /> : slug ? <Editor key={`${type}/${slug}`} type={type} slug={slug} /> : <List type={type} />}
        </main>
      </div>
    </div>
  )
}
