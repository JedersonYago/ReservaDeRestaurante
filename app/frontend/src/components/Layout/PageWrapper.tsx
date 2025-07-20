import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.spacing[16]});
  background: ${({ theme }) => theme.colors.background.secondary};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const PageWrapperWithFixedActionBar = styled(PageWrapper)`
  padding-bottom: 120px; /* Espaço suficiente para a FixedActionBar */

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-bottom: 130px; /* Espaço maior para acomodar possível layout 2x2 */
  }

  @media (max-width: 480px) {
    padding-bottom: 140px; /* Espaço extra em telas muito pequenas */
  }
`;
