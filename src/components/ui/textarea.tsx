import { cn } from '@/lib/utils';
import { inputClass } from './input';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(inputClass, 'min-h-28 py-3', className)} {...props} />;
}

export { Textarea };
