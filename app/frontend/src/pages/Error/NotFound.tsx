import { ErrorPage } from "./index";

export function NotFound() {
  return (
    <ErrorPage
      errorCode="404"
      errorTitle="Página não encontrada"
      errorMessage="A página que você está procurando não existe ou foi removida. Verifique o endereço digitado."
    />
  );
}
