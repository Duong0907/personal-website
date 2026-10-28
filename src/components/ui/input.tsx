import { cn } from '@/lib/utils';

// Shared by Textarea so both fields look the same.
export const inputClass =
  'w-full min-w-0 rounded-lg border border-foreground/20 bg-transparent px-4 text-base transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-highlight focus-visible:ring-1 focus-visible:ring-highlight disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input data-slot="input" className={cn(inputClass, 'h-11', className)} {...props} />;
}

export { Input };
