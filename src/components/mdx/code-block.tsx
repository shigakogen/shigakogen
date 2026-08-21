import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { CopyButton } from '@/components/mdx/copy-button';

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (
    node &&
    typeof node === 'object' &&
    'props' in node &&
    node.props &&
    typeof node.props === 'object' &&
    'children' in node.props
  ) {
    return getTextContent(node.props.children as ReactNode);
  }
  return '';
}

// Map cho thẻ <pre> do rehype-pretty-code sinh ra (bọc trong
// <figure data-rehype-pretty-code-figure>). Style theo docs/04-DESIGN.md:
// padding 16px, overflow-x auto, nút copy góc trên phải.
export function CodeBlock(props: ComponentPropsWithoutRef<'pre'>) {
  const code = getTextContent(props.children);

  return (
    <div className="group relative">
      <pre
        {...props}
        className="bg-surface border-border overflow-x-auto rounded-lg border p-4 text-sm"
      />
      <div className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <CopyButton code={code} />
      </div>
    </div>
  );
}
