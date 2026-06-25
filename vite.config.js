import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  plugins: [injectHTML()],
  server: {
    port: 3000,
    open: true,
    allowedHosts: [
      'a962-2402-800-63a3-be8e-421f-9827-c6a0-4dc7.ngrok-free.app', 
      '.ngrok-free.app'
    ],
    cors: true,
    hmr: {
      clientPort: 443 
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        detail: resolve(__dirname, 'project-detail.html'),
        detail2: resolve(__dirname, 'project2-detail.html')
      }
    }
  }
});