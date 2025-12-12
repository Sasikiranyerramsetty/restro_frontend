import React from 'react';
import { createPortal } from 'react-dom';

const UniversalLoader = ({ text = 'Loading...', visible = true }) => {
  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div className="loading-overlay" role="status" aria-live="polite" aria-label={text}>
      <div className="loading-text">
        {text.split('').map((char, idx) => (
          <span key={idx}>{char}</span>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default UniversalLoader;



