import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export const useApplyTheme = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);
};
