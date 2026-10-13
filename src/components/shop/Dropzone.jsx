import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { Foot } from '../Brand'

const ACCEPT = ['pdf', 'ai', 'svg', 'eps', 'dxf', 'png', 'jpg', 'jpeg']
const MAX_MB = 50

// Zona para soltar el archivo de diseño. Valida tipo y peso y muestra una vista previa si es imagen.
export default function Dropzone({ file, onChange, id = 'archivo' }) {
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const box = useRef(null)

  useEffect(() => {
    if (!file || !/^image\//.test(file.type)) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const take = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!ACCEPT.includes(ext)) { setError(`Ese formato no lo podemos usar. Subí ${ACCEPT.join(', ').toUpperCase()}.`); return }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`El archivo pesa más de ${MAX_MB} MB. Mandalo por WhatsApp después de comprar.`); return }
    setError('')
    onChange(f)
    const thumb = box.current.querySelector('[data-thumb]')
    gsap.fromTo(thumb, { scale: 1.5, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(3)' })
  }

  return (
    <div className="grid gap-2">
      <label ref={box} htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]) }}
        className={`frame flex cursor-pointer items-center gap-4 border-2 border-dashed p-4 transition-colors [--chaflan:14px] ${over ? 'border-naranja bg-[#FFF0E9]' : file ? 'border-negro bg-papel' : 'border-negro/30 hover:border-negro'}`}>
        <span data-thumb className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-blanco">
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <Foot className={`h-8 w-8 ${file ? 'text-naranja' : 'text-gris'}`} />}
        </span>
        <span className="grid min-w-0 gap-0.5">
          {file ? (
            <>
              <b className="truncate text-[18px]">{file.name}</b>
              <span className="text-[15px] text-tinta2">{(file.size / 1024 / 1024).toFixed(1)} MB · <span className="underline">cambiar</span></span>
            </>
          ) : (
            <>
              <b className="text-[18px]">Arrastrá tu diseño o hacé clic</b>
              <span className="text-[15px] text-tinta2">PDF, AI, SVG, EPS o DXF en vectores; PNG o JPG en alta. Hasta {MAX_MB} MB.</span>
            </>
          )}
        </span>
        <input id={id} type="file" accept={ACCEPT.map((e) => `.${e}`).join(',')} className="sr-only" onChange={(e) => take(e.target.files[0])} />
      </label>
      {file && <button type="button" onClick={() => onChange(null)} className="justify-self-start text-[15px] font-bold text-tinta2 underline underline-offset-4">Quitar archivo</button>}
      {error && <p role="alert" className="text-[16px] font-bold text-hondo">{error}</p>}
      {!file && <p className="text-[15px] text-tinta2">¿No tenés diseño? Agregalo igual y te contactamos para hacerlo.</p>}
    </div>
  )
}
