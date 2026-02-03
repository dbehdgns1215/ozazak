// src/components/Blueprint.js
import React from 'react';

const Blueprint = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full h-full p-px rounded-xl overflow-hidden
                 bg-[linear-gradient(theme(colors.slate.900),theme(colors.slate.900)),_linear-gradient(theme(colors.blue.400/.1),theme(colors.blue.400/.1),theme(colors.slate.900))]
                 bg-[length:100%_100%,_40px_40px] bg-no-repeat
                 shadow-lg shadow-blue-900/20
                 ${className}`}
    >
      <div
        className="absolute inset-0 w-full h-full
                   bg-[linear-gradient(theme(colors.slate.900),theme(colors.slate.900)),_linear-gradient(theme(colors.blue.400/.1),theme(colors.blue.400/.1),theme(colors.slate.900))]
                   bg-[length:100%_100%,_40px_40px] [mask:linear-gradient(transparent,white)]"
      ></div>
      <div className="relative w-full h-full p-6 bg-slate-900/70 backdrop-blur-xl rounded-xl overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Blueprint;
