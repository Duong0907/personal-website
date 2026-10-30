'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { PROJECTS_URL } from '@/lib/url';
import { Button } from '../ui/button';
import ArrowBackIcon from '@material-design-icons/svg/outlined/arrow_back.svg';

export function BackButton() {
  const router = useRouter();
  const t = useTranslations('navbar');

  // A visitor who landed here directly has no history to go back to.
  const handleBack = () => (window.history.length > 1 ? router.back() : router.push(PROJECTS_URL));

  return (
    <Button
      onClick={handleBack}
      aria-label={t('back')}
      variant="clear"
      size="icon"
      className="rounded-full border border-foreground hover:text-background hover:bg-foreground shadow-md"
    >
      <ArrowBackIcon className="size-6" />
    </Button>
  );
}
