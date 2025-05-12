import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopmentMode = mode === 'development';

  return {
    base: './',
    build: isDevelopmentMode
      ? {
          sourcemap: 'inline',
          minify: false,
          rollupOptions: { output: { manualChunks: undefined } },
        }
      : undefined,
    plugins: [react()],
    server: {
      fs: {
        strict: true,
      },
    },
  };
});
