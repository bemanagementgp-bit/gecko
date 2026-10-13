import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // react + react-router + gsap + lenis ya suman ~540 kB (180 kB gzip) en el chunk principal
  build: { chunkSizeWarningLimit: 600 },
  // la carpeta está en OneDrive: el watcher nativo a veces no detecta cambios
  server: { watch: { usePolling: true, interval: 300 } },
})
