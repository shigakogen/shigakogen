import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getPublishedProjects } from '@/lib/queries/projects';
import { getPublishedPosts } from '@/lib/queries/posts';
import { profileConfig } from '@/lib/profile-config';
import { pageMetadata, personJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} — ${profileConfig.hero.name}`,
  description: siteConfig.description,
  path: '/',
});

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function HomePage() {
  const [{ posts }, projects] = await Promise.all([
    getPublishedPosts({ pageSize: 3 }),
    getPublishedProjects(),
  ]);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[900px] px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      {/* Hero — chữ lớn/bold, ngắt dòng tạo điểm nhấn, không animation (docs/04-DESIGN.md) */}
      <section className="py-20 sm:py-28">
        <p className="text-muted-foreground text-lg">{profileConfig.hero.heading}</p>
        <h1 className="mt-1 text-5xl leading-[1.05] font-[650] tracking-[-0.02em] sm:text-6xl">
          {profileConfig.hero.name}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed">
          {profileConfig.hero.tagline}
        </p>
        <div className="mt-8 flex gap-3">
          <Button render={<Link href={profileConfig.hero.ctaHref} />}>
            {profileConfig.hero.ctaLabel}
          </Button>
          <Button variant="outline" render={<Link href={siteConfig.social.email} />}>
            Liên hệ
          </Button>
        </div>
      </section>

      {/* Bài mới nhất */}
      <section className="border-border border-t py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[650] tracking-[-0.02em]">Bài viết mới nhất</h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Xem tất cả <ArrowRight className="size-4" />
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
                className="focus-visible:outline-accent group block rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="group-hover:text-accent font-medium transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDate(post.published_at)} · {post.reading_minutes} phút đọc
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
            <h2 className="text-xl font-[650] tracking-[-0.02em]">Project nổi bật</h2>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="border-border hover:border-accent focus-visible:outline-accent group rounded-lg border p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="group-hover:text-accent font-medium transition-colors">
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
        <h2 className="text-xl font-[650] tracking-[-0.02em]">Muốn trao đổi công việc?</h2>
        <p className="text-muted-foreground mt-2">Liên hệ trực tiếp hoặc xem CV đầy đủ.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button render={<Link href={siteConfig.social.email} />}>Liên hệ</Button>
          <Button variant="outline" render={<Link href="/resume" />}>
            Xem CV
          </Button>
        </div>
      </section>
    </div>
  );
}
