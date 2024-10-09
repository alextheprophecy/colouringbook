import React from 'react';
import useTypewriterEffect from '../../Hooks/CreationChat/useTypewriterEffect';

const Message = ({ text }) => {
  const displayedText = useTypewriterEffect(text);

  return (
    <div className="text-xl font-bold">
      {displayedText}
    </div>
  );
};

export default Message;