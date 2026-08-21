import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor } from '@/app/(admin)/admin/posts/post-editor';
import { getPostByIdForAdmin } from '@/lib/queries/admin-posts';

export const metadata: Metadata = { title: 'Sửa bài viết — Admin', robots: { index: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return <PostEditor post={post} />;
}
