import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // нужно для доступа извне
    port: 5173, // или другой, если у тебя другой порт
    allowedHosts: ['f5a7ddc78a21.ngrok-free.app'],
  },
})


