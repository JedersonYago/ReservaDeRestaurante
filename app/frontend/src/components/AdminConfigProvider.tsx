import React, { createContext, useContext } from "react";
import { useAdminConfig } from "../hooks/useAdminConfig";
import type { Config } from "../types/config";

interface AdminConfigContextType {
  config: Config | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

interface AdminConfigProviderProps {
  children: React.ReactNode;
}

export function AdminConfigProvider({ children }: AdminConfigProviderProps) {
  const { config, isLoading, error, refetch } = useAdminConfig();

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

  return (
    <AdminConfigContext.Provider
      value={{ config, isLoading, error: errorString, refetch }}
    >
      {children}
    </AdminConfigContext.Provider>
  );
}

export function useAdminConfigContext() {
  const context = useContext(AdminConfigContext);
  if (context === undefined) {
    throw new Error(
      "useAdminConfigContext deve ser usado dentro de um AdminConfigProvider"
    );
  }
  return context;
}
