import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      workbox:{
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
      registerType: 'autoUpdate',
      manifest: {
        'background_color': '#121212',
        'theme_color': '#40aaff',
        'name': 'Memory Fragments',
        'short_name': 'MF',
        'start_url': '/',
        'display': 'standalone',
        'icons': [
          {
            "src": "/images/largeicon.png",
            "sizes": "320x320",
            "type": "image/png",
            "purpose": "maskable any"
          }
        ]
      }
    })
  ]
})
