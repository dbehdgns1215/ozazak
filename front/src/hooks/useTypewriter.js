import React, { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 20) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // Reset on new text
    if (text) {
      let i = 0;
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

export default useTypewriter;
