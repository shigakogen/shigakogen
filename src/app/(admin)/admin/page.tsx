import Link from 'next/link';
import type { Metadata } from 'next';

import { signOut } from '@/app/(admin)/admin/actions';
import { PostRowActions } from '@/app/(admin)/admin/posts/post-row-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllPostsForAdmin } from '@/lib/queries/admin-posts';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: 'draft' | 'published' }>;
}) {
  const { status } = await searchParams;
  const [posts, supabase] = await Promise.all([getAllPostsForAdmin(status), createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-[650] tracking-[-0.02em]">Bài viết</h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <Link
            href="/admin/projects"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Projects →
          </Link>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
            Bài mới
          </Button>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Đăng xuất
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex gap-2 text-sm">
        <Link
          href="/admin"
          className={!status ? 'text-foreground font-medium' : 'text-muted-foreground'}
        >
          Tất cả
        </Link>
        <Link
          href="/admin?status=published"
          className={
            status === 'published' ? 'text-foreground font-medium' : 'text-muted-foreground'
          }
        >
          Đã xuất bản
        </Link>
        <Link
          href="/admin?status=draft"
          className={status === 'draft' ? 'text-foreground font-medium' : 'text-muted-foreground'}
        >
          Nháp
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-8">Chưa có bài viết nào.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-border flex items-center justify-between gap-4 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <Link href={`/admin/posts/${post.id}`} className="hover:text-accent-strong font-medium">
                  {post.title}
                </Link>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                  <span>{formatDate(post.published_at, '—')}</span>
                  <span>·</span>
                  <span>{post.view_count} views</span>
                </div>
              </div>
              <PostRowActions id={post.id} status={post.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
