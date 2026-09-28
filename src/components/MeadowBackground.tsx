import React from 'react';

export const MeadowBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Sky & soft ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbfdf9] via-[#f4faee] to-[#eaf5df]" />

      {/* Sun mist layer */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-white/90 via-[#f0f9e8]/70 to-transparent blur-3xl opacity-80" />

      {/* Layered Rolling Green Hills SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[650px] object-cover"
        viewBox="0 0 1440 650"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Distant hill gradient */}
          <linearGradient id="hillFar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ba53a" />
            <stop offset="50%" stopColor="#68932b" />
            <stop offset="100%" stopColor="#51781c" />
          </linearGradient>

          {/* Middle hill gradient */}
          <linearGradient id="hillMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c8720" />
            <stop offset="45%" stopColor="#4d7616" />
            <stop offset="100%" stopColor="#3c5f0f" />
          </linearGradient>

          {/* Foreground rich green hill */}
          <linearGradient id="hillFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#507c19" />
            <stop offset="35%" stopColor="#436a13" />
            <stop offset="70%" stopColor="#36580d" />
            <stop offset="100%" stopColor="#2c4809" />
          </linearGradient>

          {/* Mist overlay */}
          <linearGradient id="mist" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Back hill left */}
        <path
          d="M-100 360 Q 250 180 700 290 T 1540 220 L 1540 650 L -100 650 Z"
          fill="url(#hillFar)"
          opacity="0.85"
        />

        {/* Middle hill right */}
        <path
          d="M-50 430 Q 380 240 920 330 T 1540 290 L 1540 650 L -50 650 Z"
          fill="url(#hillMid)"
          opacity="0.95"
        />

        {/* Front rolling hill */}
        <path
          d="M-50 490 Q 320 340 760 410 T 1540 370 L 1540 650 L -50 650 Z"
          fill="url(#hillFront)"
        />

        {/* Soft grass texture ripples */}
        <path
          d="M100 480 Q 400 390 850 460"
          stroke="#7ba53a"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M600 520 Q 950 430 1350 490"
          stroke="#8ebb45"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Atmospheric mist overlay at top of hills */}
        <rect x="0" y="100" width="1440" height="340" fill="url(#mist)" />
      </svg>

      {/* Bottom gradient fade into white content */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
};
