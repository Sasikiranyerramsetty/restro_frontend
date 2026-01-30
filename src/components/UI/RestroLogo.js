import React from 'react';
import clsx from 'clsx';

const RestroLogo = ({ className }) => {
  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        role="img"
        aria-label="Restro logo"
      >
        <defs>
          <radialGradient id="restroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#fde68a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="46" fill="url(#restroGlow)" className="animate-logo-glow" />
        <path
          d="M60 22c6 10 7 21 0 32-7-11-6-22 0-32Z"
          fill="#facc15"
          className="animate-logo-breathe"
        />
        <path
          d="M42 34c9 2 16 9 18 19-10-2-17-9-18-19Z"
          fill="#fb7185"
          opacity="0.9"
          className="animate-logo-breathe"
        />
        <path
          d="M78 34c-9 2-16 9-18 19 10-2 17-9 18-19Z"
          fill="#22d3ee"
          opacity="0.75"
          className="animate-logo-breathe"
        />
        <path
          d="M44 68c7-6 16-7 25-2-8 6-17 7-25 2Z"
          fill="#fbbf24"
          opacity="0.9"
          className="animate-logo-bounce"
        />
        <path
          d="M76 68c-7-6-16-7-25-2 8 6 17 7 25 2Z"
          fill="#fb7185"
          opacity="0.85"
          className="animate-logo-bounce"
        />
        <circle cx="60" cy="60" r="8" fill="#0f172a" opacity="0.82" />
        <circle cx="57" cy="58" r="2" fill="#fefce8" />
      </svg>
    </div>
  );
};

export default RestroLogo;















