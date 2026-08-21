import createBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = createBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const supabaseHost = 'geqlgmtoigxrbyryprey.supabase.co';

// Umami/Sentry là tuỳ chọn (bật bằng env) — chỉ thêm domain vào CSP khi
// thật sự có cấu hình, tránh mở CSP ra domain lạ không dùng tới.
const umamiHost = process.env.NEXT_PUBLIC_UMAMI_SRC
  ? new URL(process.env.NEXT_PUBLIC_UMAMI_SRC).host
  : process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
    ? 'cloud.umami.is'
    : undefined;
const sentryHost = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? new URL(process.env.NEXT_PUBLIC_SENTRY_DSN).host
  : undefined;

// Không dùng nonce theo-request (cần middleware riêng) — 'unsafe-inline' ở
// đây để không chặn script anti-FOUC của next-themes và <script type=
// "application/ld+json"> cho SEO. Vẫn chặn được phần lớn vector phổ biến:
// script/style/frame từ domain lạ, clickjacking, MIME sniffing.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${umamiHost ? ` https://${umamiHost}` : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://${supabaseHost}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost}${umamiHost ? ` https://${umamiHost}` : ''}${sentryHost ? ` https://${sentryHost}` : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  images: {
    // Ảnh bài viết/upload sẽ nằm trong Supabase Storage (bucket post-images).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Chưa có org/project/authToken thật -> Sentry tự bỏ qua bước upload
  // sourcemap (chỉ log cảnh báo), không làm fail build.
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
