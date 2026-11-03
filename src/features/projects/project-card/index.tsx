'use client';
import { Card } from '@/components/ui/card';
import { ExternalLink } from '@/components/ui/external-link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageIcon from '@material-design-icons/svg/outlined/language.svg';
import StoryIcon from '@material-design-icons/svg/outlined/auto_stories.svg';
import GithubIcon from '@/assets/icons/github.svg';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { FALLBACK_CARD_IMAGE_URL } from '@/lib/constant';
import { TechList } from '../tech-list';

const linkClass = 'text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline';

export function ProjectLinks({
  storyHref,
  githubFrontendUrl,
  githubBackendUrl,
  websiteUrl,
}: {
  storyHref?: string;
  githubFrontendUrl: string;
  githubBackendUrl: string;
  websiteUrl: string;
}) {
  const t = useTranslations('projects');

  // A single repo gets a plain "GitHub" label; a split project names each side.
  const repos =
    githubFrontendUrl && githubBackendUrl
      ? [
          { href: githubFrontendUrl, label: t('frontend') },
          { href: githubBackendUrl, label: t('backend') },
        ]
      : [{ href: githubFrontendUrl || githubBackendUrl, label: 'GitHub' }].filter((repo) => repo.href);

  if (!storyHref && !repos.length && !websiteUrl) return null;

  return (
    <div className="flex flex-wrap gap-5 text-sm">
      {storyHref && (
        <Link href={storyHref} className={cn('inline-flex items-center gap-1', linkClass)}>
          <StoryIcon className="size-4" />
          {t('story')}
        </Link>
      )}
      {repos.map(({ href, label }) => (
        <ExternalLink key={label} href={href} className={linkClass}>
          <GithubIcon className="size-4" />
          {label}
        </ExternalLink>
      ))}
      {websiteUrl && (
        <ExternalLink href={websiteUrl} className={linkClass}>
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
  githubFrontendUrl,
  githubBackendUrl,
  websiteUrl,
  priority,
  delayMs,
}: {
  id: string;
  name: string;
  features: string;
  technologies: string;
  imageUrl: string;
  githubFrontendUrl: string;
  githubBackendUrl: string;
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
      <Card className="gap-4 p-6">
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
          <h2 className="text-2xl font-semibold leading-tight">{name}</h2>
        </div>

        <p className="wrap-break-word text-base text-foreground/80">{features}</p>

        <TechList technologies={technologies} />

        <ProjectLinks
          storyHref={`/articles/${id}`}
          githubFrontendUrl={githubFrontendUrl}
          githubBackendUrl={githubBackendUrl}
          websiteUrl={websiteUrl}
        />
      </Card>
    </li>
  );
}
