// src/components/Typewriter.js
import React, { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    if (text) {
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prevText => prevText + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [text, speed]);

  return displayText;
};

const Typewriter = ({ text, speed, className }) => {
    const displayText = useTypewriter(text, speed);
  
    return <p className={className}>{displayText}</p>;
};


export default Typewriter;
