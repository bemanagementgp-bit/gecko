import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { track } from './track'

const Ctx = createContext(null)
const KEY = 'gecko-carrito'

// Los archivos subidos no entran en localStorage: quedan en memoria mientras dure la visita
// y se mandan junto al pedido. Si se recarga la página, el carrito conserva el nombre del archivo.
export const cartFiles = new Map()

function reducer(items, a) {
  switch (a.type) {
    case 'add': {
      const found = items.find((i) => i.key === a.item.key)
      return found ? items.map((i) => (i.key === a.item.key ? { ...i, qty: i.qty + a.item.qty } : i)) : [...items, a.item]
    }
    case 'qty': return items.map((i) => (i.key === a.key ? { ...i, qty: Math.max(1, Math.min(99, a.qty)) } : i))
    case 'remove': return items.filter((i) => i.key !== a.key)
    case 'clear': return []
    default: return items
  }
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [isOpen, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* sin almacenamiento */ } }, [items])

  const api = useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.qty * i.price, 0),
    isOpen,
    lastAdded,
    open: () => setOpen(true),
    close: () => setOpen(false),
    // item: { key, slug, name, options: {nombre: valor}, price, qty, file?, variant }
    add: (item, fileObj) => {
      if (fileObj) cartFiles.set(item.key, fileObj)
      dispatch({ type: 'add', item })
      setLastAdded(item.key)
      setOpen(true)
      track('AddToCart', { content_ids: [item.slug], content_type: 'product', value: item.price * item.qty, currency: 'ARS' })
    },
    setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
    remove: (key) => { cartFiles.delete(key); dispatch({ type: 'remove', key }) },
    clear: () => { cartFiles.clear(); dispatch({ type: 'clear' }) },
  }), [items, isOpen, lastAdded])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
