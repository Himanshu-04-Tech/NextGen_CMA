import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // exposes the server on network
    allowedHosts: ['.trycloudflare.com', 'pmid-characteristic-survey-anderson.trycloudflare.com'],
  }
})