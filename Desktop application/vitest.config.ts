import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig as defineVitestConfig } from "vitest/config";

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    outDir: "dist",
  },
});

export default mergeConfig(
  viteConfig,
  defineVitestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
  }),
);
