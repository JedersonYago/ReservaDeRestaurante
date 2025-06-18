import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  return (
    <Container>
      <Nav>
        <Logo to="/">ReservaFácil</Logo>
        <Menu>
          <MenuItem to="/dashboard">Dashboard</MenuItem>
          <MenuItem to="/reservations">Reservas</MenuItem>
          {user?.role === "admin" && <MenuItem to="/tables">Mesas</MenuItem>}
          {user?.role === "admin" && (
            <MenuItem to="/settings">Configurações</MenuItem>
          )}
        </Menu>
      </Nav>
      <UserArea>
        <MenuItem to="/profile">
          Olá, <b>{user?.name || user?.username}</b>
        </MenuItem>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </UserArea>
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-weight: bold;
  color: #2196f3;
  text-decoration: none;
`;

const Menu = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const MenuItem = styled(Link)`
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2196f3;
  }
`;

const UserArea = styled.div`
  color: #333;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d32f2f;
  }
`;
