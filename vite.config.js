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
            src: 'alumnos_png192', // Asegúrate de tener estas imágenes en tu carpeta /public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})