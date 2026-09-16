'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { callEdgeFunction } from '@/lib/edge-functions';

type SearchResult = {
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  rank: number;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const showResults = query.trim().length >= 2;

  function handleQueryChange(value: string) {
    setQuery(value);
    // "Bắt đầu loading" đặt ở event handler (không phải effect) — an toàn
    // để setState đồng bộ ở đây, tránh lỗi lint set-state-in-effect.
    if (value.trim().length >= 2) setLoading(true);
  }

  // Debounce 300ms, gọi thẳng Edge Function `search` (Phase 1). setState chỉ
  // xảy ra trong callback bất đồng bộ (.then), không đồng bộ đầu effect.
  useEffect(() => {
    if (!showResults) return;
    const timer = setTimeout(() => {
      callEdgeFunction<{ results: SearchResult[] }>(
        `search?q=${encodeURIComponent(query)}&limit=10`,
      ).then((result) => {
        setResults(result?.results ?? []);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, showResults]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery('');
          setResults([]);
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Tìm kiếm" />}>
        <Search className="size-4" />
      </DialogTrigger>
      <DialogContent className="top-24 max-w-lg translate-y-0 sm:max-w-lg">
        <DialogTitle>Tìm kiếm</DialogTitle>
        <DialogDescription className="sr-only">
          Tìm bài viết theo tiêu đề, tóm tắt, nội dung
        </DialogDescription>
        <input
          autoFocus
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Gõ từ khoá…"
          className="border-border bg-background focus-visible:ring-accent-strong w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        />

        <div className="max-h-80 overflow-y-auto">
          {showResults && loading && (
            <p className="text-muted-foreground py-4 text-center text-sm">Đang tìm…</p>
          )}

          {showResults && !loading && results.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Không tìm thấy kết quả.
            </p>
          )}

          {showResults && !loading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={result.slug}>
                  <Link
                    href={`/blog/${result.slug}`}
                    onClick={() => setOpen(false)}
                    className="hover:bg-surface focus-visible:bg-surface block rounded-md p-2 outline-none"
                  >
                    <p className="font-medium">{result.title}</p>
                    <p className="text-muted-foreground line-clamp-1 text-sm">{result.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
