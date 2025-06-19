import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

export function ProtectedLayout() {
  return (
    <>
      <SkipLink>Pular para o conteúdo principal</SkipLink>
      <Header />
      <MainContent id="main-content">
        <Outlet />
      </MainContent>
    </>
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
