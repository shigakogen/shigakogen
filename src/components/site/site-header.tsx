import Link from 'next/link';

import { SiteNav } from '@/components/site/site-nav';
import { siteConfig } from '@/lib/site-config';

export function SiteHeader() {
  return (
    <header className="border-border bg-bg/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        <Link
          href="/"
          className="focus-visible:outline-accent rounded-sm text-base font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {siteConfig.name}
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
