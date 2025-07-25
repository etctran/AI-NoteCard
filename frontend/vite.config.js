import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    define: {
      "process.env.VITE_BASE_URL": JSON.stringify(env.VITE_BASE_URL || ""),
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5001",
          changeOrigin: true,
        },
      },
    },
  };
});
