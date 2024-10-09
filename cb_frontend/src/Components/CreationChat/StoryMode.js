import React, { useState } from 'react';
import ChoiceSelector from './ChoiceSelector';

const StoryMode = () => {
  const [characters, setCharacters] = useState([]);
  const [storyOutline, setStoryOutline] = useState('');

  const addCharacter = (character) => {
    setCharacters([...characters, character]);
  };

  const handleStoryOutline = (outline) => {
    setStoryOutline(outline);
  };

  const characterChoices = [
    { mode: 'hero', label: 'Hero', bgColor: 'bg-green-400', textColor: 'text-white', hoverBgColor: 'bg-green-300' },
    { mode: 'villain', label: 'Villain', bgColor: 'bg-red-400', textColor: 'text-white', hoverBgColor: 'bg-red-300' },
    // Add more character types as needed
  ];

  return (
    <div className="story-mode p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Your Story</h2>
      <ChoiceSelector choices={characterChoices} setMode={addCharacter} />
      <textarea 
        className="w-full mt-4 p-2 border rounded-md" 
        placeholder="Enter your story outline" 
        onBlur={(e) => handleStoryOutline(e.target.value)} 
      />
    </div>
  );
};

export default StoryMode;