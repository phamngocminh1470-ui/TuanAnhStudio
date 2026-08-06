import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Lắng nghe trên toàn mạng nội bộ LAN để điện thoại kết nối được
    allowedHosts: true, // Cho phép truy cập qua mọi host (localtunnel, ngrok,...)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
