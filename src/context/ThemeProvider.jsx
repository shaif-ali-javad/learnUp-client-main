import { createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // false = light, true = dark

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const themeInfo = {
    isDarkTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeInfo}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
