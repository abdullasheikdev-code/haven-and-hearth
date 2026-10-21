import React from 'react';

export const ReservationSuccessIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="120" cy="120" r="110" fill="#EDF4F0" />
    {/* Elegant Round Bistro Table */}
    <ellipse cx="120" cy="150" rx="70" ry="25" fill="#FDFBF7" stroke="#1A382B" strokeWidth="4" />
    <path d="M120 175V205" stroke="#1A382B" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 205H140" stroke="#1A382B" strokeWidth="6" strokeLinecap="round" />
    {/* Wine Glasses Toasting */}
    <path d="M105 130C105 118 115 110 115 100V85H95V100C95 110 105 118 105 130Z" fill="#C85A32" opacity="0.6" stroke="#1A382B" strokeWidth="2.5" />
    <line x1="105" y1="130" x2="105" y2="148" stroke="#1A382B" strokeWidth="2.5" />
    <ellipse cx="105" cy="148" rx="8" ry="3" fill="#1A382B" />

    <path d="M135 130C135 118 125 110 125 100V85H145V100C145 110 135 118 135 130Z" fill="#C85A32" opacity="0.6" stroke="#1A382B" strokeWidth="2.5" />
    <line x1="135" y1="130" x2="135" y2="148" stroke="#1A382B" strokeWidth="2.5" />
    <ellipse cx="135" cy="148" rx="8" ry="3" fill="#1A382B" />

    {/* Sparkles / Toast Confetti */}
    <circle cx="120" cy="75" r="4" fill="#EAA838" />
    <path d="M120 55L122 62L129 62L123 66L125 73L120 68L115 73L117 66L111 62L118 62Z" fill="#EAA838" />
    <circle cx="85" cy="80" r="3" fill="#C85A32" />
    <circle cx="155" cy="80" r="3" fill="#C85A32" />
    {/* Reserved Table Card */}
    <rect x="110" y="140" width="20" height="12" rx="2" fill="#EAA838" />
  </svg>
);
