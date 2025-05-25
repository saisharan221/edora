import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // listen on 0.0.0.0
    port: 5173,      // ensure Vite still runs on 5173
    proxy: {
      '/api': {
        target: 'http://api:8000',  // Docker service name "api"
        changeOrigin: true,
        secure: false,
      },
    },
  },
})