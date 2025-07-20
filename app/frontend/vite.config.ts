import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
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
          utils: ["yup", "date-fns"],
        },
      },
    },
    // Otimizações para produção
    minify: true, // Usa esbuild (padrão do Vite)
    // Sourcemaps apenas em desenvolvimento
    sourcemap: false,
  },
});
