import Link from 'next/link';

import type { PostListItem } from '@/lib/queries/posts';

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="border-border border-b py-6 first:pt-0 last:border-b-0">
      <Link
        href={`/blog/${post.slug}`}
        className="focus-visible:outline-accent group rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <h2 className="group-hover:text-accent text-xl font-[650] tracking-[-0.02em] transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{post.summary}</p>
      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.reading_minutes} phút đọc</span>
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${tag}`}
            className="bg-surface hover:text-foreground rounded-full px-2 py-0.5"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
