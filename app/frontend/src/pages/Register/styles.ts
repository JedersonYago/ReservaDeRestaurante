import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import { theme } from "../../styles/theme";

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
    transform: translateY(-5px);
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

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.primary.main} 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: -1;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const LeftSection = styled.div`
  background: ${theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: ${theme.breakpoints.lg}) {
    min-height: 100vh;
  }
`;

export const BrandSection = styled.div`
  padding: 0 0 ${theme.spacing[4]};
  text-align: left;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 0 ${theme.spacing[3]};
  }
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[4]} ${theme.spacing[8]} ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]} ${theme.spacing[6]} ${theme.spacing[6]};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-bottom: ${theme.spacing[6]};
  padding: ${theme.spacing[2]} 0;
  transition: all ${theme.transitions.timing.out} 0.2s;
  align-self: flex-start;
  width: fit-content;

  &:hover {
    color: ${theme.colors.primary.main};
    transform: translateX(-4px);
  }
`;

export const FormContainer = styled.div`
  max-width: 480px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const FormHeader = styled.div`
  margin-bottom: ${theme.spacing[6]};
  text-align: center;
`;

export const WelcomeTitle = styled.h1`
  font-size: ${theme.typography.fontSize["xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[3]};
  line-height: ${theme.typography.lineHeight.tight};
`;

export const WelcomeSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  margin-bottom: ${theme.spacing[6]};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 44px;
  left: ${theme.spacing[3]};
  color: ${theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
`;

export const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

export const PasswordStrength = styled.div`
  margin-top: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
`;

export const StrengthBar = styled.div<{ $level: string }>`
  width: 100%;
  height: 4px;
  background: ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing[2]};
`;

export const StrengthFill = styled.div<{ $level: string; $score: number }>`
  height: 100%;
  width: ${(props) => (props.$score / 5) * 100}%;
  background: ${(props) =>
    props.$level === "strong"
      ? theme.colors.semantic.success
      : props.$level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
  transition: all 0.3s ease;
`;

export const StrengthText = styled.div<{ $level: string }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  color: ${(props) =>
    props.$level === "strong"
      ? theme.colors.semantic.success
      : props.$level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
`;

export const StrengthIcon = styled.div<{ $level: string }>`
  color: ${(props) =>
    props.$level === "strong"
      ? theme.colors.semantic.success
      : props.$level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
`;

export const CheckList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[1]};
`;

export const CheckItem = styled.div<{ $valid: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  color: ${(props) =>
    props.$valid ? theme.colors.semantic.success : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  svg {
    flex-shrink: 0;
  }
`;

export const PasswordMatch = styled.div`
  margin-top: ${theme.spacing[2]};
`;

export const MatchText = styled.div<{ $valid: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props) =>
    props.$valid ? theme.colors.semantic.success : theme.colors.semantic.error};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  svg {
    color: ${theme.colors.semantic.success};
  }
`;

export const RoleSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

export const RoleLabel = styled.label`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
`;

export const RoleOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[3]};
`;

export const RoleOption = styled.label`
  position: relative;
  cursor: pointer;
`;

export const RoleInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const RoleCard = styled.div<{ $selected: boolean }>`
  padding: ${theme.spacing[4]};
  border: 2px solid
    ${(props) =>
      props.$selected ? theme.colors.primary.main : theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.lg};
  background: ${(props) =>
    props.$selected
      ? `${theme.colors.primary.main}10`
      : theme.colors.background.primary};
  transition: all ${theme.transitions.timing.out} 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};

  &:hover {
    border-color: ${theme.colors.primary.main};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  svg {
    color: ${(props) =>
      props.$selected
        ? theme.colors.primary.main
        : theme.colors.text.secondary};
  }
`;

export const RoleInfo = styled.div`
  text-align: center;
`;

export const RoleTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing[1]};
`;

export const RoleDescription = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

export const ErrorText = styled.span`
  color: ${theme.colors.semantic.error};
  font-size: ${theme.typography.fontSize.sm};
`;

export const SubmitWarning = styled.div`
  background: ${theme.colors.semantic.warning}15;
  color: ${theme.colors.semantic.warning};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.semantic.warning}30;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  svg {
    flex-shrink: 0;
  }
`;

export const SubmitButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.secondary.dark} 100%
  );
  border: none;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  transition: all ${theme.transitions.timing.out} 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const FooterLinks = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[6]};
`;

export const LoginLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.timing.out} 0.2s;

  strong {
    color: ${theme.colors.secondary.main};
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  &:hover {
    color: ${theme.colors.secondary.main};

    strong {
      text-decoration: underline;
    }
  }
`;

export const RightSection = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main}15 0%,
    ${theme.colors.primary.main}15 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.colors.secondary.main.replace(
      "#",
      ""
    )}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: ${theme.breakpoints.lg}) {
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
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.tight};
  margin-bottom: ${theme.spacing[6]};
`;

export const GradientText = styled.span`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.primary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
  margin-bottom: ${theme.spacing[8]};
`;

export const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  text-align: left;
`;

export const BenefitItem = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: flex-start;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.3s);

  &:nth-child(1) {
    --i: 0;
  }
  &:nth-child(2) {
    --i: 1;
  }
  &:nth-child(3) {
    --i: 2;
  }
`;

export const BenefitIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main}20,
    ${theme.colors.primary.main}20
  );
  border-radius: ${theme.borderRadius.lg};
  flex-shrink: 0;

  svg {
    color: ${theme.colors.secondary.main};
  }
`;

export const BenefitText = styled.div`
  flex: 1;
`;

export const BenefitTitle = styled.div`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

export const BenefitDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;
