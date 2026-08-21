'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callEdgeFunction } from '@/lib/edge-functions';

// Gọi increment-view 1 lần khi mount. Lỗi thì ẩn im lặng (Fail gracefully —
// CLAUDE.md: Edge Function chết không được làm hỏng trang bài viết).
export function ViewCounter({ slug, initialViews }: { slug: string; initialViews: number }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    callEdgeFunction<{ views: number }>('increment-view', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).then((result) => {
      if (!cancelled && result) setViews(result.views);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
      <Eye className="size-4" aria-hidden="true" />
      {views ?? initialViews} lượt xem
    </span>
  );
}
