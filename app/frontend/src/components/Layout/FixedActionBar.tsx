import styled from "styled-components";

interface FixedActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FixedActionBar({ children, className }: FixedActionBarProps) {
  return (
    <FixedActionBarContainer className={className}>
      <FixedActionBarContent>{children}</FixedActionBarContent>
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
    ${({ theme }) => theme.colors.background.primary}90,
    ${({ theme }) => theme.colors.background.primary}
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @supports not (backdrop-filter: blur(10px)) {
    background: ${({ theme }) => theme.colors.background.primary};
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

  /* Layout responsivo dos botões */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;
