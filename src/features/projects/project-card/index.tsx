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

// z-10 keeps it clickable above the stretched title link.
function ProjectLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ExternalLink href={href} className="relative z-10 text-xs opacity-60 transition-opacity hover:opacity-100">
      {children}
    </ExternalLink>
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
  const t = useTranslations('projects');
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
      {/* The title link stretches over the card, so the icon links are not nested inside it. */}
      <Card className="relative">
        <div className="flex items-start gap-3">
          <Image
            src={imageUrl || FALLBACK_CARD_IMAGE_URL}
            alt={name}
            width={40}
            height={40}
            draggable={false}
            priority={priority}
            className="size-10 shrink-0 rounded-lg object-cover"
          />
          <div>
            <h4 className="text-lg font-semibold leading-tight">
              <Link href={`/articles/${id}`} className="after:absolute after:inset-0">
                {name}
              </Link>
            </h4>
            <p className="mt-1 text-sm text-foreground/50">{technologies}</p>
          </div>
        </div>

        <p className="flex-1 text-sm text-foreground/60">{features}</p>

        {(githubUrl || websiteUrl) && (
          <div className="flex gap-4">
            {githubUrl && (
              <ProjectLink href={githubUrl}>
                <GithubIcon className="size-4" />
                GitHub
              </ProjectLink>
            )}
            {websiteUrl && (
              <ProjectLink href={websiteUrl}>
                <LanguageIcon className="size-4" />
                {t('website')}
              </ProjectLink>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
