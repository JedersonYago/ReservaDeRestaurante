import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className }: UserDropdownProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar dropdown com Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <DropdownContainer className={className} ref={dropdownRef}>
      <DropdownTrigger
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menu do usuário"
      >
        <UserInfo>
          <UserAvatar>
            {user.name?.[0]?.toUpperCase() ||
              user.username?.[0]?.toUpperCase() ||
              "U"}
          </UserAvatar>
          <UserDetails>
            <UserName>{user.name || user.username}</UserName>
            <UserRole>
              {user.role === "admin" ? "Administrador" : "Cliente"}
            </UserRole>
          </UserDetails>
        </UserInfo>
        <ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </DropdownTrigger>

      <DropdownMenu $isOpen={isOpen} role="menu">
        <DropdownItem
          as={Link}
          to="/profile"
          onClick={handleMenuItemClick}
          role="menuitem"
        >
          <User size={16} />
          Meu Perfil
        </DropdownItem>

        {user.role === "admin" && (
          <DropdownItem
            as={Link}
            to="/settings"
            onClick={handleMenuItemClick}
            role="menuitem"
          >
            <Settings size={16} />
            Configurações
          </DropdownItem>
        )}

        <DropdownDivider />

        <DropdownItem
          as="button"
          onClick={handleLogout}
          role="menuitem"
          $variant="danger"
        >
          <LogOut size={16} />
          Sair da Conta
        </DropdownItem>
      </DropdownMenu>
    </DropdownContainer>
  );
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.neutral[200]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  &[aria-expanded="true"] {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const UserAvatar = styled.div`
  width: ${({ theme }) => theme.spacing[8]};
  height: ${({ theme }) => theme.spacing[8]};
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[0.5]};
  min-width: 0;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: transform ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[1]});
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[2]};
  z-index: ${({ theme }) => theme.zIndex.dropdown};

  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-8px")});
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    right: 16px;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }
`;

const DropdownItem = styled.div<{ $variant?: "danger" }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $variant }) =>
    $variant === "danger"
      ? theme.colors.semantic.error
      : theme.colors.text.primary};
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "danger"
        ? `${theme.colors.semantic.error}10`
        : theme.colors.neutral[100]};
    color: ${({ theme, $variant }) =>
      $variant === "danger"
        ? theme.colors.semantic.error
        : theme.colors.primary.main};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: -2px;
  }

  svg {
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.hr`
  margin: ${({ theme }) => theme.spacing[2]} 0;
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral[200]};
`;
