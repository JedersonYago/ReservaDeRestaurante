import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../../shared/dist"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", () => {
            console.log("⏳ Aguardando backend inicializar...");
          });
        },
      },
    },
  },
  build: {
    // Aumentar o limite para evitar warnings desnecessários
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React e suas dependências
          vendor: ["react", "react-dom", "react-router-dom"],
          // Separar bibliotecas de UI e estilo
          ui: ["styled-components", "@tanstack/react-query"],
          // Separar bibliotecas de validação e utilitários
          utils: ["zod", "date-fns"],
        },
      },
    },
    // Otimizações para produção
    minify: "esbuild",
    // Sourcemaps apenas em desenvolvimento
    sourcemap: false,
    // Otimizações adicionais
    target: "esnext",
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
});
