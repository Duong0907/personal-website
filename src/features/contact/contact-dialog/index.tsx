'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { sendContactMessage, type ContactState } from '../actions';

const initialState: ContactState = { status: 'idle' };

function ContactForm({ emailUrl }: { emailUrl?: string }) {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const widget = useRef<TurnstileInstance>(null);

  // A Turnstile token is single-use, so a failed attempt needs a fresh one.
  useEffect(() => {
    if (state.status === 'error') widget.current?.reset();
  }, [state]);

  return state.status === 'success' ? (
    <Typography variant="body" weight="regular" role="status">
      {t('success')}
    </Typography>
  ) : (
    <form action={formAction} className="relative flex flex-col gap-3">
      <Typography variant="label" weight="regular" className="flex flex-col gap-1.5">
        {t('name')}
        <Input name="name" required maxLength={100} autoComplete="name" defaultValue={state.values?.name} />
      </Typography>
      <Typography variant="label" weight="regular" className="flex flex-col gap-1.5">
        {t('email')}
        <Input
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
        />
      </Typography>
      <Typography variant="label" weight="regular" className="flex flex-col gap-1.5">
        {t('message')}
        <Textarea name="message" required maxLength={5000} rows={5} defaultValue={state.values?.message} />
      </Typography>
      <input
        type="text"
        name="ref_code"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-2499.75"
      />
      <Turnstile
        ref={widget}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
        options={{ size: 'flexible' }}
      />
      {state.status === 'error' && (
        <Typography variant="body" weight="regular" role="alert" className="text-destructive">
          {t('error')}{' '}
          {emailUrl && (
            <a href={emailUrl} className="underline underline-offset-4">
              {t('emailMe')}
            </a>
          )}
        </Typography>
      )}
      <Button type="submit" disabled={pending}>
        {pending && <Spinner />}
        {t('submit')}
      </Button>
    </form>
  );
}

export function ContactDialog({ emailUrl }: { emailUrl?: string }) {
  const t = useTranslations('contact');
  // Remounting the form on open discards the previous attempt's state.
  const [session, setSession] = useState(0);

  return (
    <Dialog onOpenChange={(open) => open && setSession((n) => n + 1)}>
      <DialogTrigger render={<Button>{t('trigger')}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <ContactForm key={session} emailUrl={emailUrl} />
      </DialogContent>
    </Dialog>
  );
}
