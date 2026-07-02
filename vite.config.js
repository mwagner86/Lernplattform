import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Erzeugt EINE in sich geschlossene index.html (alle JS/CSS/Assets inline).
// Diese Datei lässt sich per file:// auf jedem Gerät ohne Server öffnen.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 100000000,
    reportCompressedSize: false,
  },
})
