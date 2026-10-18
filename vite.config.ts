import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    outDir: 'dist',
    rollupOptions: { output: { manualChunks: {
      react: ['react', 'react-dom', 'react-dom/client'],
      motion: ['framer-motion'],
    } } },
  },
})
