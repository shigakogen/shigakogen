import type { Metadata } from 'next';

import { PostEditor } from '@/app/(admin)/admin/posts/post-editor';

export const metadata: Metadata = { title: 'Bài viết mới — Admin', robots: { index: false } };

export default function NewPostPage() {
  return <PostEditor />;
}
