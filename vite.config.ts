import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevMode = mode === "development";
  return {
    base: "./",
    build: isDevMode
      ? {
          sourcemap: "inline",
          minify: false,
          rollupOptions: { output: { manualChunks: undefined } },
        }
      : {},
    plugins: [react()],
  };
});
