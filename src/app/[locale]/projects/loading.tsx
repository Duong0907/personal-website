import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CARD_COUNT = 4;

function ProjectCardSkeleton() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <Skeleton className="h-4 w-28" />
    </Card>
  );
}

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="w-[calc(100vw-1.5rem)] max-w-200">
      <div className="flex flex-col items-center">
        <Skeleton className="h-10 w-40 mb-2" />
        <Skeleton className="h-7 w-80 max-w-full mb-16" />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <li key={index}>
            <ProjectCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
