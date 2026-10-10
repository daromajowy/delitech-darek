import React from 'react';
import { siteConfig } from '../site';

interface LogoProps {
  variant?: 'light' | 'dark';
  markOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  markOnly = false,
  className = '',
  size = 'md',
}) => {
  const base = siteConfig()?.urls.home || '/';
  const sizes = markOnly
    ? { sm: 'w-6', md: 'w-8', lg: 'w-10' }
    : { sm: 'w-36', md: 'w-44 sm:w-48', lg: 'w-56' };

  return (
    <span className={`inline-flex shrink-0 items-center select-none ${variant === 'dark' ? 'rounded-md bg-[#F7F8F5] px-3 py-2' : ''} ${className}`}>
      <img
        src={`${base}brand/${markOnly ? 'favicon.svg' : 'intelispaces-logo.svg'}`}
        alt="InteliSpaces"
        width={markOnly ? 32 : 946}
        height={markOnly ? 32 : 144}
        className={`${sizes[size]} block h-auto max-w-full`}
      />
    </span>
  );
};
