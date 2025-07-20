import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  html {
    font-size: 14px; /* Reduzido de 16px para 14px para diminuir a escala geral */
    scroll-behavior: smooth;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    
    /* Suporte para transições suaves do tema */
    &[data-theme="dark"] {
      color-scheme: dark;
    }
    
    &[data-theme="light"] {
      color-scheme: light;
    }
  }

  body {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    
    /* Transição suave para mudanças de tema */
    transition: background-color ${({ theme }) =>
      theme.transitions.duration[300]} ${({ theme }) =>
  theme.transitions.timing.out},
                color ${({ theme }) => theme.transitions.duration[300]} ${({
  theme,
}) => theme.transitions.timing.out};
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    
    /* Transição suave para botões */
    transition: all ${({ theme }) => theme.transitions.duration[200]} ${({
  theme,
}) => theme.transitions.timing.out};
  }

  a {
    text-decoration: none;
    color: inherit;
    
    /* Transição suave para links */
    transition: color ${({ theme }) => theme.transitions.duration[200]} ${({
  theme,
}) => theme.transitions.timing.out};
  }

  /* Melhora o contraste para leitores de tela */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Skip link para acessibilidade */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    text-decoration: none;
    z-index: ${({ theme }) => theme.zIndex.skipLink};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: all ${({ theme }) => theme.transitions.duration[200]} ${({
  theme,
}) => theme.transitions.timing.out};

    &:focus {
      top: 6px;
    }
  }

  /* Melhora a acessibilidade de motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    html {
      scroll-behavior: auto !important;
    }
  }

  /* Melhor tipografia para diferentes tamanhos de tela */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    html {
      font-size: 13px; /* Reduzido de 14px para 13px */
    }
    
    body {
      min-width: 100vw;
      max-width: 100vw;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    html {
      font-size: 14px; /* Mantido em 14px em vez de aumentar para 16px */
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    html {
      font-size: 15px; /* Reduzido de 18px para 15px para telas muito grandes */
    }
  }

  /* Melhorias específicas para dark mode */
  @media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) {
      color-scheme: dark;
    }
  }

  /* Scrollbar personalizada para dark mode */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.neutral[500]};
    }
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.neutral[400]} ${({
  theme,
}) => theme.colors.neutral[100]};
  }
`;
