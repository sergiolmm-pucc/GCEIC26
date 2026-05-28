import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/equipe-15/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/frete': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
