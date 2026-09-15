'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '../ui/button';
import ArrowBackIcon from '@material-design-icons/svg/outlined/arrow_back.svg';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="clear"
      className="rounded-full border border-foreground hover:text-background hover:bg-foreground shadow-md"
    >
      <ArrowBackIcon className="size-6" />
    </Button>
  );
}
