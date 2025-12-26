import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return defineConfig({
    base: '/',
    plugins: [vue()],
    server: {
      port: env.VITE_PORT,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true
        }
      }
    }
  });
};
