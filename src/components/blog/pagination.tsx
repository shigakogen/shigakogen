import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const sep = basePath.includes('?') ? '&' : '?';

  return (
    <nav aria-label="Phân trang" className="mt-8 flex items-center justify-between">
      {hasPrev ? (
        <Link
          href={`${basePath}${sep}page=${page - 1}`}
          className="text-muted-foreground hover:text-foreground focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ChevronLeft className="size-4" /> Trước
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground text-sm">
        Trang {page}/{totalPages}
      </span>
      {hasNext ? (
        <Link
          href={`${basePath}${sep}page=${page + 1}`}
          className="text-muted-foreground hover:text-foreground focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Sau <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
