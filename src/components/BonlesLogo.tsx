import React from 'react';

interface BonlesLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'stacked';
  className?: string;
}

export const BonlesLogo: React.FC<BonlesLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
}) => {
  const sizes = {
    sm: {
      mark: 'h-9 w-9',
      title: 'text-base',
      subtitle: 'text-[7px]',
      gap: 'gap-2.5',
    },
    md: {
      mark: 'h-11 w-11',
      title: 'text-lg',
      subtitle: 'text-[8px]',
      gap: 'gap-3',
    },
    lg: {
      mark: 'h-14 w-14',
      title: 'text-2xl',
      subtitle: 'text-[9px]',
      gap: 'gap-3.5',
    },
  };

  const current = sizes[size];

  if (variant === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center ${className}`}
        aria-label="BONLES"
      >
        <div
          className={`${current.mark} relative flex items-center justify-center overflow-hidden rounded-full border border-[#F5A623]/40 bg-[#160608] shadow-[0_8px_30px_rgba(0,0,0,0.25)]`}
        >
          <div className="absolute inset-1 rounded-full border border-[#D82824]/30" />

          <span className="relative z-10 font-serif text-sm font-black tracking-tight text-[#F5A623]">
            B
          </span>
        </div>

        <div className="mt-2 text-center">
          <div
            className={`font-serif font-black tracking-[0.12em] text-white ${current.title}`}
          >
            BONLES
          </div>

          <div
            className={`mt-0.5 font-sans font-medium uppercase tracking-[0.24em] text-[#A89886] ${current.subtitle}`}
          >
            FOOD NUSANTARA
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center ${current.gap} ${className}`}
      aria-label="BONLES FOOD NUSANTARA"
    >
      {/* Brand mark */}
      <div
        className={`${current.mark} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#F5A623]/40 bg-[#160608] shadow-[0_8px_30px_rgba(0,0,0,0.22)]`}
      >
        <div className="absolute inset-1 rounded-full border border-[#D82824]/30" />

        {/* Decorative curve */}
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border border-[#F5A623]/20" />

        <span className="relative z-10 font-serif text-sm font-black tracking-tight text-[#F5A623]">
          B
        </span>
      </div>

      {/* Wordmark */}
      <div className="min-w-0">
        <div
          className={`font-serif font-black leading-none tracking-[0.08em] text-white ${current.title}`}
        >
          BONLES
        </div>

        <div
          className={`mt-1 whitespace-nowrap font-sans font-medium uppercase tracking-[0.22em] text-[#A89886] ${current.subtitle}`}
        >
          FOOD NUSANTARA
        </div>
      </div>
    </div>
  );
};
