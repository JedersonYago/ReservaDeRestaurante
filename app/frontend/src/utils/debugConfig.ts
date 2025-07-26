// Utilitário para debugar configurações no deploy
export const debugConfig = {
  logEnvironmentVariables() {
    console.log("🔍 Debug: Variáveis de ambiente");
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("NODE_ENV:", import.meta.env.NODE_ENV);
    console.log("MODE:", import.meta.env.MODE);
    console.log("BASE_URL:", import.meta.env.BASE_URL);
    console.log("DEV:", import.meta.env.DEV);
    console.log("PROD:", import.meta.env.PROD);
  },

  getApiUrl() {
    const apiUrl = import.meta.env.VITE_API_URL || "/api";
    console.log("🔗 API URL configurada:", apiUrl);
    return apiUrl;
  },

  validateApiUrl() {
    const apiUrl = this.getApiUrl();

    // Verificar se a URL está malformada (contém múltiplos domínios)
    if (apiUrl.includes("vercel.app") && apiUrl.includes("railway.app")) {
      console.error("❌ URL malformada detectada:", apiUrl);
      console.error(
        "A URL contém múltiplos domínios. Verifique a configuração VITE_API_URL no Vercel."
      );
      return false;
    }

    // Verificar se é uma URL válida
    try {
      if (apiUrl !== "/api") {
        new URL(apiUrl);
      }
      console.log("✅ URL válida");
      return true;
    } catch (error) {
      console.error("❌ URL inválida:", apiUrl);
      return false;
    }
  },
};
