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
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    devOptions: {
      enabled: true,
      type: 'classic',
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
