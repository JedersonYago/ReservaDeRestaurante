import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";
import { ProtectedRoute } from "./ProtectedRoute";

export function ProtectedLayout() {
  const location = useLocation();

  // Rotas que precisam de permissão de admin
  const adminRoutes = ["/tables/new", "/tables/edit", "/settings"];
  const isAdminRoute = adminRoutes.some(
    (route) =>
      location.pathname.includes(route) ||
      (route.includes("edit") &&
        location.pathname.includes("/tables/") &&
        location.pathname.includes("/edit"))
  );

  return (
    <ProtectedRoute adminOnly={isAdminRoute}>
      <SkipLink>Pular para o conteúdo principal</SkipLink>
      <Header />
      <MainContent id="main-content">
        <Outlet />
      </MainContent>
    </ProtectedRoute>
  );
}

const MainContent = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
  padding-top: calc(
    ${({ theme }) => theme.spacing[14]} + ${({ theme }) => theme.spacing[8]}
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: calc(
      ${({ theme }) => theme.spacing[16]} + ${({ theme }) => theme.spacing[10]}
    );
  }
`;
