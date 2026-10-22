import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

// Sin variables de entorno el sitio funciona con el contenido inicial y el panel en modo demo.
export const supabase = url && key ? createClient(url, key) : null
export const BUCKET = 'media'
