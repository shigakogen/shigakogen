import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SENTRY_DSN : undefined,
  tracesSampleRate: 0.1,
});
