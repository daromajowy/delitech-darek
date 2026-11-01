import React from 'react';
import type { IconProps } from '@phosphor-icons/react';
import { Blinds, Clapperboard } from 'lucide-react';

// Match the source's two Lucide glyphs alongside the light Phosphor family.
export function BlindsIcon({ size, className }: IconProps) {
  return <Blinds size={size} className={className} strokeWidth={1.3} aria-hidden="true" />;
}

export function ScenesIcon({ size, className }: IconProps) {
  return <Clapperboard size={size} className={className} strokeWidth={1.3} aria-hidden="true" />;
}
