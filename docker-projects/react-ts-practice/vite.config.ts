import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/service/cpu': {
        target: 'https://exercise.develop.maximaster.ru',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/service\/cpu/, '/service/cpu'),
      },
      '/api': {
        target: 'https://exercise.develop.maximaster.ru',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
