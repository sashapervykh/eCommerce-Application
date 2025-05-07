import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
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
      : {},
    plugins: [react()],
    server: {
      historyApiFallback: true,
    },
  };
});
