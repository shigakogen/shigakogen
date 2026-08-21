'use client';

import { Lightbulb, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { callEdgeFunction } from '@/lib/edge-functions';
import type { ReactionCounts } from '@/lib/queries/posts';

const REACTIONS = [
  { type: 'like' as const, label: 'Thích', Icon: ThumbsUp },
  { type: 'insightful' as const, label: 'Hữu ích', Icon: Lightbulb },
];

function storageKey(slug: string) {
  return `reacted:${slug}`;
}

export function ReactionButtons({
  slug,
  initialCounts,
}: {
  slug: string;
  initialCounts: ReactionCounts;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  // Nhớ trạng thái đã react trong localStorage để tô sáng nút đúng trạng thái
  // (fingerprint server-side không lộ ra client nên đây là cách duy nhất).
  // Đọc sau mount (không phải lazy useState initializer) để khớp HTML server
  // render ra lúc đầu, tránh hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(slug));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc 1 lần lúc mount, không phải subscription
      if (saved) setReacted(new Set(JSON.parse(saved) as string[]));
    } catch {
      // localStorage không khả dụng (SSR/privacy mode) — bỏ qua, không chặn UI.
    }
  }, [slug]);

  async function handleClick(type: 'like' | 'insightful') {
    if (pending) return;
    setPending(type);

    const wasReacted = reacted.has(type);
    // Optimistic update
    setCounts((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + (wasReacted ? -1 : 1) }));
    const nextReacted = new Set(reacted);
    if (wasReacted) nextReacted.delete(type);
    else nextReacted.add(type);
    setReacted(nextReacted);

    const result = await callEdgeFunction<{ counts: ReactionCounts }>('react', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, type }),
    });

    if (result) {
      setCounts(result.counts);
      try {
        localStorage.setItem(storageKey(slug), JSON.stringify(Array.from(nextReacted)));
      } catch {
        // ignore
      }
    } else {
      // Gọi lỗi -> revert optimistic update.
      setCounts((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + (wasReacted ? 1 : -1) }));
      setReacted(reacted);
    }
    setPending(null);
  }

  return (
    <div className="flex items-center gap-2">
      {REACTIONS.map(({ type, label, Icon }) => (
        <Button
          key={type}
          type="button"
          variant={reacted.has(type) ? 'secondary' : 'outline'}
          size="sm"
          disabled={pending !== null}
          onClick={() => handleClick(type)}
          aria-pressed={reacted.has(type)}
        >
          <Icon className="size-4" />
          {label} {counts[type] ? `(${counts[type]})` : ''}
        </Button>
      ))}
    </div>
  );
}
