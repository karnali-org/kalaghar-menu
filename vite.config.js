import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // cache all files from public/
      includeAssets: ['**/*'],
      manifest: {
        name: 'Kala Ghar — Menu',
        short_name: 'Kala Ghar',
        description: 'Offline-friendly Kalaghar menu',
        theme_color: '#0c111b',
        background_color: '#0c111b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'milk-tea.png', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'milk-tea.png', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})


