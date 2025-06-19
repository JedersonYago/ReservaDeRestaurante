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
    font-size: 16px;
    scroll-behavior: smooth;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
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
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
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
  }

  /* Melhor tipografia para diferentes tamanhos de tela */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
    
    body {
      min-width: 100vw;
      max-width: 100vw;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    html {
      font-size: 16px;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    html {
      font-size: 18px;
    }
  }
`;
