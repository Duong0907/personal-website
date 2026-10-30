'use client';
import { Card } from '@/components/ui/card';
import { ExternalLink } from '@/components/ui/external-link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageIcon from '@material-design-icons/svg/outlined/language.svg';
import GithubIcon from '@/assets/icons/github.svg';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { FALLBACK_CARD_IMAGE_URL } from '@/lib/constant';
import { TechList } from '../tech-list';

// z-10 keeps the links clickable above the card's stretched title link.
export function ProjectLinks({ githubUrl, websiteUrl }: { githubUrl: string; websiteUrl: string }) {
  const t = useTranslations('projects');

  if (!githubUrl && !websiteUrl) return null;

  return (
    <div className="flex gap-5 text-sm">
      {githubUrl && (
        <ExternalLink
          href={githubUrl}
          className="relative z-10 text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <GithubIcon className="size-4" />
          GitHub
        </ExternalLink>
      )}
      {websiteUrl && (
        <ExternalLink
          href={websiteUrl}
          className="relative z-10 text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <LanguageIcon className="size-4" />
          {t('website')}
        </ExternalLink>
      )}
    </div>
  );
}

export function ProjectCard({
  id,
  name,
  features,
  technologies,
  imageUrl,
  githubUrl,
  websiteUrl,
  priority,
  delayMs,
}: {
  id: string;
  name: string;
  features: string;
  technologies: string;
  imageUrl: string;
  githubUrl: string;
  websiteUrl: string;
  priority: boolean;
  delayMs: number;
}) {
  const { ref, isVisible } = useInView<HTMLLIElement>();

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        'transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      {/* The title link stretches over the card, so the external links are not nested inside it. */}
      <Card className="relative gap-4 p-6">
        <div className="flex items-center gap-4">
          <Image
            src={imageUrl || FALLBACK_CARD_IMAGE_URL}
            alt=""
            width={56}
            height={56}
            draggable={false}
            priority={priority}
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <h2 className="text-2xl font-semibold leading-tight">
            <Link href={`/articles/${id}`} className="after:absolute after:inset-0 after:rounded-xl">
              {name}
            </Link>
          </h2>
        </div>

        <p className="wrap-break-word text-base text-foreground/80">{features}</p>

        <TechList technologies={technologies} />

        <ProjectLinks githubUrl={githubUrl} websiteUrl={websiteUrl} />
      </Card>
    </li>
  );
}
