import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light" | "mono" | "github" | "githubDark";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Load theme from localStorage or default to 'dark'
    return (localStorage.getItem("theme") as Theme) || "dark";
  });

  useEffect(() => {
    // Save to localStorage when theme changes
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
