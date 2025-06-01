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
        target: 'http://localhost:8000',  // Use localhost for API calls
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8000',  // Also proxy auth endpoints
        changeOrigin: true,
        secure: false,
      },
      '/channels': {
        target: 'http://localhost:8000',  // Also proxy channels endpoints
        changeOrigin: true,
        secure: false,
      },
      '/posts': {
        target: 'http://localhost:8000',  // Also proxy posts endpoints
        changeOrigin: true,
        secure: false,
      },
      '/comments': {
        target: 'http://localhost:8000',  // Also proxy comments endpoints
        changeOrigin: true,
        secure: false,
      },
      '/reactions': {
        target: 'http://localhost:8000',  // Also proxy reactions endpoints
        changeOrigin: true,
        secure: false,
      },
      '/saved-posts': {
        target: 'http://localhost:8000',  // Also proxy saved-posts endpoints
        changeOrigin: true,
        secure: false,
      },
      '/flagged-words': {
        target: 'http://localhost:8000',  // Also proxy flagged-words endpoints
        changeOrigin: true,
        secure: false,
      },
    },
  },
})