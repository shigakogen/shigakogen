import type { TocItem } from '@/lib/mdx';

export function TocSidebar({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Mục lục"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
    >
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Mục lục</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-accent block rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
