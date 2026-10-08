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
import { Spinner } from '@/components/ui/spinner';
import { sendContactMessage, type ContactState } from '../actions';

const fieldClass =
  'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3';

const initialState: ContactState = { status: 'idle' };

function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const widget = useRef<TurnstileInstance>(null);

  // A Turnstile token is single-use, so a failed attempt needs a fresh one.
  useEffect(() => {
    if (state.status === 'error') widget.current?.reset();
  }, [state]);

  return state.status === 'success' ? (
    <p role="status">{t('success')}</p>
  ) : (
    <form action={formAction} className="relative flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        {t('name')}
        <input name="name" required maxLength={100} defaultValue={state.values?.name} className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1">
        {t('email')}
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          defaultValue={state.values?.email}
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        {t('message')}
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={5}
          defaultValue={state.values?.message}
          className={fieldClass}
        />
      </label>
      <input
        type="text"
        name="ref_code"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-2499.75"
      />
      <Turnstile ref={widget} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''} />
      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {t('error')}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending && <Spinner />}
        {t('submit')}
      </Button>
    </form>
  );
}

export function ContactDialog() {
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
        <ContactForm key={session} />
      </DialogContent>
    </Dialog>
  );
}
