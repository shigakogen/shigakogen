import type { Metadata } from 'next';
import Link from 'next/link';

import { Pagination } from '@/components/blog/pagination';
import { PostCard } from '@/components/blog/post-card';
import { getAllTags, getPublishedPosts } from '@/lib/queries/posts';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description: 'Bài viết kỹ thuật về backend, hệ thống, và những gì học được trên đường đi.',
  path: '/blog',
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, totalPages }, tags] = await Promise.all([
    getPublishedPosts({ page }),
    getAllTags(),
  ]);

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-16">
      <h1 className="text-3xl font-[650] tracking-[-0.02em]">Blog</h1>
      <p className="text-muted-foreground mt-2">
        Bài viết kỹ thuật về backend, hệ thống, và những gì học được trên đường đi.
      </p>

      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="bg-surface hover:text-accent focus-visible:outline-accent rounded-full px-3 py-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12">Chưa có bài viết nào.</p>
      ) : (
        <div className="mt-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
