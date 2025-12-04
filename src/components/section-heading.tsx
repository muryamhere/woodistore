import { cn } from '@/lib/utils';
import React from 'react';

type SectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'text-center font-headline text-3xl font-medium md:text-4xl lg:text-5xl',
        className
      )}
    >
      {children}
    </h2>
  );
}
