import { useState } from 'react';

export const useStoryMode = () => {
  const [characters, setCharacters] = useState([]);
  const [storyOutline, setStoryOutline] = useState('');

  const addCharacter = (character) => {
    setCharacters([...characters, character]);
  };

  const setOutline = (outline) => {
    setStoryOutline(outline);
    // Add logic to process the story outline
  };

  return { characters, storyOutline, addCharacter, setOutline };
};