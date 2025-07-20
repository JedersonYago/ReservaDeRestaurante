import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.1;
  }
`;

export const ErrorContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem 0;
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 25% 25%,
      ${({ theme }) => theme.colors.primary.main} 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 75% 75%,
      ${({ theme }) => theme.colors.secondary.main} 1px,
      transparent 1px
    );
  background-size: 50px 50px;
  opacity: 0.1;
  animation: ${pulse} 4s ease-in-out infinite;
`;

export const ErrorContent = styled.div`
  text-align: center;
  max-width: 600px;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;

  > div:first-child {
    margin-bottom: 3rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      margin-bottom: 2rem;
    }
  }
`;

export const ErrorIllustration = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
`;

export const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
  line-height: 1;
  letter-spacing: -0.05em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 6rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 4rem;
  }
`;

export const ErrorTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 1rem 0 1.5rem;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
    margin: 0.8rem 0 1.2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
    margin: 0.6rem 0 1rem;
  }
`;

export const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 3rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;

    button {
      width: 100%;
      max-width: 280px;
    }
  }
`;
