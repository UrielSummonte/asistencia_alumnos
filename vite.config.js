import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Asistencia Alumnos',
        short_name: 'Asistencia',
        description: 'App para registro de asistencia en Vercel',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.svg', // Asegúrate de tener estas imágenes en tu carpeta /public
            sizes: 'any',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'alumnos_png512',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Esto hace que el icono se adapte a formas (círculo, cuadrado) en Android
          }
        ]
      }
    })
  ],
})