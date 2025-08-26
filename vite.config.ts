import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/AquaTracker/",
  build: {
    outDir: 'dist'
  },
  server: {
    open: true,
    port: 3001,
  },
})
