import React, { createContext, useContext } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useTheme } from "../hooks/useTheme";
import type { ThemeMode } from "../styles/theme";

// Contexto para as funções de tema
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  resetTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        themeMode: themeHook.themeMode,
        toggleTheme: themeHook.toggleTheme,
        setTheme: themeHook.setTheme,
        resetTheme: themeHook.resetTheme,
        isDark: themeHook.isDark,
        isLight: themeHook.isLight,
      }}
    >
      <StyledThemeProvider theme={themeHook.theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

// Hook para usar o contexto do tema
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
