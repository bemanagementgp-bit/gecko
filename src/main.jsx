import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { router } from './router'
import { CartProvider } from './lib/cart'
import { ContentProvider } from './lib/content'
import { initTracking } from './lib/track'

initTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContentProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ContentProvider>
  </StrictMode>,
)
