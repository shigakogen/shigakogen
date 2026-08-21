import { Mail, Rss } from 'lucide-react';
import Link from 'next/link';
import type { SVGProps } from 'react';

import { siteConfig } from '@/lib/site-config';

// lucide-react không còn icon logo thương hiệu (Github/Linkedin) từ v1 —
// dùng inline SVG thay vì thêm dependency mới chỉ để lấy 2 icon.
function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.28-1.68-1.28-1.68-1.04-.71.08-.69.08-.69 1.16.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7.42.36.78 1.07.78 2.15v3.19c0 .3.22.66.8.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'GitHub', href: siteConfig.social.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: LinkedinIcon },
  { label: 'Email', href: siteConfig.social.email, Icon: Mail },
  { label: 'RSS', href: siteConfig.social.rss, Icon: Rss },
];

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {siteConfig.name} ·{' '}
          <Link href="/architecture" className="hover:text-foreground transition-colors">
            Kiến trúc
          </Link>
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-accent rounded-sm transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
