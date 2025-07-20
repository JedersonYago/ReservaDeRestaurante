import "styled-components";
import type { Theme } from "../styles/theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {
    // Forçar o TypeScript a aceitar todas as propriedades do tema
    [key: string]: any;
  }
}
