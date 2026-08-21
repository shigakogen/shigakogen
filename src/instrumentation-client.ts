import * as Sentry from '@sentry/nextjs';

// Chỉ bật ở production, và chỉ khi có DSN thật (chưa cấu hình thì dsn:
// undefined -> Sentry tự no-op, không throw).
Sentry.init({
  dsn: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SENTRY_DSN : undefined,
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
