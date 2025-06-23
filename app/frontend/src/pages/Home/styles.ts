import styled, { keyframes } from "styled-components";

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
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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
export const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const HeaderContent = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]}
      ${({ theme }) => theme.spacing[8]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: ${({ theme }) => theme.spacing[12]};
    padding-right: ${({ theme }) => theme.spacing[12]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    padding-left: ${({ theme }) => theme.spacing[16]};
    padding-right: ${({ theme }) => theme.spacing[16]};
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const HeroSection = styled.section`
  padding: 100px ${({ theme }) => theme.spacing[6]}
    ${({ theme }) => theme.spacing[16]};
  padding-top: calc(80px + ${({ theme }) => theme.spacing[14]});
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${({ theme }) => theme.spacing[8]};
    padding-top: calc(60px + ${({ theme }) => theme.spacing[14]});
    padding-bottom: ${({ theme }) => theme.spacing[12]};
    padding-left: ${({ theme }) => theme.spacing[4]};
    padding-right: ${({ theme }) => theme.spacing[4]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: calc(80px + ${({ theme }) => theme.spacing[16]});
    padding-left: ${({ theme }) => theme.spacing[8]};
    padding-right: ${({ theme }) => theme.spacing[8]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: ${({ theme }) => theme.spacing[12]};
    padding-right: ${({ theme }) => theme.spacing[12]};
    gap: ${({ theme }) => theme.spacing[16]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    padding-left: ${({ theme }) => theme.spacing[16]};
    padding-right: ${({ theme }) => theme.spacing[16]};
    gap: ${({ theme }) => theme.spacing[20]};
  }
`;

export const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

export const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  }
`;

export const Highlight = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

export const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

export const TrustIndicators = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    color: ${({ theme }) => theme.colors.semantic.success};
  }
`;

export const HeroImage = styled.div`
  display: flex;
  justify-content: center;
  animation: ${float} 6s ease-in-out infinite;
`;

export const DashboardPreview = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

export const PreviewHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.neutral[300]};

    &:first-child {
      background: #ff5f57;
    }
    &:nth-child(2) {
      background: #ffbd2e;
    }
    &:nth-child(3) {
      background: #28ca42;
    }
  }
`;

export const PreviewContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const PreviewCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing[8]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: ${({ theme }) => theme.spacing[12]};
    padding-right: ${({ theme }) => theme.spacing[12]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    padding-left: ${({ theme }) => theme.spacing[16]};
    padding-right: ${({ theme }) => theme.spacing[16]};
  }
`;

export const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[16]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }
`;

export const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: ${({ theme }) => theme.spacing[8]};
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing[10]};
  }
`;

export const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  transition: all ${({ theme }) => theme.transitions.duration[300]}
    ${({ theme }) => theme.transitions.timing.out};
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primary.light};
  }
`;

export const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main}20,
    ${({ theme }) => theme.colors.secondary.main}20
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin: 0 auto ${({ theme }) => theme.spacing[4]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const HowItWorksSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.background.primary};
`;

export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StepCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  position: relative;
`;

export const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  color: white;
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main}10,
    ${({ theme }) => theme.colors.secondary.main}10
  );
`;

export const CTAContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

export const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }
`;

export const CTASubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[16]} 0
    ${({ theme }) => theme.spacing[8]};
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
    text-align: center;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FooterLogo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const FooterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.neutral[400]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 400px;
`;

export const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const FooterLink = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[300]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[700]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[8]};
  text-align: center;

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin: 0;
  }
`;
