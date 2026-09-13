import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { type ElementType } from 'react';

type TypographyVariat = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
type TypographyWeight = 'regular' | 'medium' | 'bold' | 'black' | 'light';
type TypographyProps = {
  variant: TypographyVariat;
  weight: TypographyWeight;
  className?: string;
  children: React.ReactNode;
};

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl',
      h2: 'text-3xl',
      h3: 'text-2xl',
      h4: 'text-xl',
      h5: 'text-lg',
      h6: 'text-base',
      body: '',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
      black: 'font-black',
      light: 'font-light',
    },
  },
});

const elementMap: Record<string, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
};

export function Typography({ variant, weight, className, children }: TypographyProps) {
  const Component = elementMap[variant] as ElementType;

  return <Component className={cn(typographyVariants({ variant, weight, className }))}>{children}</Component>;
}
