import type { Project } from '@/interfaces/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isEmpty, map } from 'lodash';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from '@/i18n/navigation';
import { FALLBACK_CARD_IMAGE_URL } from '@/lib/constant';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-8">
      {map(projects, (project) => {
        const { id, name, features, technologies, imageUrl } = project;

        return (
          <Link href={`/articles/${id}`} key={id}>
            <Card className="cursor-pointer">
              {isEmpty(imageUrl) ? (
                <AspectRatio ratio={3 / 2}>
                  <Image src={FALLBACK_CARD_IMAGE_URL} alt={name} fill draggable={false} />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={3 / 2}>
                  <Image src={imageUrl} alt={name} fill draggable={false} />
                </AspectRatio>
              )}

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
        );
      })}
    </ul>
  );
}
