'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deletePost, unpublishPost } from '@/app/(admin)/admin/posts/actions';
import { Button } from '@/components/ui/button';

export function PostRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleUnpublish() {
    if (!confirm('Gỡ xuất bản bài này? Bài sẽ ẩn khỏi /blog.')) return;
    setPending(true);
    await unpublishPost(id);
    setPending(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Xoá vĩnh viễn bài này? Không thể hoàn tác.')) return;
    setPending(true);
    await deletePost(id);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      {status === 'published' && (
        <Button size="sm" variant="outline" disabled={pending} onClick={handleUnpublish}>
          Gỡ xuất bản
        </Button>
      )}
      <Button size="sm" variant="destructive" disabled={pending} onClick={handleDelete}>
        Xoá
      </Button>
    </div>
  );
}
