import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      // Ensure the backend URL is available in the app
      'import.meta.env.VITE_API_URL': JSON.stringify('https://web-builder-ai-backend.vercel.app')
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
