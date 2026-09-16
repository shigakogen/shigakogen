'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GithubIcon } from '@/components/site/social-icons';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const focusRing =
  'rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong';

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="hidden items-center gap-6 md:flex">
      {siteConfig.nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              focusRing,
              'text-sm font-medium transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Mở menu điều hướng"
          />
        }
      >
        <Menu className="size-4" />
      </DialogTrigger>
      <DialogContent className="top-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-none sm:max-w-none">
        <DialogTitle>Điều hướng</DialogTitle>
        <DialogDescription className="sr-only">Menu điều hướng chính của site</DialogDescription>
        <nav aria-label="Điều hướng chính (mobile)" className="flex flex-col gap-1">
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <DialogClose
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      focusRing,
                      'py-2 text-base font-medium transition-colors',
                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  />
                }
              >
                {item.label}
              </DialogClose>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}

export function SiteNav() {
  return (
    <div className="flex items-center gap-2">
      <DesktopNav />
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        aria-label="GitHub"
        render={<a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" />}
      >
        <GithubIcon className="size-4" />
      </Button>
      <ThemeToggle />
      <MobileNav />
    </div>
  );
}
