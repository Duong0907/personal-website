import { Skeleton } from '@/components/ui/skeleton';

const SOCIAL_ICON_COUNT = 4;

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col items-center gap-7">
      <div className="flex flex-col gap-3 items-center">
        <Skeleton className="size-37.5 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Skeleton className="h-8 w-32 rounded-full" />

      <Skeleton className="h-7 w-64" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-125 max-w-[calc(100vw-1.5rem)]" />
        <Skeleton className="h-6 w-115 max-w-[calc(100vw-1.5rem)]" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Skeleton className="h-11 w-36" />
        <Skeleton className="h-11 w-32" />
      </div>

      <div className="social-group flex gap-2">
        {Array.from({ length: SOCIAL_ICON_COUNT }, (_, index) => (
          <Skeleton key={index} className="size-7 rounded-full" />
        ))}
      </div>
    </div>
  );
}
