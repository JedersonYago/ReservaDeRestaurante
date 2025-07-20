import React, { createContext, useContext } from "react";
import { useConfig } from "../hooks/useConfig";
import type { Config } from "../types/config";

interface ConfigContextType {
  config: Config | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: React.ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { config, isLoading, error, refetch } = useConfig();

  // Converter error para string, se necessário
  let errorString: string | null = null;
  if (error) {
    if (typeof error === "string") {
      errorString = error;
    } else if (error instanceof Error) {
      errorString = error.message;
    } else {
      errorString = String(error);
    }
  }

  // Se estiver carregando inicialmente ou se for erro de conexão (backend iniciando), 
  // não mostrar erros no console para não assustar o usuário
  const isBackendStarting = isLoading || (error && (
    errorString?.includes('Network Error') ||
    errorString?.includes('ECONNREFUSED') ||
    errorString?.includes('ERR_NETWORK')
  ));

  // Suprimir logs de erro apenas se for problema de backend iniciando
  React.useEffect(() => {
    if (isBackendStarting && error) {
      // Mostrar apenas uma vez que está aguardando
      console.log('⏳ Aguardando backend...');
    }
  }, [isBackendStarting]); // Removido 'error' da dependência para não repetir

  return (
    <ConfigContext.Provider
      value={{ config, isLoading, error: errorString, refetch }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error(
      "useConfigContext deve ser usado dentro de um ConfigProvider"
    );
  }
  return context;
}
