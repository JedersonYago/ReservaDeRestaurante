import styled from "styled-components";

interface SkipLinkProps {
  href?: string;
  children: React.ReactNode;
}

export function SkipLink({ href = "#main-content", children }: SkipLinkProps) {
  return (
    <SkipLinkButton href={href} className="skip-link">
      {children}
    </SkipLinkButton>
  );
}

const SkipLinkButton = styled.a`
  position: absolute;
  top: -${({ theme }) => theme.spacing[10]};
  left: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  z-index: ${({ theme }) => theme.zIndex.skipLink};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  border: 2px solid transparent;

  &:focus {
    top: ${({ theme }) => theme.spacing[2]};
    border-color: ${({ theme }) => theme.colors.primary.contrast};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
    text-decoration: underline;
  }
`;
