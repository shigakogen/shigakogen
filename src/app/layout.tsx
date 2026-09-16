import type { Metadata } from 'next';
import { Bitter, Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@/components/site/analytics';
import { ThemeProvider } from '@/components/site/theme-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Chỉ dùng cho heading hero trang chủ (docs/04-DESIGN.md, tham khảo
// robbowen.digital — chính xác là font "Bitter" họ dùng, 400/700) — không
// đổi font toàn site, body vẫn dùng --font-sans.
const bitter = Bitter({
  variable: '--font-bitter',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'shigakogen',
  description: 'Portfolio và blog kỹ thuật của một Backend Developer.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${bitter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
