import React from 'react';

export default function StatGauge({ label, value, max = 100, isRad = false }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="gauge-container">
      <div className="gauge-label">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="gauge-bar-outer">
        <div
          className={`gauge-bar-inner ${isRad ? 'radiation' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
