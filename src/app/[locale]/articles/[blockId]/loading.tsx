import { Skeleton } from '@/components/ui/skeleton';
import { NotionPageSkeleton } from '@/features/notion/components/notion-page-skeleton';

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex w-[calc(100vw-1.5rem)] max-w-250 flex-col gap-8">
      <Skeleton className="size-10 rounded-full" />

      <NotionPageSkeleton />

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Skeleton className="h-11 w-36" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
