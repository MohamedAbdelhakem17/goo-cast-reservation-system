import THEMES from "@/utils/constant/themes.constant";
import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

export default function ThemeProvider({ children }) {
  // State
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or use device preference
    const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    //  Determine initial theme
    return savedTheme || (deviceTheme ? THEMES.DARK : THEMES.LIGHT);
  });

  const toggleTheme = () => {
    // Detect new Theme
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

    setTheme(newTheme);
  };

  const handleChangeTheme = () => {
    const body = document.body;

    if (theme === THEMES.DARK) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleChangeTheme();
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
