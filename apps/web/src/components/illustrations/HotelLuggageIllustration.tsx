import React from 'react';

export const HotelLuggageIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="120" cy="120" r="110" fill="#FCF7EC" />
    {/* Bellhop Luggage Trolley Brass Arch */}
    <path
      d="M60 180V60C60 40 85 30 120 30C155 30 180 40 180 60V180"
      stroke="#EAA838"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line x1="120" y1="30" x2="120" y2="180" stroke="#EAA838" strokeWidth="3" />
    <rect x="45" y="175" width="150" height="12" rx="4" fill="#1A382B" />
    {/* Wheels */}
    <circle cx="65" cy="195" r="10" fill="#181B19" stroke="#EAA838" strokeWidth="3" />
    <circle cx="175" cy="195" r="10" fill="#181B19" stroke="#EAA838" strokeWidth="3" />
    {/* Leather Suitcase 1 (Large Terracotta) */}
    <rect x="75" y="125" width="90" height="50" rx="8" fill="#C85A32" stroke="#1A382B" strokeWidth="3" />
    <line x1="100" y1="125" x2="100" y2="175" stroke="#FAF0EB" strokeWidth="2.5" />
    <line x1="140" y1="125" x2="140" y2="175" stroke="#FAF0EB" strokeWidth="2.5" />
    <rect x="110" y="118" width="20" height="7" rx="3" fill="#1A382B" />
    {/* Leather Hatbox / Vanity Case 2 (Forest Green) */}
    <circle cx="120" cy="98" r="22" fill="#2A5541" stroke="#1A382B" strokeWidth="3" />
    <line x1="98" y1="98" x2="142" y2="98" stroke="#EAA838" strokeWidth="2.5" />
    <rect x="112" y="73" width="16" height="5" rx="2" fill="#EAA838" />
  </svg>
);
