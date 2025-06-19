import styled from "styled-components";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "text" | "full";
  textColor?: "black" | "white";
  onClick?: () => void;
  className?: string;
}

export function Logo({
  size = "md",
  variant = "full",
  textColor = "black",
  onClick,
  className,
}: LogoProps) {
  const iconSize = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  }[size];

  const textHeight = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  }[size];

  const renderIcon = () => (
    <IconWrapper>
      <img
        src="/Logo.svg"
        alt="ReservaFácil"
        width={iconSize}
        height={iconSize}
      />
    </IconWrapper>
  );

  const renderText = () => (
    <TextWrapper>
      <img
        src={
          textColor === "white" ? "/LogoTextWhite.svg" : "/LogoTextBlack.svg"
        }
        alt="ReservaFácil"
        height={textHeight}
      />
    </TextWrapper>
  );

  const renderContent = () => {
    switch (variant) {
      case "icon":
        return renderIcon();
      case "text":
        return renderText();
      case "full":
      default:
        return (
          <>
            {renderIcon()}
            {renderText()}
          </>
        );
    }
  };

  return (
    <LogoContainer
      onClick={onClick}
      $clickable={!!onClick}
      className={className}
    >
      {renderContent()}
    </LogoContainer>
  );
}

const LogoContainer = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: all ${({ theme }) => theme.transitions.timing.out} 0.2s;

  ${({ $clickable }) =>
    $clickable &&
    `
      &:hover {
        transform: scale(1.02);
      }
    `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
