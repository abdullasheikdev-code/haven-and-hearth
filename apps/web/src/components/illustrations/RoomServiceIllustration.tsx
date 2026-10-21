import React from 'react';

export const RoomServiceIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="120" cy="120" r="110" fill="#EDF4F0" />
    {/* Silver Cloche Dish Platter */}
    <rect x="40" y="160" width="160" height="12" rx="6" fill="#1A382B" />
    <path
      d="M55 160C55 105 84 90 120 90C156 90 185 105 185 160H55Z"
      fill="#FDFBF7"
      stroke="#1A382B"
      strokeWidth="4"
    />
    {/* Cloche Handle Knob */}
    <circle cx="120" cy="80" r="10" fill="#EAA838" stroke="#1A382B" strokeWidth="3" />
    {/* Steam vapor ripples */}
    <path d="M105 65C102 55 108 48 105 38" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M120 60C118 50 124 42 120 32" stroke="#EAA838" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M135 65C132 55 138 48 135 38" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
    {/* Room Key Bell Accent */}
    <rect x="80" y="180" width="80" height="6" rx="3" fill="#D5E5DC" />
    {/* Wine glass & napkin */}
    <path d="M175 125L185 155H165L175 125Z" fill="#C85A32" opacity="0.25" />
  </svg>
);
