import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { InlineConfig } from 'vitest'
import { VitePWA } from 'vite-plugin-pwa'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/aquatracker\.schaflabs\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'api-cache',
          }
        }
      ]
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'AquaTracker - Daily Water Intake Monitor',
      short_name: 'AquaTracker',
      description: 'Monitor and log your daily water intake. Stay hydrated with AquaTracker - make tracking your hydration goals easy and enjoyable.',
      theme_color: '#2196F3',
      background_color: '#FFFFFF',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    devOptions: {
      enabled: true // PWA in development mode aktivieren
    }
  })],
  base: "/",

  build: {
    outDir: 'dist'
  },
  server: {
    open: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['e2e/**', '**/node_modules/**'],
  },
} as VitestConfigExport)
