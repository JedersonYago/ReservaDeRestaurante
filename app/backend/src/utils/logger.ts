/**
 * Utilitário para logs de desenvolvimento
 * Só mostra logs detalhados se a variável DEBUG estiver ativa
 */

const isDebugMode = process.env.DEBUG === 'true';

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️  ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },
  
  success: (message: string, ...args: any[]) => {
    console.log(`✅ ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDebugMode) {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️  ${message}`, ...args);
  }
};
