import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Configuração básica para preparar para testes futuros
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
