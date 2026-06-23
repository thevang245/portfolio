import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  plugins: [injectHTML()],
  server: {
    port: 3000, // Bạn có thể đổi cổng chạy local nếu muốn
    open: true  // Tự động mở trình duyệt khi chạy lệnh dev
  }
});