/**
 * Utilitários para gerenciar autenticação e limpeza de dados antigos
 */

const OLD_TOKEN_KEY = "token";
const OLD_USER_KEY = "user";

const NEW_TOKEN_KEY = "accessToken";
const NEW_REFRESH_TOKEN_KEY = "refreshToken";
const NEW_USER_KEY = "user";

/**
 * Limpa dados antigos de autenticação do localStorage
 */
export const clearOldAuthData = (): void => {
  try {
    // Remover chaves antigas
    localStorage.removeItem(OLD_TOKEN_KEY);
    localStorage.removeItem(OLD_USER_KEY);

    console.log("[authUtils] Dados antigos de autenticação removidos");
  } catch (error) {
    console.error("[authUtils] Erro ao limpar dados antigos:", error);
  }
};

/**
 * Migra dados antigos para o novo formato (se necessário)
 */
export const migrateAuthData = (): void => {
  try {
    const oldToken = localStorage.getItem(OLD_TOKEN_KEY);
    const oldUser = localStorage.getItem(OLD_USER_KEY);

    if (oldToken && oldUser) {
      // Migrar dados antigos para o novo formato
      localStorage.setItem(NEW_TOKEN_KEY, oldToken);
      localStorage.setItem(NEW_USER_KEY, oldUser);

      // Remover dados antigos
      localStorage.removeItem(OLD_TOKEN_KEY);
      localStorage.removeItem(OLD_USER_KEY);

      console.log("[authUtils] Dados de autenticação migrados");
    }
  } catch (error) {
    console.error("[authUtils] Erro na migração:", error);
  }
};

/**
 * Verifica se há dados antigos que precisam ser limpos
 */
export const hasOldAuthData = (): boolean => {
  return !!(
    localStorage.getItem(OLD_TOKEN_KEY) || localStorage.getItem(OLD_USER_KEY)
  );
};

/**
 * Limpa todos os dados de autenticação (antigos e novos)
 */
export const clearAllAuthData = (): void => {
  try {
    // Limpar dados antigos
    clearOldAuthData();

    // Limpar dados novos
    localStorage.removeItem(NEW_TOKEN_KEY);
    localStorage.removeItem(NEW_REFRESH_TOKEN_KEY);
    localStorage.removeItem(NEW_USER_KEY);

    console.log("[authUtils] Todos os dados de autenticação removidos");
  } catch (error) {
    console.error("[authUtils] Erro ao limpar todos os dados:", error);
  }
};

/**
 * Verifica se o usuário está usando dados antigos
 */
export const isUsingOldAuthFormat = (): boolean => {
  const hasOldData = hasOldAuthData();
  const hasNewData = !!(
    localStorage.getItem(NEW_TOKEN_KEY) ||
    localStorage.getItem(NEW_REFRESH_TOKEN_KEY)
  );

  return hasOldData && !hasNewData;
};

/**
 * Inicializa a limpeza de dados antigos
 */
export const initializeAuthCleanup = (): void => {
  // Executar migração se necessário
  if (isUsingOldAuthFormat()) {
    migrateAuthData();
  }

  // Limpar dados antigos que possam ter ficado
  clearOldAuthData();
};
