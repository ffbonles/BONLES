import React from 'react';

interface BonlesLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'mark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightBg?: boolean;
}

export const BonlesLogo: React.FC<BonlesLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  lightBg = true,
}) => {
  const sizeMap = {
    sm: {
      icon: 'w-8 h-8',
      text: 'text-[17px]',
      sub: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-[21px]',
      sub: 'text-[9px]',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-14 h-14',
      text: 'text-[30px]',
      sub: 'text-[10px]',
      gap: 'gap-3',
    },
    xl: {
      icon: 'w-20 h-20',
      text: 'text-[42px]',
      sub: 'text-[12px]',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];

  /*
   * BONLES BRAND MARK
   *
   * Warna utama logo tetap dipertahankan sebagai identitas:
   * - Red
   * - Green
   *
   * Namun stroke dibuat lebih refined agar cocok
   * dengan visual premium.
   */
  const LogoMark = (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize.icon} shrink-0 select-none transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
      aria-hidden="true"
    >
      {/* Upper Green Fish Head */}
      <path
        d="M148 46
           C180 32 222 36 238 48
           C220 70 178 72 150 56Z"
        fill="#16805F"
        stroke="#09271F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Eye */}
      <circle
        cx="206"
        cy="48"
        r="4"
        fill="#09271F"
      />

      {/* Main Red Dynamic Body */}
      <path
        d="M104 68
           L110 57
           C142 56 192 68 238 58
           C220 86 172 96 126 94
           C82 108 64 148 60 188
           C54 150 72 102 104 68Z"
        fill="#B83B32"
        stroke="#09271F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Lower Green Belly */}
      <path
        d="M94 96
           C144 94 186 98 206 82
           C188 120 116 122 94 96Z"
        fill="#16805F"
        stroke="#09271F"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />

      {/* Tail / Fin */}
      <path
        d="M28 66
           C52 82 68 96 70 108
           C54 94 38 82 28 66Z"
        fill="#16805F"
        stroke="#09271F"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />

      {/* BFF Badge */}
      <circle
        cx="78"
        cy="74"
        r="14"
        fill="#FCFAF5"
        stroke="#09271F"
        strokeWidth="2"
      />

      <text
        x="78"
        y="78"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fill="#09271F"
        letterSpacing="-0.5"
      >
        BFF
      </text>
    </svg>
  );

  if (variant === 'mark') {
    return (
      <div
        className={`group inline-flex items-center justify-center ${className}`}
      >
        {LogoMark}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`group inline-flex flex-col items-center justify-center ${className}`}
      >
        <div className="relative">
          {LogoMark}

          <div
            className="
              absolute
              -bottom-1
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              border
              border-[#C9A45C]/40
              bg-[#FCFAF5]
              px-2.5
              py-0.5
              text-[7px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#123C32]
            "
          >
            Borneo Crafted
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={`group flex flex-col items-center text-center ${className} select-none`}
      >
        {LogoMark}

        <div className="mt-1.5 flex flex-col items-center">
          <span
            className={`
              ${currentSize.text}
              font-display
              italic
              font-semibold
              leading-none
              tracking-[-0.035em]
              ${
                lightBg
                  ? 'text-[#09271F]'
                  : 'text-[#FCFAF5]'
              }
            `}
          >
            Bonlés
          </span>

          <div className="relative mt-1">
            <span
              className={`
                ${currentSize.sub}
                font-sans
                font-bold
                uppercase
                tracking-[0.28em]
                ${
                  lightBg
                    ? 'text-[#B18B4B]'
                    : 'text-[#D8B878]'
                }
              `}
            >
              FOOD
            </span>

            <div className="mx-auto mt-1 h-px w-5 bg-[#C9A45C]" />
          </div>
        </div>
      </div>
    );
  }

  /*
   * HORIZONTAL LOCKUP
   */
  return (
    <div
      className={`
        group
        inline-flex
        items-center
        ${currentSize.gap}
        ${className}
        select-none
      `}
    >
      {LogoMark}

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span
            className={`
              ${currentSize.text}
              font-display
              italic
              font-semibold
              leading-none
              tracking-[-0.035em]
              ${
                lightBg
                  ? 'text-[#09271F]'
                  : 'text-[#FCFAF5]'
              }
            `}
          >
            Bonlés
          </span>

          <span
            className="
              font-sans
              text-[8px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#B18B4B]
            "
          >
            FOOD
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span
            className={`
              ${currentSize.sub}
              font-sans
              font-semibold
              uppercase
              tracking-[0.18em]
              ${
                lightBg
                  ? 'text-[#65706A]'
                  : 'text-[#CFCFC7]'
              }
            `}
          >
            PT. Bonles Food Nusantara
          </span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#C9A45C]
            "
          />
        </div>
      </div>
    </div>
  );
};
