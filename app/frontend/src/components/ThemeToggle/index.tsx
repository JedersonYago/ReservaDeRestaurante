import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "../ThemeProvider";
import styled from "styled-components";

export function ThemeToggle() {
  const { themeMode, toggleTheme } = useThemeContext();

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label={`Mudar para modo ${
        themeMode === "light" ? "escuro" : "claro"
      }`}
    >
      {themeMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </ToggleButton>
  );
}

const ToggleButton = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing[6]};
  right: ${({ theme }) => theme.spacing[6]};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};
  z-index: 1000;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (max-width: 768px) {
    bottom: ${({ theme }) => theme.spacing[4]};
    right: ${({ theme }) => theme.spacing[4]};
    width: 44px;
    height: 44px;
  }
`;
