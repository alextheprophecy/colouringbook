import { useState } from 'react';

export const useThemeMode = () => {
  const [theme, setTheme] = useState(null);

  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    // Add logic to handle theme selection
  };

  return { theme, selectTheme };
};