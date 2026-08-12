// vite.config.js
// ============================================================
// Vite Configuration for EventOps React App
// ============================================================
// Key setting: proxy — any request to /api from React
// will be automatically forwarded to our Express server
// at http://localhost:5000. This avoids CORS issues!
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // React runs on this port
    proxy: {
      // All /api requests → forwarded to Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
