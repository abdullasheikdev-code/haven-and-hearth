import React from 'react';

export const ChefIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="120" cy="120" r="110" fill="#F5EFEB" />
    <circle cx="120" cy="120" r="95" fill="#FAF0EB" />
    {/* Chef Toque / Hat */}
    <path
      d="M85 95C75 80 85 55 105 52C112 40 128 40 135 52C155 55 165 80 155 95H85Z"
      fill="#FDFBF7"
      stroke="#1A382B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="85" y="95" width="70" height="20" rx="4" fill="#C85A32" />
    <line x1="100" y1="95" x2="100" y2="115" stroke="#FAF0EB" strokeWidth="2" />
    <line x1="120" y1="95" x2="120" y2="115" stroke="#FAF0EB" strokeWidth="2" />
    <line x1="140" y1="95" x2="140" y2="115" stroke="#FAF0EB" strokeWidth="2" />
    {/* Head & Face */}
    <circle cx="120" cy="132" r="22" fill="#EBBBAA" />
    {/* Eyes & Warm Smile */}
    <circle cx="112" cy="130" r="2.5" fill="#181B19" />
    <circle cx="128" cy="130" r="2.5" fill="#181B19" />
    <path d="M114 140C117 143 123 143 126 140" stroke="#181B19" strokeWidth="2.5" strokeLinecap="round" />
    {/* Neckerchief / Scarf */}
    <path d="M106 154L120 166L134 154Z" fill="#C85A32" />
    {/* Chef Coat */}
    <path d="M80 178C80 162 95 154 120 154C145 154 160 162 160 178V205H80V178Z" fill="#FDFBF7" stroke="#1A382B" strokeWidth="3.5" />
    {/* Double Breasted Buttons */}
    <circle cx="110" cy="172" r="3" fill="#1A382B" />
    <circle cx="130" cy="172" r="3" fill="#1A382B" />
    <circle cx="110" cy="188" r="3" fill="#1A382B" />
    <circle cx="130" cy="188" r="3" fill="#1A382B" />
    {/* Golden culinary star accents */}
    <path d="M50 80L53 88L61 88L55 93L57 101L50 96L43 101L45 93L39 88L47 88Z" fill="#EAA838" />
    <path d="M190 70L192 76L198 76L193 80L195 86L190 82L185 86L187 80L182 76L188 76Z" fill="#EAA838" />
  </svg>
);
