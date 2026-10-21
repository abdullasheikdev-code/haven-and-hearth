import React from 'react';

export const EmptyInventoryIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="120" cy="120" r="110" fill="#FAF0EB" />
    {/* Wooden Pantry Crate Open */}
    <rect x="55" y="110" width="130" height="75" rx="6" fill="#ECE3D8" stroke="#1A382B" strokeWidth="4" />
    <line x1="55" y1="135" x2="185" y2="135" stroke="#1A382B" strokeWidth="3" />
    <line x1="55" y1="160" x2="185" y2="160" stroke="#1A382B" strokeWidth="3" />
    {/* Clean Herb Sprig Resting inside */}
    <path d="M120 120C110 100 95 85 85 80" stroke="#2A5541" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="85" cy="80" rx="8" ry="4" transform="rotate(-30 85 80)" fill="#2A5541" />
    <ellipse cx="98" cy="92" rx="7" ry="3.5" transform="rotate(30 98 92)" fill="#2A5541" />
    {/* Clipboard with Checklist */}
    <rect x="135" y="65" width="45" height="60" rx="4" fill="#FDFBF7" stroke="#1A382B" strokeWidth="2.5" />
    <rect x="147" y="60" width="20" height="7" rx="2" fill="#EAA838" />
    <line x1="145" y1="80" x2="170" y2="80" stroke="#C85A32" strokeWidth="2" strokeLinecap="round" />
    <line x1="145" y1="92" x2="165" y2="92" stroke="#585E5A" strokeWidth="2" strokeLinecap="round" />
    <line x1="145" y1="104" x2="168" y2="104" stroke="#585E5A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
