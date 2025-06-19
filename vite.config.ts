import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopmentMode = mode === 'development';

  return {
    base: '/',
    build: isDevelopmentMode
      ? {
          sourcemap: 'inline',
          minify: false,
          rollupOptions: { output: { manualChunks: undefined } },
        }
      : undefined,
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setup-tests.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
      server: {
        deps: {
          inline: ['@gravity-ui/uikit'],
        },
      },
      css: true,
      tsconfig: './tsconfig.test.json',
    },
  };
});
