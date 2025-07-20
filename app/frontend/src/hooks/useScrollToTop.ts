import { useCallback } from "react";

export function useScrollToTop() {
  const scrollToTop = useCallback((behavior: "auto" | "smooth" = "smooth") => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, []);

  const scrollToElement = useCallback(
    (elementId: string, behavior: "auto" | "smooth" = "smooth") => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior, block: "start" });
      }
    },
    []
  );

  return {
    scrollToTop,
    scrollToElement,
  };
}
