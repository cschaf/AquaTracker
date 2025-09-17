import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { InlineConfig } from 'vitest'
import { VitePWA } from 'vite-plugin-pwa'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

export default defineConfig(({ mode }) => {
  const productionUrl = 'https://aquatracker.schaflabs.com/';
  const devUrl = 'http://localhost:5173';
  const appUrl = mode === 'production' ? productionUrl : devUrl;

  return {
    plugins: [
      // The VitePWA plugin must be placed before other plugins to ensure it can
      // correctly handle the service worker file in the development server.
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        devOptions: {
          enabled: true,
          type: 'module',
        },
        injectManifest: {},
      }),
      react(),
      tailwindcss(),
    ],
    base: '/',
    define: {
      '__APP_URL__': JSON.stringify(appUrl),
    },
    build: {
      outDir: 'dist',
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
  } as VitestConfigExport;
})
