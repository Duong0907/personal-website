import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/ui/external-link';
import { Typography } from '@/components/ui/typography';
import { RESUME_URL } from '@/lib/constant';
import { ContactDialog } from '../contact-dialog';

// Server component: RESUME_URL is server-only, so the link must render here, not in a client child.
export async function ContactCta({ withLeadIn = false }: { withLeadIn?: boolean } = {}) {
  const t = await getTranslations('contact');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {withLeadIn && (
        <Typography variant="body" weight="regular" className="text-center text-lg">
          {t('leadIn')}
        </Typography>
      )}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ContactDialog emailUrl={process.env.EMAIL_URL} />
        <Button variant="ghost" nativeButton={false} role="link" render={<ExternalLink href={RESUME_URL} />}>
          {t('resume')}
        </Button>
      </div>
    </div>
  );
}
