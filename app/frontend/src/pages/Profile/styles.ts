import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Header = styled.header`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TitleSection = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;

  svg {
    color: #fa761f;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;

  svg {
    color: #fa761f;
  }
`;

export const SectionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: -16px 0 0 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
`;

export const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    color: #fa761f;
  }
`;

export const InfoValue = styled.div`
  color: #111827;
  font-weight: 500;
  font-size: 1rem;
`;

export const RoleBadge = styled.span<{ $role: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => (props.$role === "admin" ? "#fef3c7" : "#e0e7ff")};
  color: ${(props) => (props.$role === "admin" ? "#92400e" : "#3730a3")};
  border: 1px solid
    ${(props) => (props.$role === "admin" ? "#fbbf24" : "#a5b4fc")};
`;

export const FieldNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
  padding: 8px 12px;
  background: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #fbbf24;

  svg {
    color: #f59e0b;
    flex-shrink: 0;
  }
`;

export const PasswordStrength = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const StrengthBar = styled.div<{ level: string }>`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const StrengthFill = styled.div<{ level: string; score: number }>`
  height: 100%;
  width: ${(props) => (props.score / 5) * 100}%;
  background: ${(props) =>
    props.level === "strong"
      ? "#10b981"
      : props.level === "medium"
      ? "#f59e0b"
      : "#ef4444"};
  transition: all 0.3s ease;
  border-radius: 3px;
`;

export const StrengthText = styled.div<{ level: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${(props) =>
    props.level === "strong"
      ? "#059669"
      : props.level === "medium"
      ? "#d97706"
      : "#dc2626"};

  svg {
    color: currentColor;
  }
`;

export const CheckList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 6px;
`;

export const CheckItem = styled.div<{ valid: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.valid ? "#059669" : "#6b7280")};
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  svg {
    color: currentColor;
    flex-shrink: 0;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #fa761f;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

export const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  text-align: center;
`;

export const NotFoundIcon = styled.div`
  margin-bottom: 24px;
  color: #d1d5db;
`;

export const NotFoundContent = styled.div`
  max-width: 500px;
`;

export const NotFoundTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const NotFoundDescription = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;
