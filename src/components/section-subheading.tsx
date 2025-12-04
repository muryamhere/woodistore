import { cn } from '@/lib/utils';
import React from 'react';

type SectionSubheadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionSubheading({
  children,
  className,
}: SectionSubheadingProps) {
  return (
    <p
      className={cn(
        'mx-auto max-w-lg text-muted-foreground md:max-w-lg lg:max-w-2xl text-sm md:text-xs lg:text-base',
        className
      )}
    >
      {children}
    </p>
  );
}
