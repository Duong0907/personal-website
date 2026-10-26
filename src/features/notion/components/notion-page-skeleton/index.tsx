import { Skeleton } from '@/components/ui/skeleton';

// Widths vary so the block reads as text, not as a grid of bars.
const LINE_WIDTHS = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-2/3'];

// 808px matches the Notion renderer's content column.
export function NotionPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-202 flex-col gap-6">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="article-lines flex flex-col gap-3">
        {LINE_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={`h-4 ${width}`} />
        ))}
      </div>
    </div>
  );
}
