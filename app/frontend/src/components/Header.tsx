import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  BarChart3,
  Calendar,
  Utensils,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../hooks/useAuth";
import { Container as LayoutContainer } from "./Layout/Container";
import { Button } from "./Button";
import { UserDropdown } from "./UserDropdown";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fechar menu mobile quando navegar
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fechar menu mobile ao redimensionar tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/reservations", label: "Reservas", icon: Calendar },
    ...(user?.role === "admin"
      ? [{ path: "/tables", label: "Mesas", icon: Utensils }]
      : []),
  ];

  return (
    <>
      <HeaderContainer>
        <LayoutContainer>
          <HeaderContent>
            {/* Logo */}
            <LogoSection>
              <LogoLink
                to={user ? "/dashboard" : "/"}
                aria-label={
                  user
                    ? "ReservaFácil - Dashboard"
                    : "ReservaFácil - Página inicial"
                }
              >
                <ResponsiveLogo size="lg" variant="full" />
              </LogoLink>
            </LogoSection>

            {/* Desktop Navigation */}
            <DesktopNav>
              {navigationItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  $isActive={location.pathname === item.path}
                >
                  <ItemIcon aria-hidden="true">
                    <item.icon size={16} />
                  </ItemIcon>
                  {item.label}
                </NavItem>
              ))}
            </DesktopNav>

            {/* User Area & Mobile Menu Button */}
            <HeaderActions>
              {/* Desktop User Area */}
              <DesktopUserArea>
                <UserDropdown />
              </DesktopUserArea>

              {/* Mobile Menu Button */}
              <MobileMenuButton
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                $isOpen={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </MobileMenuButton>
            </HeaderActions>
          </HeaderContent>
        </LayoutContainer>
      </HeaderContainer>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        $isOpen={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileMenuHeader>
          <UserProfileMobile to="/profile">
            <UserAvatarMobile>
              {user?.name?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase() ||
                "👤"}
            </UserAvatarMobile>
            <UserInfoMobile>
              <UserNameMobile>{user?.name || user?.username}</UserNameMobile>
              <UserRoleMobile>
                {user?.role === "admin" ? "Administrador" : "Cliente"}
              </UserRoleMobile>
            </UserInfoMobile>
          </UserProfileMobile>

          <MobileMenuDivider />

          <MobileNavList>
            {navigationItems.map((item) => (
              <MobileNavItem
                key={item.path}
                to={item.path}
                $isActive={location.pathname === item.path}
              >
                <ItemIcon aria-hidden="true">
                  <item.icon size={20} />
                </ItemIcon>
                {item.label}
              </MobileNavItem>
            ))}

            {user?.role === "admin" && (
              <MobileNavItem
                to="/settings"
                $isActive={location.pathname === "/settings"}
              >
                <ItemIcon aria-hidden="true">
                  <Settings size={20} />
                </ItemIcon>
                Configurações
              </MobileNavItem>
            )}
          </MobileNavList>

          <MobileMenuActions>
            <Button
              variant="outline"
              fullWidth
              onClick={handleLogout}
              leftIcon={<LogOut size={20} />}
            >
              Sair da Conta
            </Button>
          </MobileMenuActions>
        </MobileMenuHeader>
      </MobileMenu>
    </>
  );
}

// Responsive Logo
const ResponsiveLogo = styled(Logo)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: scale(0.8);
  }
`;

// Header Container
const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  min-height: ${({ theme }) => theme.spacing[14]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]} 0;
    min-height: ${({ theme }) => theme.spacing[16]};
  }
`;

// Logo Section
const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

// Desktop Navigation
const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const NavItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.main : theme.colors.text.secondary};
  background: ${({ theme, $isActive }) =>
    $isActive ? `${theme.colors.primary.main}10` : "transparent"};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary.main}10;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Header Actions
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

// Desktop User Area
const DesktopUserArea = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

// Mobile Menu Button
const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.main};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border-color: ${({ theme }) => theme.colors.primary.main};
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  svg {
    stroke-width: 3;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px;
    min-height: 28px;
  }
`;

// Mobile Menu Overlay
const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: all ${({ theme }) => theme.transitions.duration[300]}
    ${({ theme }) => theme.transitions.timing.out};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Mobile Menu
const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: min(85vw, 300px);
  max-width: 300px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: ${({ theme }) => theme.zIndex.modal};
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "100%")});
  transition: transform ${({ theme }) => theme.transitions.duration[300]}
    ${({ theme }) => theme.transitions.timing.out};
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  @media (max-width: 400px) {
    width: 100vw;
    max-width: none;
  }
`;

const MobileMenuHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[5]};

  @media (max-width: 400px) {
    padding: ${({ theme }) => theme.spacing[6]}
      ${({ theme }) => theme.spacing[4]};
  }
`;

const UserProfileMobile = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.neutral[50]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const UserAvatarMobile = styled.div`
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main} 0%,
    ${({ theme }) => theme.colors.secondary.main} 100%
  );
  color: ${({ theme }) => theme.colors.primary.contrast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const UserInfoMobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const UserNameMobile = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserRoleMobile = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MobileMenuDivider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral[200]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const MobileNavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const MobileNavItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]};
  margin: 0 ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.main : theme.colors.text.primary};
  background: ${({ theme, $isActive }) =>
    $isActive ? `${theme.colors.primary.main}15` : "transparent"};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  min-height: ${({ theme }) => theme.spacing[12]};

  @media (max-width: 400px) {
    padding: ${({ theme }) => theme.spacing[3]}
      ${({ theme }) => theme.spacing[3]};
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary.main}10;
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const MobileMenuActions = styled.div`
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;
