import { cn } from '@/lib/utils';

// Notion stores the stack as one comma-separated string.
export const splitTechnologies = (technologies: string) =>
  technologies
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item && item !== 'N/A');

export function TechList({ technologies, className }: { technologies: string; className?: string }) {
  const items = splitTechnologies(technologies);

  if (!items.length) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <li key={item} className="rounded-md border border-border px-2 py-0.5 font-sans text-xs text-foreground/80">
          {item}
        </li>
      ))}
    </ul>
  );
}
