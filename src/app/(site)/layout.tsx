import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a
        href="#main-content"
        className="bg-accent text-accent-fg border-accent-border sr-only fixed top-2 left-2 z-50 rounded-md border-2 px-4 py-2 text-sm font-medium focus:not-sr-only"
      >
        Bỏ qua, đi thẳng tới nội dung
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
