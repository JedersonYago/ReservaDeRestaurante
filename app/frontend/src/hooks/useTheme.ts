import { useState, useEffect, useCallback } from "react";
import { lightTheme, darkTheme, type ThemeMode } from "../styles/theme";

const THEME_STORAGE_KEY = "theme-mode";

export function useTheme() {
  // Detectar preferência do sistema
  const getSystemTheme = (): ThemeMode => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // Carregar tema do localStorage ou usar preferência do sistema
  const getInitialTheme = (): ThemeMode => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(
        THEME_STORAGE_KEY
      ) as ThemeMode | null;
      if (stored && ["light", "dark"].includes(stored)) {
        return stored;
      }
    }
    return getSystemTheme();
  };

  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

  // Ouvir mudanças na preferência do sistema
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        // Só atualizar se não houver preferência salva
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!stored) {
          setThemeMode(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Salvar tema no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }
  }, [themeMode]);

  // Atualizar atributo data-theme no html para CSS global
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", themeMode);
    }
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const resetTheme = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(THEME_STORAGE_KEY);
      setThemeMode(getSystemTheme());
    }
  }, []);

  // Retornar o objeto de tema baseado no modo atual
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  return {
    themeMode,
    theme,
    toggleTheme,
    setTheme,
    resetTheme,
    isDark: themeMode === "dark",
    isLight: themeMode === "light",
  };
}
