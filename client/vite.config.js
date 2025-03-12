import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const API_URL = mode === 'production'
    ? 'https://web-builder-ai-backend.vercel.app'
    : '/api'

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(API_URL)
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://web-builder-ai-backend.vercel.app',
          changeOrigin: true,
        },
      },
    },
  }
})
