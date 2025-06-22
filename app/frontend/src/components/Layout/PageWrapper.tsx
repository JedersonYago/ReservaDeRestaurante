import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.spacing[16]});
  background: ${({ theme }) => theme.colors.background.secondary};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;
