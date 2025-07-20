import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll para o topo sempre que a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Animação suave
    });
  }, [pathname]);

  return null;
}
