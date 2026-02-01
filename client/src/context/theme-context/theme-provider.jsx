import THEMES from "@/utils/constant/themes.constant";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "./theme-context";

// Theme handler component that uses location (must be inside Router)
function ThemeHandler({ theme }) {
  const location = useLocation();

  // Check if current route is a dashboard route
  const isDashboard =
    location.pathname.includes("/user-dashboard") ||
    location.pathname.includes("/admin-dashboard");

  useEffect(() => {
    const body = document.body;

    // Force light mode for dashboards, otherwise use selected theme
    if (isDashboard) {
      body.classList.remove("dark");
    } else {
      switch (theme) {
        case THEMES.DARK:
          body.classList.add("dark");
          break;
        case THEMES.LIGHT:
          body.classList.remove("dark");
          break;
        default:
          body.classList.remove("dark");
      }
    }

    // Only save theme if not in dashboard
    if (!isDashboard && theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, location.pathname, isDashboard]);

  return null;
}

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

  // Apply initial theme on mount
  useEffect(() => {
    const body = document.body;
    if (theme === THEMES.DARK) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeHandler };
