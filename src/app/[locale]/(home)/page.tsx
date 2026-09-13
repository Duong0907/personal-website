import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const SOCIAL_ICON_SIZE = 28;

const SocialIcon = ({ path, altText, href }: { path: string; altText: string; href: string }) => {
  return (
    <Link href={href}>
      <Image
        className="cursor-pointer dark:invert"
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
        <Avatar className="size-37.5 bg-white">
          <AvatarImage src="/logo/kuriboh.png" />
          <AvatarFallback>Duong Phan</AvatarFallback>
        </Avatar>
        <Typography variant="h1" weight="bold">
          Duong Phan
        </Typography>
      </div>

      <Typography variant="h4" weight="light">
        {t('title')}
      </Typography>
      <Typography className="text-center max-w-125" variant="h4" weight="light">
        {t('description')}
      </Typography>

      <div className="social-group flex gap-2">
        <SocialIcon path="/icons/facebook.svg" altText="facebook-icon" href={facebookUrl} />
        <SocialIcon path="/icons/mail.svg" altText="mail-icon" href={emailUrl} />
        <SocialIcon path="/icons/linkedin.svg" altText="linkedin-icon" href={linkedinUrl} />
        <SocialIcon path="/icons/github.svg" altText="github-icon" href={githubUrl} />
      </div>
    </div>
  );
}
