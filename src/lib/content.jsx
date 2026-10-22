import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as seed from '../data/seed'
import { supabase, BUCKET } from './supabase'
import { resizeToWebp } from './media'

// Contenido editable del sitio: proyectos, productos y materiales.
// Con Supabase configurado se lee y se guarda en la base; sin él, el panel trabaja en "modo demo"
// y los cambios quedan en este navegador (localStorage) por encima del contenido inicial.
export const TYPES = ['projects', 'products', 'materials']
const DEMO_KEY = 'gecko-cms-v1'
const mode = supabase ? 'supabase' : 'demo'

const withOrder = (list) => list.map((x, i) => ({ published: true, ...x, order: x.order ?? (x.featured ? x.featured - 100 : i) }))
const initial = () => {
  const base = { projects: withOrder(seed.projects), products: withOrder(seed.products), materials: withOrder(seed.materials) }
  if (mode !== 'demo') return base
  try { return { ...base, ...JSON.parse(localStorage.getItem(DEMO_KEY) || '{}') } } catch { return base }
}
const sortList = (l) => [...l].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
const fromRow = (r) => ({ ...r.data, slug: r.slug, published: r.published, order: r.sort })
const toRow = (x) => ({ slug: x.slug, data: x, published: x.published !== false, sort: x.order ?? 0, updated_at: new Date().toISOString() })

const Ctx = createContext(null)

export function ContentProvider({ children }) {
  const [data, setData] = useState(initial)
  const [ready, setReady] = useState(mode === 'demo')
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    try {
      const res = await Promise.all(TYPES.map((t) => supabase.from(t).select('slug,data,published,sort').order('sort')))
      const bad = res.find((r) => r.error)
      if (bad) throw bad.error
      const next = Object.fromEntries(TYPES.map((t, i) => [t, res[i].data.map(fromRow)]))
      // base recién creada y vacía: se muestra el contenido inicial hasta que se importe
      if (TYPES.every((t) => next[t].length === 0)) next.empty = true
      setData((d) => (next.empty ? { ...d, empty: true } : next))
    } catch (e) {
      setError('No pudimos cargar el contenido actualizado. Se muestra la última versión publicada.')
      console.error(e)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: s }) => setSession(s.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const persistDemo = (next) => { try { localStorage.setItem(DEMO_KEY, JSON.stringify({ projects: next.projects, products: next.products, materials: next.materials })) } catch { throw new Error('El navegador no tiene más espacio para el modo demo. Usá fotos más livianas o conectá Supabase.') } }

  const api = useMemo(() => {
    const replace = (type, item, prevSlug) => setData((d) => {
      const list = d[type].filter((x) => x.slug !== (prevSlug || item.slug))
      const next = { ...d, [type]: sortList([...list, item]) }
      if (mode === 'demo') persistDemo(next)
      return next
    })
    return {
      mode, ready, error, session,
      ...data,
      projects: sortList(data.projects), products: sortList(data.products), materials: sortList(data.materials),
      categories: seed.categories, units: seed.units, reels: seed.reels, tallerClips: seed.tallerClips,
      bySlug: (type, slug) => data[type].find((x) => x.slug === slug),

      async save(type, item, prevSlug) {
        if (!item.slug) throw new Error('Falta el identificador (slug).')
        const clash = data[type].find((x) => x.slug === item.slug && x.slug !== prevSlug)
        if (clash) throw new Error(`Ya existe otro elemento con el identificador "${item.slug}".`)
        if (supabase) {
          const { error: e } = await supabase.from(type).upsert(toRow(item))
          if (e) throw new Error(e.message)
          if (prevSlug && prevSlug !== item.slug) await supabase.from(type).delete().eq('slug', prevSlug)
        }
        replace(type, item, prevSlug)
      },
      async remove(type, slug) {
        if (supabase) {
          const { error: e } = await supabase.from(type).delete().eq('slug', slug)
          if (e) throw new Error(e.message)
        }
        setData((d) => { const next = { ...d, [type]: d[type].filter((x) => x.slug !== slug) }; if (mode === 'demo') persistDemo(next); return next })
      },
      async reorder(type, slugs) {
        const list = slugs.map((s, i) => ({ ...data[type].find((x) => x.slug === s), order: i }))
        if (supabase) {
          const { error: e } = await supabase.from(type).upsert(list.map(toRow))
          if (e) throw new Error(e.message)
        }
        setData((d) => { const next = { ...d, [type]: list }; if (mode === 'demo') persistDemo(next); return next })
      },
      // Sube una foto en dos tamaños (640 y 1600 px, WebP) y devuelve la ruta base.
      async upload(file) {
        const [small, big] = await Promise.all([resizeToWebp(file, 640), resizeToWebp(file, 1600)])
        if (!supabase) {
          return await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(big) })
        }
        const id = `uploads/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
        for (const [blob, w] of [[small, 640], [big, 1600]]) {
          const { error: e } = await supabase.storage.from(BUCKET).upload(`${id}-${w}.webp`, blob, { contentType: 'image/webp', cacheControl: '31536000' })
          if (e) throw new Error(`No se pudo subir la foto: ${e.message}`)
        }
        return supabase.storage.from(BUCKET).getPublicUrl(id).data.publicUrl
      },
      // Copia el contenido inicial a una base de Supabase vacía.
      async importSeed() {
        const all = initial()
        for (const t of TYPES) {
          const { error: e } = await supabase.from(t).upsert(all[t].map(toRow))
          if (e) throw new Error(e.message)
        }
        await load()
      },
      resetDemo() { localStorage.removeItem(DEMO_KEY); setData(initial()) },
      async signIn(email, password) {
        const { error: e } = await supabase.auth.signInWithPassword({ email, password })
        if (e) throw new Error(e.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' : e.message)
      },
      signOut: () => supabase?.auth.signOut(),
    }
  }, [data, ready, error, session, load])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useContent = () => useContext(Ctx)

// Solo lo publicado, para el sitio público.
export function usePublic() {
  const c = useContent()
  return useMemo(() => ({
    ...c,
    projects: c.projects.filter((x) => x.published !== false),
    products: c.products.filter((x) => x.published !== false),
  }), [c])
}
