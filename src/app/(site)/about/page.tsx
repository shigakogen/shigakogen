import type { Metadata } from 'next';

import { profileConfig } from '@/lib/profile-config';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'Câu chuyện cá nhân và timeline sự nghiệp.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-16">
      <h1 className="text-3xl font-[650] tracking-[-0.02em]">About</h1>

      <div className="mt-6 space-y-4 leading-relaxed">
        {profileConfig.about.intro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-[650] tracking-[-0.02em]">Timeline</h2>
      <ol className="border-border mt-6 space-y-8 border-l pl-6">
        {profileConfig.about.timeline.map((item) => (
          <li key={`${item.year}-${item.title}`} className="relative">
            <span className="bg-accent-strong absolute top-1.5 -left-[1.6rem] size-2.5 rounded-full" />
            <p className="text-muted-foreground text-sm">{item.year}</p>
            <p className="mt-0.5 font-medium">{item.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
