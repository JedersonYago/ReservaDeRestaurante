import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "../styles/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
