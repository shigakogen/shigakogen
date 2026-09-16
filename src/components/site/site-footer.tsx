import { Mail } from 'lucide-react';
import Link from 'next/link';

import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from '@/components/site/social-icons';
import { siteConfig } from '@/lib/site-config';

const socialLinks = [
  { label: 'GitHub', href: siteConfig.social.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: LinkedinIcon },
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: 'Instagram', href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: 'Email', href: siteConfig.social.email, Icon: Mail },
];

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {siteConfig.name} ·{' '}
          <Link href="/architecture" className="hover:text-foreground transition-colors">
            Developer
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
              className="bg-accent text-accent-fg border-accent-border focus-visible:outline-accent-strong flex size-8 items-center justify-center rounded-full border-2 outline-none transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
