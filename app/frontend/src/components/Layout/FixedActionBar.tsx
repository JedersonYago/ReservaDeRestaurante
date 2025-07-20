import styled from "styled-components";
import React from "react";

interface FixedActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FixedActionBar({ children, className }: FixedActionBarProps) {
  // Conta o número de botões filhos
  const buttonCount = React.Children.count(children);
  
  return (
    <FixedActionBarContainer className={className}>
      <FixedActionBarContent data-button-count={buttonCount}>
        {children}
      </FixedActionBarContent>
    </FixedActionBarContainer>
  );
}

const FixedActionBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.background.primary}95,
    ${({ theme }) => theme.colors.background.primary}
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: transform 0.3s ease-in-out;
  min-height: 60px; /* Altura mínima adequada */

  @supports not (backdrop-filter: blur(10px)) {
    background: ${({ theme }) => theme.colors.background.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    /* Altura aumentada para melhor UX no mobile */
    min-height: 68px;
  }
`;

const FixedActionBarContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  max-width: ${({ theme }) =>
    theme.breakpoints.xl}; /* 1200px - mesmo que Container */
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};

  /* Padding responsivo igual ao Container */
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[8]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[10]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[12]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[16]};
  }

  /* Layout responsivo otimizado para mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    /* Usa grid responsivo que se adapta ao número de botões */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${({ theme }) => theme.spacing[3]};
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
    
    /* Força máximo de 2 colunas quando há 4+ botões */
    &[data-button-count="4"],
    &[data-button-count="5"],
    &[data-button-count="6"] {
      grid-template-columns: 1fr 1fr;
    }
    
    /* Para 1-3 botões, permite linha única */
    &[data-button-count="1"] {
      grid-template-columns: 1fr;
    }
    
    &[data-button-count="2"] {
      grid-template-columns: 1fr 1fr;
    }
    
    &[data-button-count="3"] {
      grid-template-columns: 1fr 1fr 1fr;
    }
    
    > * {
      min-width: 0;
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]};
      min-height: 48px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    /* Em telas muito pequenas, ainda mantém tamanho legível */
    gap: ${({ theme }) => theme.spacing[2]};
    
    &[data-button-count="4"],
    &[data-button-count="5"],
    &[data-button-count="6"] {
      grid-template-columns: 1fr 1fr;
    }
    
    > * {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[2]};
      min-height: 44px;
    }
  }
`;
