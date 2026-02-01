import { createContext, useContext } from "react";

// Create ThemeContext
export const ThemeContext = createContext();

// Custom hook to use ThemeContext
const useTheme = () => useContext(ThemeContext);

export default useTheme;
