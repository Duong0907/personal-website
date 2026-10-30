import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ContactCta } from '@/features/contact/contact-cta';

import avatar from '@/assets/duong.webp';

const SOCIAL_ICON_SIZE = 28;

// The 44px link box is the hit area; the icon inside stays 28px.
const SocialIcon = ({ path, label, href }: { path: string; label: string; href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group grid size-11 place-items-center rounded-lg focus-visible:ring-2 focus-visible:ring-highlight outline-none"
    >
      <Image
        className="dark:invert transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 motion-reduce:transform-none"
        src={path}
        width={SOCIAL_ICON_SIZE}
        height={SOCIAL_ICON_SIZE}
        alt=""
      />
    </a>
  );
};

export default async function HomePage() {
  const [t, tSite, tSocial] = await Promise.all([
    getTranslations('home'),
    getTranslations('site'),
    getTranslations('social'),
  ]);

  const facebookUrl = process.env.FACEBOOK_URL as string;
  const githubUrl = process.env.GITHUB_URL as string;
  const emailUrl = process.env.EMAIL_URL as string;
  const linkedinUrl = process.env.LINKEDIN_URL as string;

  return (
    <div className="home-page flex flex-col items-center gap-7">
      <div className="flex flex-col gap-3 items-center">
        <Avatar className="size-37.5 bg-white animate-float">
          <AvatarImage src={avatar.src} alt="" />
          <AvatarFallback>{tSite('name')}</AvatarFallback>
        </Avatar>
        <Typography variant="h1" weight="medium">
          {tSite('name')}
        </Typography>
      </div>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-1.5 rounded-full border border-border px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity  group overflow-hidden"
      >
        <span className="size-2 rounded-full bg-green-500" />

        <span className="relative grid justify-items-center">
          <Typography
            variant="body"
            weight="medium"
            className="col-start-1 row-start-1 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2"
          >
            {t('openToWork')}
          </Typography>

          <Typography
            variant="body"
            weight="bold"
            aria-hidden="true"
            className="col-start-1 row-start-1 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-highlight"
          >
            {t('myLinkedIn')}
          </Typography>
        </span>
      </a>

      <div className="flex flex-col items-center gap-3">
        <Typography variant="body" weight="medium" className="text-2xl">
          {t('title')}
        </Typography>
        <Typography variant="body" weight="light" className="text-xl text-center max-w-125">
          {t('description')}
        </Typography>
      </div>

      <ContactCta />

      <div className="social-group flex gap-1">
        <SocialIcon path="/icons/facebook.svg" label={tSocial('facebook')} href={facebookUrl} />
        <SocialIcon path="/icons/mail.svg" label={tSocial('email')} href={emailUrl} />
        <SocialIcon path="/icons/linkedin.svg" label={tSocial('linkedin')} href={linkedinUrl} />
        <SocialIcon path="/icons/github.svg" label={tSocial('github')} href={githubUrl} />
      </div>
    </div>
  );
}
