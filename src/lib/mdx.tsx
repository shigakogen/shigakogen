import GithubSlugger from 'github-slugger';
import type { MDXComponents } from 'mdx/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, JSX } from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { Callout } from '@/components/mdx/callout';
import { CodeBlock } from '@/components/mdx/code-block';

const HEADING_CLASS: Record<2 | 3 | 4, string> = {
  2: 'mt-10 mb-4 text-2xl font-[650] tracking-[-0.02em] scroll-mt-24',
  3: 'mt-8 mb-3 text-xl font-[650] tracking-[-0.02em] scroll-mt-24',
  4: 'mt-6 mb-2 text-lg font-[650] tracking-[-0.02em] scroll-mt-24',
};

function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  function Heading(props: ComponentPropsWithoutRef<'h2'>) {
    return <Tag {...props} className={HEADING_CLASS[level]} />;
  }
  return Heading;
}

function MdxLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  const linkClassName =
    'text-accent underline underline-offset-3 hover:decoration-2 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  if (isInternal) {
    return (
      <Link href={href} className={linkClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName} {...props}>
      {children}
    </a>
  );
}

function MdxImage({ alt, src, ...props }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string') return null;
  return (
    <Image
      {...props}
      src={src}
      alt={alt ?? ''}
      width={1200}
      height={675}
      className="h-auto w-full rounded-lg"
    />
  );
}

function MdxCode(props: ComponentPropsWithoutRef<'code'>) {
  // <code> bên trong code block đã được rehype-pretty-code xử lý, luôn có
  // data-language — chỉ style riêng inline code (không có attribute này).
  if ('data-language' in props) return <code {...props} />;
  return <code {...props} className="bg-surface rounded px-1.5 py-0.5 font-mono text-[0.9em]" />;
}

const mdxComponents: MDXComponents = {
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  a: MdxLink,
  img: MdxImage as unknown as (props: ComponentPropsWithoutRef<'img'>) => JSX.Element,
  code: MdxCode,
  pre: CodeBlock,
  figure: (props: ComponentPropsWithoutRef<'figure'>) => <figure {...props} className="my-6" />,
  Callout,
};

const rehypePrettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark' },
  keepBackground: false,
};

export async function renderMdx(source: string) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: 'append',
                properties: { className: ['anchor-link'], ariaLabel: 'Liên kết tới mục này' },
                content: { type: 'text', value: ' #' },
              },
            ],
            [rehypePrettyCode, rehypePrettyCodeOptions],
          ],
        },
      }}
    />
  );
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

// Trích TOC (h2/h3) trực tiếp từ markdown thô bằng regex thay vì parse AST
// đầy đủ — đủ dùng cho nội dung blog, tránh thêm dependency remark-parse.
// Dùng chung github-slugger với rehype-slug để id khớp đúng anchor thật.
export function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCodeFence = false;

  for (const line of source.split('\n')) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const level = match[1]!.length as 2 | 3;
    const text = match[2]!.replace(/[*_`]/g, '').trim();
    items.push({ id: slugger.slug(text), text, level });
  }

  return items;
}
