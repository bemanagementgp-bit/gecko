import { Foot } from '../components/Brand'
import { Button } from '../components/ui'
import { Truchet } from '../components/Patterns'

export default function NoEncontrada() {
  return (
    <section className="relative grid min-h-[72vh] place-items-center overflow-hidden bg-gris">
      <title>Página no encontrada · gecko</title>
      <meta name="robots" content="noindex" />
      <Truchet combo="gris" size={28} spin />
      <div className="frame relative m-6 grid max-w-[560px] gap-4 bg-blanco p-8">
        <div className="flex gap-2">{[0, 1, 2].map((i) => <Foot key={i} className="h-8 w-8 text-naranja" style={{ rotate: `${90 + i * 25}deg`, opacity: 1 - i * 0.3 }} />)}</div>
        <h1 className="text-[clamp(44px,6vw,72px)] font-black">Acá no hay huellas.</h1>
        <p className="text-[20px] text-tinta2">La página que buscás no existe o cambió de lugar.</p>
        <div className="flex flex-wrap gap-3"><Button to="/" tone="dark">Volver al inicio</Button><Button to="/proyectos" tone="ghost">Ver proyectos</Button></div>
      </div>
    </section>
  )
}
