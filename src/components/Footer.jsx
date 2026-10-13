import { Link } from 'react-router'
import { site, waLink } from '../config'
import { services } from '../data/services'
import { Logo } from './Brand'
import { Waves } from './Patterns'

export default function Footer({ minimal = false }) {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-naranja text-negro">
      <Waves color="rgba(217,217,217,.55)" count={18} />
      <div className="wrap relative grid gap-12 py-16">
        {!minimal && (
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="grid content-start gap-4">
              <Logo className="h-12 w-auto justify-self-start text-blanco" />
              <p className="max-w-[30ch] text-[22px] font-bold leading-tight">{site.tagline}. Materializamos tus ideas.</p>
            </div>
            <FooterCol title="Servicios" links={services.map((s) => [s.path, s.name])} />
            <FooterCol title="gecko" links={[['/proyectos', 'Proyectos'], ['/taller', 'Taller y equipo'], ['/tienda', 'Tienda'], ['/contacto', 'Contacto']]} />
            <div className="grid content-start gap-2 text-[18px]">
              <p className="eyebrow mb-1 text-cafe">Contacto</p>
              <a href={waLink('Hola gecko')} target="_blank" rel="noopener" className="font-bold hover:underline">WhatsApp</a>
              <a href={`mailto:${site.email}`} className="font-bold hover:underline">{site.email}</a>
              <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener" className="font-bold hover:underline">@{site.instagram}</a>
              <p className="text-cafe">{site.address}<br />{site.city}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-negro pt-5 text-[16px] font-bold">
          {minimal && <Logo className="h-8 w-auto text-blanco" />}
          <p>© {year} gecko · {site.claim}</p>
          <p className="text-cafe">INOVO Industrial + ERRE Comunicación Visual</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div className="grid content-start gap-2 text-[18px]">
      <p className="eyebrow mb-1 text-cafe">{title}</p>
      {links.map(([to, label]) => <Link key={to} to={to} className="font-bold hover:underline">{label}</Link>)}
    </div>
  )
}
