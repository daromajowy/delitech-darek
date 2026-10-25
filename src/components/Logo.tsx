import React from 'react';
import { siteConfig } from '../site';

interface LogoProps {
  variant?: 'light' | 'dark';
  markOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// "light" = logo for light backgrounds (header); "dark" = negative logo with a light wordmark (navy footer).
export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  markOnly = false,
  className = '',
  size = 'md',
}) => {
  const base = siteConfig()?.urls.home || '/';
  const sizes = markOnly
    ? { sm: 'w-6', md: 'w-8', lg: 'w-10' }
    : { sm: 'w-40', md: 'w-52 sm:w-60', lg: 'w-64' };
  const file = markOnly
    ? 'favicon.svg'
    : variant === 'dark'
      ? 'intelispaces-logo-poziome-negatyw.svg'
      : 'intelispaces-logo-poziome.svg';

  return (
    <span className={`inline-flex shrink-0 items-center select-none ${className}`}>
      <img
        src={`${base}assets/brand/${file}`}
        alt="InteliSpaces – Technologia inteligentnych przestrzeni"
        width={markOnly ? 32 : 845}
        height={markOnly ? 32 : 140}
        className={`${sizes[size]} block h-auto max-w-full`}
      />
    </span>
  );
};
