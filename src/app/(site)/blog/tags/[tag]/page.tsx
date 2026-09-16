import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Pagination } from '@/components/blog/pagination';
import { PostCard } from '@/components/blog/post-card';
import { getPublishedPosts } from '@/lib/queries/posts';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return pageMetadata({
    title: `#${tag}`,
    description: `Bài viết gắn thẻ "${tag}".`,
    path: `/blog/tags/${tag}`,
  });
}

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { posts, totalPages } = await getPublishedPosts({ tag, page });
  if (posts.length === 0 && page === 1) notFound();

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-16">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground focus-visible:outline-accent-strong rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← Tất cả bài viết
      </Link>
      <h1 className="mt-4 text-3xl font-[650] tracking-[-0.02em]">#{tag}</h1>

      <div className="mt-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} basePath={`/blog/tags/${tag}`} />
    </div>
  );
}
