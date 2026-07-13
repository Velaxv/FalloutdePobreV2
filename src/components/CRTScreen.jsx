import React from 'react';

export default function CRTScreen({ children, fullBleed = false }) {
  return (
    <div className="crt-container">
      <div className={`crt-monitor${fullBleed ? ' crt-monitor--full' : ''}`}>
        <div className="scanline" />
        <div className="crt-screen-overlay" />
        {children}
      </div>
    </div>
  );
}
