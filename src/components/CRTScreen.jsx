import React from 'react';

export default function CRTScreen({ children }) {
  return (
    <div className="crt-container">
      <div className="crt-monitor">
        <div className="scanline" />
        <div className="crt-screen-overlay" />
        {children}
      </div>
    </div>
  );
}
