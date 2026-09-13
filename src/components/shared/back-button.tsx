'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="clear"
      className="rounded-full border border-foreground hover:text-background hover:bg-foreground"
    >
      <Icon name="arrow_left_alt" />
    </Button>
  );
}
