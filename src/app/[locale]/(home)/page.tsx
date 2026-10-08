import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ContactCta } from '@/features/contact/contact-cta';

import avatar from '@/assets/duong.webp';

const SOCIAL_ICON_SIZE = 28;

const SocialIcon = ({ path, altText, href }: { path: string; altText: string; href: string }) => {
  return (
    <Link href={href} target="_blank">
      <Image
        className="cursor-pointer dark:invert transition-transform duration-300 hover:scale-110 hover:-translate-y-0.5"
        src={path}
        width={SOCIAL_ICON_SIZE}
        height={SOCIAL_ICON_SIZE}
        alt={altText}
      />
    </Link>
  );
};

export default async function HomePage() {
  const t = await getTranslations('home');

  const facebookUrl = process.env.FACEBOOK_URL as string;
  const githubUrl = process.env.GITHUB_URL as string;
  const emailUrl = process.env.EMAIL_URL as string;
  const linkedinUrl = process.env.LINKEDIN_URL as string;

  return (
    <div className="home-page flex flex-col items-center gap-7">
      <div className="flex flex-col gap-3 items-center">
        <Avatar className="size-37.5 bg-white animate-float">
          <AvatarImage src={avatar.src} />
          <AvatarFallback>Duong Phan</AvatarFallback>
        </Avatar>
        <Typography variant="h1" weight="bold">
          Duong Phan
        </Typography>
      </div>

      <Link
        href={linkedinUrl}
        target="_blank"
        className="relative flex items-center gap-1.5 rounded-full border border-border px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity  group overflow-hidden"
      >
        <span className="size-2 rounded-full bg-green-500" />

        <span className="relative grid">
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
            className="col-start-1 row-start-1 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-blue-500"
          >
            {t('myLinkedIn')}
          </Typography>
        </span>
      </Link>

      <Typography variant="h4" weight="light">
        {t('title')}
      </Typography>
      <Typography className="text-center max-w-125" variant="h4" weight="light">
        {t('description')}
      </Typography>

      <ContactCta />

      <div className="social-group flex gap-2">
        <SocialIcon path="/icons/facebook.svg" altText="facebook-icon" href={facebookUrl} />
        <SocialIcon path="/icons/mail.svg" altText="mail-icon" href={emailUrl} />
        <SocialIcon path="/icons/linkedin.svg" altText="linkedin-icon" href={linkedinUrl} />
        <SocialIcon path="/icons/github.svg" altText="github-icon" href={githubUrl} />
      </div>
    </div>
  );
}
