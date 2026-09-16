import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReactionButtons } from '@/components/blog/reaction-buttons';
import { ShareButton } from '@/components/blog/share-button';
import { TocSidebar } from '@/components/blog/toc-sidebar';
import { ViewCounter } from '@/components/blog/view-counter';
import { extractToc, renderMdx } from '@/lib/mdx';
import { getAdjacentPosts, getPostBySlug, getPostReactionCounts } from '@/lib/queries/posts';
import { createStaticClient } from '@/lib/supabase/static';
import { absoluteUrl, blogPostingJsonLd, breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('posts').select('slug').eq('status', 'published');
  return (data ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.slug}`,
    image: `/api/og?title=${encodeURIComponent(post.title)}`,
    type: 'article',
    publishedTime: post.published_at ?? undefined,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [{ prev, next }, reactionCounts] = await Promise.all([
    getAdjacentPosts(post.published_at ?? post.updated_at),
    getPostReactionCounts(post.id),
  ]);

  const toc = extractToc(post.content);

  const jsonLd = [
    blogPostingJsonLd({
      title: post.title,
      description: post.summary,
      path: `/blog/${post.slug}`,
      publishedAt: post.published_at ?? post.updated_at,
      updatedAt: post.updated_at,
    }),
    breadcrumbJsonLd([
      { name: 'Trang chủ', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1fr_240px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-w-0">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground focus-visible:outline-accent-strong rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          ← Tất cả bài viết
        </Link>

        <h1 className="mt-4 text-3xl font-[650] tracking-[-0.02em]">{post.title}</h1>

        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.reading_minutes} min read</span>
          <span aria-hidden="true">·</span>
          <ViewCounter slug={post.slug} initialViews={post.view_count} />
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag}`}
                className="bg-surface hover:text-accent-strong rounded-full px-2.5 py-0.5 text-xs"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="prose-mdx mt-8">{await renderMdx(post.content)}</div>

        <div className="border-border mt-10 flex items-center gap-3 border-t pt-6">
          <ReactionButtons slug={post.slug} initialCounts={reactionCounts} />
          <ShareButton title={post.title} url={absoluteUrl(`/blog/${post.slug}`)} />
        </div>

        <nav
          aria-label="Bài viết trước/sau"
          className="border-border mt-8 grid grid-cols-2 gap-4 border-t pt-6"
        >
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="focus-visible:outline-accent-strong rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <p className="text-muted-foreground text-xs">← Bài trước</p>
              <p className="hover:text-accent-strong mt-1 font-medium">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="focus-visible:outline-accent-strong rounded-sm text-right outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <p className="text-muted-foreground text-xs">Bài sau →</p>
              <p className="hover:text-accent-strong mt-1 font-medium">{next.title}</p>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      <TocSidebar items={toc} />
    </div>
  );
}
