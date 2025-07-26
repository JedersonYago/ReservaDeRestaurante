import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";

// Animações
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

// Styled Components
export const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main} 0%,
    ${({ theme }) => theme.colors.secondary.main} 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: -1;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const LeftSection = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 100vh;
  }
`;

export const BrandSection = styled.div`
  padding: 0 0 ${({ theme }) => theme.spacing[4]};
  text-align: left;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 0 ${({ theme }) => theme.spacing[3]};
  }
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  transition: all ${({ theme }) => theme.transitions.timing.out} 0.2s;
  align-self: flex-start;
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    transform: translateX(-4px);
  }
`;

export const FormContainer = styled.div`
  max-width: 400px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

export const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 55%;
  left: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SubmitButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main} 0%,
    ${({ theme }) => theme.colors.primary.dark} 100%
  );
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.timing.out} 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing[4]} 0;
  margin-top: ${({ theme }) => theme.spacing[4]};
  transition: color ${({ theme }) => theme.transitions.timing.out} 0.2s;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) =>
      theme.colors.background.primary === "#0F0F0F"
        ? theme.colors.primary[1000]
        : theme.colors.primary[50]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

export const FooterLinks = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

export const RegisterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.timing.out} 0.2s;

  strong {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};

    strong {
      text-decoration: underline;
    }
  }
`;

export const RightSection = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FA761F' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const HeroContent = styled.div`
  max-width: 500px;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  position: relative;
  z-index: 1;
`;

export const HeroTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const GradientText = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main} 0%,
    ${({ theme }) => theme.colors.secondary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: left;
`;

export const FeatureItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.2s);

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }

  &:nth-child(1) {
    --i: 0;
  }
  &:nth-child(2) {
    --i: 1;
  }
  &:nth-child(3) {
    --i: 2;
  }
  &:nth-child(4) {
    --i: 3;
  }
`;

// Componentes para exibir erros
export const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.semantic.error}10;
  border: 1px solid ${({ theme }) => theme.colors.semantic.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  animation: ${fadeInUp} 0.3s ease-out;
`;

export const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
