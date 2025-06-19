import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  LogIn,
  UserPlus,
  Calendar,
  Clock,
  Users,
  Shield,
  Smartphone,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";

export function Home() {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <Logo size="lg" variant="full" onClick={() => navigate("/")} />
          <AuthButtons>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              leftIcon={<LogIn size={18} />}
            >
              Entrar
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/register")}
              leftIcon={<UserPlus size={18} />}
            >
              Criar Conta
            </Button>
          </AuthButtons>
        </HeaderContent>
      </Header>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Transforme a experiência de
            <Highlight> reservas </Highlight>
            do seu restaurante
          </HeroTitle>
          <HeroSubtitle>
            Sistema completo de gestão de reservas com interface moderna e
            dashboard administrativo intuitivo.
          </HeroSubtitle>
          <HeroActions>
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              leftIcon={<UserPlus size={20} />}
            >
              Começar Agora
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              leftIcon={<LogIn size={20} />}
            >
              Já tenho conta
            </Button>
          </HeroActions>
          <TrustIndicators>
            <TrustItem>
              <Star size={16} />
              <span>Fácil de usar</span>
            </TrustItem>
            <TrustItem>
              <Shield size={16} />
              <span>100% Seguro</span>
            </TrustItem>
            <TrustItem>
              <CheckCircle size={16} />
              <span>Suporte completo</span>
            </TrustItem>
          </TrustIndicators>
        </HeroContent>
        <HeroImage>
          <DashboardPreview>
            <PreviewHeader>
              <div></div>
              <div></div>
              <div></div>
            </PreviewHeader>
            <PreviewContent>
              <PreviewCard>
                <Calendar size={24} />
                <div>
                  <h4>Dashboard Intuitivo</h4>
                  <p>Visualize todas as reservas</p>
                </div>
              </PreviewCard>
              <PreviewCard>
                <Clock size={24} />
                <div>
                  <h4>Tempo Real</h4>
                  <p>Atualizações instantâneas</p>
                </div>
              </PreviewCard>
              <PreviewCard>
                <Users size={24} />
                <div>
                  <h4>Gestão Completa</h4>
                  <p>Mesas, clientes, horários</p>
                </div>
              </PreviewCard>
            </PreviewContent>
          </DashboardPreview>
        </HeroImage>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Funcionalidades Poderosas</SectionTitle>
            <SectionSubtitle>
              Tudo que você precisa para gerenciar seu restaurante
            </SectionSubtitle>
          </SectionHeader>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Calendar size={32} />
              </FeatureIcon>
              <FeatureTitle>Gestão de Reservas</FeatureTitle>
              <FeatureDescription>
                Sistema completo para criar, editar, confirmar e cancelar
                reservas com facilidade total.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Users size={32} />
              </FeatureIcon>
              <FeatureTitle>Controle de Mesas</FeatureTitle>
              <FeatureDescription>
                Gerencie disponibilidade, capacidade e status de todas as mesas
                em tempo real.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Smartphone size={32} />
              </FeatureIcon>
              <FeatureTitle>Interface Responsiva</FeatureTitle>
              <FeatureDescription>
                Acesse de qualquer dispositivo com design moderno e intuitivo
                otimizado para mobile.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Shield size={32} />
              </FeatureIcon>
              <FeatureTitle>Segurança Total</FeatureTitle>
              <FeatureDescription>
                Autenticação segura, controle de acesso por roles e proteção
                completa dos dados.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Clock size={32} />
              </FeatureIcon>
              <FeatureTitle>Tempo Real</FeatureTitle>
              <FeatureDescription>
                Notificações instantâneas e atualizações automáticas para toda a
                equipe.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Star size={32} />
              </FeatureIcon>
              <FeatureTitle>Dashboard Completo</FeatureTitle>
              <FeatureDescription>
                Relatórios, estatísticas e insights para otimizar o desempenho
                do restaurante.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* How it Works Section */}
      <HowItWorksSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Como Funciona</SectionTitle>
            <SectionSubtitle>
              Em poucos passos você já está gerenciando seu restaurante
            </SectionSubtitle>
          </SectionHeader>
          <StepsGrid>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Criar Conta</StepTitle>
              <StepDescription>
                Registre-se como administrador ou cliente em segundos
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Configurar Mesas</StepTitle>
              <StepDescription>
                Defina suas mesas, capacidades e disponibilidades
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Receber Reservas</StepTitle>
              <StepDescription>
                Comece a receber e gerenciar reservas imediatamente
              </StepDescription>
            </StepCard>
          </StepsGrid>
        </Container>
      </HowItWorksSection>

      {/* CTA Section */}
      <CTASection>
        <Container>
          <CTAContent>
            <CTATitle>Pronto para transformar seu restaurante?</CTATitle>
            <CTASubtitle>
              Junte-se a centenas de restaurantes que já usam nossa plataforma
            </CTASubtitle>
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              rightIcon={<ArrowRight size={20} />}
            >
              Começar Gratuitamente
            </Button>
          </CTAContent>
        </Container>
      </CTASection>

      {/* Footer */}
      <Footer>
        <Container>
          <FooterContent>
            <FooterSection>
              <FooterLogo>
                <Logo size="lg" variant="full" />
              </FooterLogo>
              <FooterText>
                A solução completa para gestão de reservas do seu restaurante.
              </FooterText>
            </FooterSection>
            <FooterSection>
              <FooterTitle>Contato</FooterTitle>
              <FooterLinks>
                <FooterLink>
                  <Mail size={16} />
                  contato@reservafacil.com
                </FooterLink>
                <FooterLink>
                  <Phone size={16} />
                  (11) 99999-9999
                </FooterLink>
                <FooterLink>
                  <MapPin size={16} />
                  Pau dos Ferros, RN
                </FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            <p>&copy; 2025 ReservaFácil. Todos os direitos reservados.</p>
          </FooterBottom>
        </Container>
      </Footer>
    </LandingContainer>
  );
}

// Animações
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const HeaderContent = styled.div`
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

const AuthButtons = styled.div`
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

const HeroSection = styled.section`
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

const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const HeroTitle = styled.h1`
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

const Highlight = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    color: ${({ theme }) => theme.colors.semantic.success};
  }
`;

const HeroImage = styled.div`
  display: flex;
  justify-content: center;
  animation: ${float} 6s ease-in-out infinite;
`;

const DashboardPreview = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
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

const PreviewContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PreviewCard = styled.div`
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

const Container = styled.div`
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

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[16]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
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

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const HowItWorksSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing[12]};
  }
`;

const StepCard = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  color: white;
`;

const CTAContent = styled.div`
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const CTASubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.neutral[900]};
  color: white;
  padding: ${({ theme }) => theme.spacing[16]} 0
    ${({ theme }) => theme.spacing[8]};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing[12]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.neutral[300]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FooterLink = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[300]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[700]};

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;
