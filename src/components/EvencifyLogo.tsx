import React, { useState } from 'react';

interface EvencifyLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const EvencifyLogo: React.FC<EvencifyLogoProps> = ({
  variant = 'light',
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height dimensions based on size
  const heightMap = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 md:h-20',
  };

  if (!imageError) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/evencify.logo.png"
          alt="Evencify — Events Made Easy"
          className={`${heightMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
          style={{
            filter:
              'drop-shadow(0 0 1.2px rgba(0, 0, 0, 0.85)) drop-shadow(0 1.5px 3.5px rgba(0, 0, 0, 0.28)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.14))',
          }}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  const strokeColor = variant === 'dark' ? '#FFFFFF' : '#111111';
  const fillColor = variant === 'dark' ? '#0F1014' : '#FFFFFF';
  const taglineColor = variant === 'dark' ? '#A1A1AA' : '#71717A';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox={showTagline ? '0 0 540 140' : '0 0 540 120'}
        className={`${heightMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Evencify - Events Made Easy"
      >
        {/* Left Yellow Rounded Badge for 'even' */}
        <rect x="8" y="14" width="226" height="102" rx="26" fill="#FED000" />

        {/* 'even' in solid deep black with bespoke geometry */}
        <g fill="#000000">
          {/* first 'e' */}
          <path d="M 44 68 C 44 52 56 42 71 42 C 86 42 96 52 96 69 C 96 72 95 74 94 75 L 57 75 C 58 86 65 91 75 91 C 82 91 88 87 91 82 L 99 87 C 95 95 86 102 74 102 C 55 102 44 87 44 68 Z M 57 65 L 84 65 C 83 57 78 52 71 52 C 64 52 59 57 57 65 Z" />
          {/* 'v' */}
          <path d="M 100 44 L 113 44 L 124 85 L 136 44 L 149 44 L 131 100 L 117 100 Z" />
          {/* second 'e' */}
          <path d="M 152 68 C 152 52 164 42 179 42 C 194 42 204 52 204 69 C 204 72 203 74 202 75 L 165 75 C 166 86 173 91 183 91 C 190 91 196 87 199 82 L 207 87 C 203 95 194 102 182 102 C 163 102 152 87 152 68 Z M 165 65 L 192 65 C 191 57 186 52 179 52 C 172 52 167 57 165 65 Z" />
          {/* 'n' */}
          <path d="M 210 44 L 222 44 L 222 54 C 226 47 234 42 244 42 C 257 42 263 51 263 65 L 263 100 L 251 100 L 251 68 C 251 58 246 53 238 53 C 229 53 222 59 222 70 L 222 100 L 210 100 Z" />
        </g>

        {/* Right side 'cify.' with outline styling and iconic yellow accents */}
        <g>
          {/* 'c' */}
          <path
            d="M 302 68 C 302 51 314 43 328 43 C 340 43 349 50 353 60 L 341 64 C 339 57 334 53 328 53 C 319 53 313 59 313 68 C 313 77 319 83 328 83 C 334 83 339 79 341 72 L 353 76 C 349 86 340 93 328 93 C 314 93 302 85 302 68 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* 'i' stem */}
          <rect
            x="363"
            y="44"
            width="12"
            height="49"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
            rx="1.5"
          />

          {/* Signature Yellow Triangle dot above 'i' */}
          <polygon
            points="369,21 355,41 383,41"
            fill="#FED000"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* 'f' */}
          <path
            d="M 397 44 L 389 44 L 389 53 L 384 53 L 384 62 L 389 62 L 389 93 L 401 93 L 401 62 L 410 62 L 410 53 L 401 53 L 401 48 C 401 45 403 43 406 43 C 408 43 410 44 411 44 L 413 35 C 410 34 405 33 402 33 C 393 33 388 38 388 46"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* 'y' */}
          <path
            d="M 416 44 L 428 44 L 436 71 L 445 44 L 456 44 L 442 88 C 438 100 432 105 421 105 C 418 105 414 104 412 103 L 415 94 C 417 95 419 95 421 95 C 427 95 431 91 433 84 L 416 44 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Signature Solid Yellow Period Dot '.' */}
          <circle
            cx="467"
            cy="88"
            r="8.5"
            fill="#FED000"
            stroke={strokeColor}
            strokeWidth="1.8"
          />
        </g>

        {/* Authoritative Subtext: 'EVENTS MADE EASY' */}
        {showTagline && (
          <text
            x="385"
            y="126"
            textAnchor="middle"
            fill={taglineColor}
            fontSize="11.5"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="700"
            letterSpacing="0.22em"
          >
            EVENTS MADE EASY
          </text>
        )}
      </svg>
    </div>
  );
};
