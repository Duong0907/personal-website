import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CARD_COUNT = 4;

function ProjectCardSkeleton() {
  return (
    <Card className="gap-4 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-lg" />
        <Skeleton className="h-7 w-1/2" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </div>

      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-5 w-40" />
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

      <ul className="flex flex-col gap-4">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <li key={index}>
            <ProjectCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
