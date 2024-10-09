import React, { useState } from 'react';
import ChoiceSelector from './ChoiceSelector';

const ThemeMode = () => {
  const [theme, setTheme] = useState(null);

  const handleThemeSelection = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const themeChoices = [
    { mode: 'animals', label: 'Animals', bgColor: 'bg-yellow-400', textColor: 'text-gray-800', hoverBgColor: 'bg-yellow-300' },
    { mode: 'superheroes', label: 'Superheroes', bgColor: 'bg-blue-500', textColor: 'text-white', hoverBgColor: 'bg-blue-400' },
    { mode: 'fantasy', label: 'Fantasy Adventures', bgColor: 'bg-purple-500', textColor: 'text-white', hoverBgColor: 'bg-purple-400' },
    { mode: 'fantasy', label: 'Fantasy Adventures', bgColor: 'bg-purple-500', textColor: 'text-white', hoverBgColor: 'bg-purple-400' },
    { mode: 'fantasy', label: 'Fantasy Adventures', bgColor: 'bg-purple-500', textColor: 'text-white', hoverBgColor: 'bg-purple-400' },
    // Add more themes as needed
  ];

  return (
    <div className="theme-mode p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Select a Theme</h2>
      <ChoiceSelector choices={themeChoices} setMode={handleThemeSelection} />
      <input 
        type="text" 
        className="w-full mt-4 p-2 border rounded-md" 
        placeholder="Custom Theme" 
        onBlur={(e) => handleThemeSelection(e.target.value)} 
      />
    </div>
  );
};

export default ThemeMode;