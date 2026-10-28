import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-normal uppercase tracking-[0.08em] whitespace-nowrap transition-colors outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-highlight active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/85',
        outline:
          'border-foreground/20 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background aria-expanded:bg-muted',
        secondary: 'bg-muted text-foreground hover:bg-foreground/10',
        clear: 'text-foreground',
        ghost: 'text-foreground hover:bg-muted aria-expanded:bg-muted',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive',
        link: 'normal-case tracking-normal text-foreground underline-offset-4 hover:text-highlight hover:underline',
      },
      size: {
        default: 'h-11 gap-2 px-6',
        xs: 'h-7 gap-1 px-2.5 text-[0.7rem]',
        sm: 'h-9 gap-1.5 px-4 text-xs',
        lg: 'h-12 gap-2 px-8',
        icon: 'size-11',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    // Links sit inline with text, so they drop the control height and padding.
    compoundVariants: [{ variant: 'link', class: 'h-auto px-0' }],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
