import { useNavigate } from "react-router-dom";
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
import * as S from "./styles";

export function Home() {
  const navigate = useNavigate();

  return (
    <S.LandingContainer>
      {/* Header */}
      <S.Header>
        <S.HeaderContent>
          <Logo size="lg" variant="full" onClick={() => navigate("/")} />
          <S.AuthButtons>
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
          </S.AuthButtons>
        </S.HeaderContent>
      </S.Header>

      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>
            Transforme a experiência de
            <S.Highlight> reservas </S.Highlight>
            do seu restaurante
          </S.HeroTitle>
          <S.HeroSubtitle>
            Sistema completo de gestão de reservas com interface moderna e
            dashboard administrativo intuitivo.
          </S.HeroSubtitle>
          <S.HeroActions>
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
          </S.HeroActions>
          <S.TrustIndicators>
            <S.TrustItem>
              <Star size={16} />
              <span>Fácil de usar</span>
            </S.TrustItem>
            <S.TrustItem>
              <Shield size={16} />
              <span>100% Seguro</span>
            </S.TrustItem>
            <S.TrustItem>
              <CheckCircle size={16} />
              <span>Suporte completo</span>
            </S.TrustItem>
          </S.TrustIndicators>
        </S.HeroContent>
        <S.HeroImage>
          <S.DashboardPreview>
            <S.PreviewHeader>
              <div></div>
              <div></div>
              <div></div>
            </S.PreviewHeader>
            <S.PreviewContent>
              <S.PreviewCard>
                <Calendar size={24} />
                <div>
                  <h4>Dashboard Intuitivo</h4>
                  <p>Visualize todas as reservas</p>
                </div>
              </S.PreviewCard>
              <S.PreviewCard>
                <Clock size={24} />
                <div>
                  <h4>Tempo Real</h4>
                  <p>Atualizações instantâneas</p>
                </div>
              </S.PreviewCard>
              <S.PreviewCard>
                <Users size={24} />
                <div>
                  <h4>Gestão Completa</h4>
                  <p>Mesas, clientes, horários</p>
                </div>
              </S.PreviewCard>
            </S.PreviewContent>
          </S.DashboardPreview>
        </S.HeroImage>
      </S.HeroSection>

      {/* Features Section */}
      <S.FeaturesSection>
        <S.Container>
          <S.SectionHeader>
            <S.SectionTitle>Funcionalidades Poderosas</S.SectionTitle>
            <S.SectionSubtitle>
              Tudo que você precisa para gerenciar seu restaurante
            </S.SectionSubtitle>
          </S.SectionHeader>
          <S.FeaturesGrid>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Calendar size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Gestão de Reservas</S.FeatureTitle>
              <S.FeatureDescription>
                Sistema completo para criar, editar, confirmar e cancelar
                reservas com facilidade total.
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Users size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Controle de Mesas</S.FeatureTitle>
              <S.FeatureDescription>
                Gerencie disponibilidade, capacidade e status de todas as mesas
                em tempo real.
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Smartphone size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Interface Responsiva</S.FeatureTitle>
              <S.FeatureDescription>
                Acesse de qualquer dispositivo com design intuitivo e otimizado
                para mobile.
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Shield size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Segurança Total</S.FeatureTitle>
              <S.FeatureDescription>
                Autenticação segura, controle de acesso por roles e proteção
                completa dos dados.
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Clock size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Tempo Real</S.FeatureTitle>
              <S.FeatureDescription>
                Atualizações automáticas para toda a equipe.
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Star size={32} />
              </S.FeatureIcon>
              <S.FeatureTitle>Dashboard Completo</S.FeatureTitle>
              <S.FeatureDescription>
                Estatísticas para otimizar o desempenho do seu restaurante.
              </S.FeatureDescription>
            </S.FeatureCard>
          </S.FeaturesGrid>
        </S.Container>
      </S.FeaturesSection>

      {/* How it Works Section */}
      <S.HowItWorksSection>
        <S.Container>
          <S.SectionHeader>
            <S.SectionTitle>Como Funciona</S.SectionTitle>
            <S.SectionSubtitle>
              Em poucos passos você já está gerenciando seu restaurante
            </S.SectionSubtitle>
          </S.SectionHeader>
          <S.StepsGrid>
            <S.StepCard>
              <S.StepNumber>1</S.StepNumber>
              <S.StepTitle>Criar Conta</S.StepTitle>
              <S.StepDescription>
                Registre-se como administrador ou cliente em segundos
              </S.StepDescription>
            </S.StepCard>
            <S.StepCard>
              <S.StepNumber>2</S.StepNumber>
              <S.StepTitle>Configurar Mesas</S.StepTitle>
              <S.StepDescription>
                Defina suas mesas, capacidades e disponibilidades
              </S.StepDescription>
            </S.StepCard>
            <S.StepCard>
              <S.StepNumber>3</S.StepNumber>
              <S.StepTitle>Receber Reservas</S.StepTitle>
              <S.StepDescription>
                Comece a receber e gerenciar reservas imediatamente
              </S.StepDescription>
            </S.StepCard>
          </S.StepsGrid>
        </S.Container>
      </S.HowItWorksSection>

      {/* CTA Section */}
      <S.CTASection>
        <S.Container>
          <S.CTAContent>
            <S.CTATitle>Pronto para transformar seu restaurante?</S.CTATitle>
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              rightIcon={<ArrowRight size={20} />}
            >
              Começar Gratuitamente
            </Button>
          </S.CTAContent>
        </S.Container>
      </S.CTASection>

      {/* Footer */}
      <S.Footer>
        <S.Container>
          <S.FooterContent>
            <S.FooterSection>
              <S.FooterLogo>
                <Logo size="lg" variant="full" />
              </S.FooterLogo>
              <S.FooterText>
                A solução completa para gestão de reservas do seu restaurante.
              </S.FooterText>
            </S.FooterSection>
            <S.FooterSection>
              <S.FooterTitle>Contato</S.FooterTitle>
              <S.FooterLinks>
                <S.FooterLink>
                  <Mail size={16} />
                  contato@reservafacil.com
                </S.FooterLink>
                <S.FooterLink>
                  <Phone size={16} />
                  (11) 99999-9999
                </S.FooterLink>
                <S.FooterLink>
                  <MapPin size={16} />
                  Pau dos Ferros, RN
                </S.FooterLink>
              </S.FooterLinks>
            </S.FooterSection>
          </S.FooterContent>
          <S.FooterBottom>
            <p>&copy; 2025 ReservaFácil. Todos os direitos reservados.</p>
          </S.FooterBottom>
        </S.Container>
      </S.Footer>
    </S.LandingContainer>
  );
}
