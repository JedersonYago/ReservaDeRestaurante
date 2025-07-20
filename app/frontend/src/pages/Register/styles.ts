import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button/index";
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
  overflow-y: auto;

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
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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
  max-width: 420px;
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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

export const RoleSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const RoleTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const RoleOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const RoleOption = styled.label<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary.main : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $selected, theme }) =>
    $selected
      ? `${theme.colors.primary.main}10`
      : theme.colors.background.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary.main}15;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

export const RoleIcon = styled.div<{ $selected: boolean }>`
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary.main : theme.colors.text.secondary};
  background: ${({ $selected, theme }) =>
    $selected
      ? `${theme.colors.primary.main}20`
      : theme.colors.background.secondary};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const RoleLabel = styled.span<{ $selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary.main : theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const RoleDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const AdminCodeSection = styled.div<{ $show: boolean }>`
  max-height: ${({ $show }) => ($show ? "200px" : "0")};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.duration[300]}
    ${({ theme }) => theme.transitions.timing.out};
  margin-bottom: ${({ $show, theme }) => ($show ? theme.spacing[6] : "0")};
`;

export const AdminCodeWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.semantic.warning}10;
  border: 1px solid ${({ theme }) => theme.colors.semantic.warning}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

export const AdminCodeTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.semantic.warning};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  svg {
    color: ${({ theme }) => theme.colors.semantic.warning};
  }
`;

export const AdminCodeDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 44px;
  left: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
`;

export const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export const StrengthBar = styled.div<{ $level?: string }>`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const StrengthFill = styled.div<{
  $strength: number;
  $level?: string;
  $score?: number;
}>`
  height: 100%;
  width: ${({ $strength }) => ($strength / 5) * 100}%;
  background: ${({ $strength, theme }) =>
    $strength < 2
      ? theme.colors.semantic.error
      : $strength < 4
      ? theme.colors.semantic.warning
      : theme.colors.semantic.success};
  transition: all ${({ theme }) => theme.transitions.duration[300]}
    ${({ theme }) => theme.transitions.timing.out};
`;

export const StrengthText = styled.span<{ $strength: number; $level?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $strength, theme }) =>
    $strength < 2
      ? theme.colors.semantic.error
      : $strength < 4
      ? theme.colors.semantic.warning
      : theme.colors.semantic.success};
`;

export const StrengthIcon = styled.div<{ $level: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: ${({ theme }) => theme.spacing[1]};
  color: ${({ $level, theme }) =>
    $level === "strong"
      ? theme.colors.semantic.success
      : $level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
`;

export const PasswordSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const PasswordMatch = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const MatchText = styled.span<{ $valid: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $valid, theme }) =>
    $valid ? theme.colors.semantic.success : theme.colors.semantic.error};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const RoleSelector = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const RoleInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const RoleCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary.main : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $selected, theme }) =>
    $selected
      ? `${theme.colors.primary.main}10`
      : theme.colors.background.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => `${theme.colors.primary.main}05`};
  }

  svg {
    color: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary.main : theme.colors.text.secondary};
  }
`;

export const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

// RoleTitle e RoleDescription já estão definidos acima

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const SubmitWarning = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.semantic.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.semantic.warning}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.semantic.warning};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

export const BenefitText = styled.div`
  flex: 1;
`;

export const CheckList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const CheckItem = styled.div<{ $valid: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $valid, theme }) =>
    $valid ? theme.colors.semantic.success : theme.colors.text.secondary};
  transition: color ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  svg {
    width: 12px;
    height: 12px;
    color: ${({ $valid, theme }) =>
      $valid ? theme.colors.semantic.success : theme.colors.neutral[400]};
  }
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
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const FooterLinks = styled.div`
  text-align: center;
`;

export const LoginLink = styled(Link)`
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

export const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  text-align: left;
`;

export const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
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
  &:nth-child(4) {
    --i: 3;
  }
`;

export const BenefitIcon = styled.div`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary.main}20;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    width: 20px;
    height: 20px;
  }
`;

export const BenefitContent = styled.div`
  flex: 1;
`;

export const BenefitTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const BenefitDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;
