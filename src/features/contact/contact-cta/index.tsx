import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button-variants';
import { RESUME_URL } from '@/lib/constant';
import { ContactDialog } from '../contact-dialog';

// Server component: RESUME_URL is server-only, so the anchor must render here, not in a client child.
export async function ContactCta() {
  const t = await getTranslations('contact');

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <ContactDialog />
      <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline' })}>
        {t('resume')}
      </a>
    </div>
  );
}
