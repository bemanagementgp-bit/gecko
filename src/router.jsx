import { createBrowserRouter } from 'react-router'
import Shell from './layouts/Shell'
import { lazy } from 'react'
import Home from './pages/Home'

// La home carga con el bundle principal; el resto de las páginas se descarga al visitarlas.
const Servicio = lazy(() => import('./pages/Servicio'))
const Proyectos = lazy(() => import('./pages/Proyectos'))
const Proyecto = lazy(() => import('./pages/Proyecto'))
const Taller = lazy(() => import('./pages/Taller'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Landing = lazy(() => import('./pages/Landing'))
const Tienda = lazy(() => import('./pages/Tienda'))
const Producto = lazy(() => import('./pages/Producto'))
const Carrito = lazy(() => import('./pages/Carrito'))
const NoEncontrada = lazy(() => import('./pages/NoEncontrada'))

export const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/produccion-grafica', element: <Servicio slug="produccion-grafica" /> },
      { path: '/arquigrafia', element: <Servicio slug="arquigrafia" /> },
      { path: '/pop-retail', element: <Servicio slug="pop-retail" /> },
      { path: '/proyectos', element: <Proyectos /> },
      { path: '/proyectos/:slug', element: <Proyecto /> },
      { path: '/taller', element: <Taller /> },
      { path: '/contacto', element: <Contacto /> },
      { path: '/tienda', element: <Tienda /> },
      { path: '/tienda/carrito', element: <Carrito /> },
      { path: '/tienda/:slug', element: <Producto /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
  // Landings de campaña: sin menú, para que nada distraiga del formulario.
  {
    element: <Shell minimal />,
    children: [
      { path: '/para-arquitectos', element: <Landing k="arquitectos" /> },
      { path: '/para-comercios', element: <Landing k="comercios" /> },
      { path: '/para-marcas', element: <Landing k="marcas" /> },
    ],
  },
])
