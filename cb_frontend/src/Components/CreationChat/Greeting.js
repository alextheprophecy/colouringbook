import React from 'react';
import useTypewriterEffect from '../../Hooks/CreationChat/useTypewriterEffect';

const Greeting = () => {
  const greetingText = "Hi there! What kind of coloring book do you want to create?";
  const displayedText = useTypewriterEffect(greetingText);

  return (
    <div className="text-xl font-bold">
      {displayedText}
    </div>
  );
};

export default Greeting;