import { ArrowRight, UserRound } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getPublishedProjects } from '@/lib/queries/projects';
import { getPublishedPosts } from '@/lib/queries/posts';
import { profileConfig } from '@/lib/profile-config';
import { pageMetadata, personJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} — ${profileConfig.hero.name}`,
  description: siteConfig.description,
  path: '/',
});

export default async function HomePage() {
  const [{ posts }, projects] = await Promise.all([
    getPublishedPosts({ pageSize: 3 }),
    getPublishedProjects(),
  ]);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      {/* Hero — chữ lớn/bold bên trái, ảnh profile bên phải (docs/04-DESIGN.md,
          tham khảo robbowen.digital). Không animation, chỉ layout 2 cột trên
          desktop, xếp chồng trên mobile. */}
      <section className="grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="font-serif text-3xl leading-[1.15] font-normal tracking-[-0.01em] sm:text-4xl lg:text-5xl">
            {profileConfig.hero.heading}{' '}
            <span className="font-bold">{profileConfig.hero.name}</span>
            <span className="text-accent-strong">.</span>
            <span className="mt-1 block text-base font-bold sm:text">
              {profileConfig.hero.roles}
            </span>
          </h1>
          <p className="text-muted-foreground font-serif mt-6 max-w-lg text-lg leading-relaxed">
            {profileConfig.hero.tagline}
          </p>
          <div className="mt-8 flex gap-3">
            <Button nativeButton={false} render={<Link href={profileConfig.hero.ctaHref} />}>
              {profileConfig.hero.ctaLabel}
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={siteConfig.social.email} />}
            >
              Contact me!
            </Button>
          </div>
          <div className="mt-14 hidden items-center gap-3 sm:flex">
            <span className="text-muted-foreground text-xs font-medium tracking-[0.2em]">
              SCROLL
            </span>
            <span aria-hidden="true" className="bg-border h-10 w-px" />
          </div>
        </div>

        {/* Placeholder — thay bằng <Image> ảnh thật khi có, giữ nguyên khung
            viền pastel/tím cho đồng bộ với logo/button. */}
        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-1/2 -z-10 h-32 -translate-y-1/2 bg-[repeating-linear-gradient(45deg,var(--color-border)_0_1px,transparent_1px_14px)] sm:h-48"
          />
          <div className="bg-accent text-accent-fg border-accent-border flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl border-2">
            <UserRound className="size-24" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground mt-4 text-center text-xs">
          </p>
        </div>
      </section>

      {/* Bài mới nhất */}
      <section className="border-border border-t py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[650] tracking-[-0.02em]">Latest Posts</h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-accent-strong focus-visible:outline-accent-strong inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-6">Chưa có bài viết nào.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="focus-visible:outline-accent-strong group block rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="group-hover:text-accent-strong font-medium transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDate(post.published_at)} · {post.reading_minutes} min read
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Project nổi bật */}
      {featuredProjects.length > 0 && (
        <section className="border-border border-t py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-[650] tracking-[-0.02em]">Projects</h2>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-accent-strong focus-visible:outline-accent-strong inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="border-border hover:border-accent-strong focus-visible:outline-accent-strong group rounded-lg border p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="group-hover:text-accent-strong font-medium transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">{project.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA liên hệ */}
      <section className="border-border border-t py-16 text-center">
        <h2 className="text-xl font-[650] tracking-[-0.02em]">Hire me?</h2>
        <p className="text-muted-foreground mt-2">Get in touch directly or view my full resume.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button nativeButton={false} render={<Link href={siteConfig.social.email} />}>
            Contact me!
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/resume" />}>
            View Resume
          </Button>
        </div>
      </section>
    </div>
  );
}
