'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { FALLBACK_CARD_IMAGE_URL } from '@/lib/constant';

export function ProjectCard({
  id,
  name,
  features,
  technologies,
  imageUrl,
  priority,
  delayMs,
}: {
  id: string;
  name: string;
  features: string;
  technologies: string;
  imageUrl: string;
  priority: boolean;
  delayMs: number;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      <Link href={`/articles/${id}`}>
        <Card className="cursor-pointer">
          <AspectRatio ratio={3 / 2} className="overflow-hidden">
            <Image
              src={imageUrl || FALLBACK_CARD_IMAGE_URL}
              alt={name}
              fill
              draggable={false}
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={priority}
              className="transition-transform duration-300 group-hover/card:scale-110"
            />
          </AspectRatio>

          <CardHeader>
            <CardDescription>
              <Typography variant="body" weight="light">
                {technologies}
              </Typography>
            </CardDescription>
            <CardTitle>
              <Typography variant="h4" weight="bold">
                {name}
              </Typography>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Typography variant="body" weight="light" className="text-muted-foreground">
              {features}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
