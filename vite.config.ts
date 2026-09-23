import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
    tailwindcss(),
  ],

  server: {
    host: '0.0.0.0', // listen on all network interfaces, not just localhost
    port: 5179, // or any free port you like
    strictPort: true, // fail loudly instead of silently picking another port
    hmr: {
      host: 'localhost',
      port: 5179,
    },
  },

  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '@': `${getDirname(import.meta.url)}/inertia`,
    },
  },
})
