import { MountainSnow } from 'lucide-react';
import Link from 'next/link';

import { SiteNav } from '@/components/site/site-nav';
import { siteConfig } from '@/lib/site-config';

export function SiteHeader() {
  return (
    <header className="border-border bg-bg/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        <Link
          href="/"
          className="focus-visible:outline-accent-strong flex items-center gap-3 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="bg-accent text-accent-fg border-accent-border flex size-7 shrink-0 items-center justify-center rounded-md border-2">
            <MountainSnow className="size-4" aria-hidden="true" />
          </span>
          <span className="bg-border h-5 w-px shrink-0" aria-hidden="true" />
          <span className="text-base font-bold">{siteConfig.name}</span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
