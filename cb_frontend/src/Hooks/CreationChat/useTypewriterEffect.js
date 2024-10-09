import { useState, useEffect } from "react";
import React from "react";

const useTypewriterEffect = (text) => {
  const [currentMessage, setCurrentMessage] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentMessage([]);
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        const char = text[currentIndex];
        setCurrentMessage(prev => {
          if (char === '\n') {
            return [...prev, <br key={currentIndex} />];
          } else {
            return [...prev, char];
          }
        });
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return currentMessage;
};

export default useTypewriterEffect;