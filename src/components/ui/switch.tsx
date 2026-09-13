'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';
import { type ReactElement } from 'react';

function Switch({
  className,
  size = 'default',
  iconOn,
  iconOff,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default' | 'xl';
  iconOn?: ReactElement;
  iconOff?: ReactElement;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-unchecked:bg-input/80 shrink-0 rounded-full border border-transparent focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-[18.4px] data-[size=xl]:h-[27.6px] data-[size=default]:w-8 data-[size=xl]:w-12 data-[size=sm]:h-3.5 data-[size=sm]:w-6 peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 cursor-pointer',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="group bg-background dark:data-unchecked:bg-foreground dark:data-checked:bg-primary-foreground rounded-full group-data-[size=default]/switch:size-4 group-data-[size=xl]/switch:size-6 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=xl]/switch:data-checked:translate-x-[calc(100%-3px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-[size=xl]/switch:data-unchecked:translate-x-px pointer-events-none ring-0 transition-transform flex"
      >
        {iconOn && (
          <span className="hidden group-data-checked:flex items-center justify-center text-primary w-full select-none">
            {iconOn}
          </span>
        )}

        {iconOff && (
          <span className="hidden group-data-unchecked:flex items-center justify-center text-muted-foreground w-full select-none">
            {iconOff}
          </span>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
