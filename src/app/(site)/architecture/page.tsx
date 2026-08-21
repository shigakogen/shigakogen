import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Architecture',
  description: 'Site này được build thế nào — stack, kiến trúc, và các luồng dữ liệu chính.',
  path: '/architecture',
});

const stack = [
  { layer: 'Frontend', tech: 'Next.js (App Router) + TypeScript strict' },
  { layer: 'Styling', tech: 'Tailwind CSS v4 + shadcn/ui' },
  { layer: 'Content', tech: 'Supabase Postgres (bài viết lưu dạng Markdown/MDX text)' },
  { layer: 'Render MDX', tech: 'next-mdx-remote (RSC) + rehype-pretty-code (Shiki)' },
  { layer: 'Backend API', tech: 'Supabase Edge Functions (Deno + TypeScript)' },
  { layer: 'Auth', tech: 'Supabase Auth (magic link, 1 admin user)' },
  { layer: 'Storage', tech: 'Supabase Storage (ảnh bài viết, resume PDF)' },
  { layer: 'Observability', tech: 'Sentry (error tracking) + Umami (analytics)' },
  { layer: 'Deploy FE', tech: 'Vercel (Git-connected, ISR)' },
  { layer: 'Deploy BE', tech: 'supabase functions deploy (qua GitHub Actions)' },
];

const flows = [
  {
    title: 'Đọc bài viết (public)',
    steps: [
      'Next.js SSG lúc build + revalidate mỗi 1h (ISR)',
      'Server Component đọc thẳng Postgres qua anon key (client không cookie, không qua Edge Function)',
      'RLS chỉ cho đọc bài đã publish',
    ],
  },
  {
    title: 'View counter / reaction',
    steps: [
      'Client gọi Edge Function increment-view / react',
      'Edge Function tự rate-limit (IP + salt, không lưu IP thật) rồi ghi Postgres bằng service role',
      'Lỗi ở bước này không làm sập trang — chỉ ẩn số đếm',
    ],
  },
  {
    title: 'Đăng / sửa bài viết (admin)',
    steps: [
      'proxy.ts chặn /admin/* bằng RPC is_admin() trên session hiện tại',
      'Server Action ghi thẳng Postgres qua client có cookie session (RLS kiểm tra quyền admin)',
      'revalidatePath() để trang public cập nhật ngay, không đợi hết giờ ISR',
    ],
  },
  {
    title: 'Tìm kiếm',
    steps: [
      'Client debounce 300ms rồi gọi Edge Function search',
      'Edge Function query full-text search trên Postgres, chỉ trong bài đã publish',
    ],
  },
];

export default function ArchitecturePage() {
  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-16">
      <h1 className="text-3xl font-[650] tracking-[-0.02em]">Architecture</h1>
      <p className="text-muted-foreground mt-2 leading-relaxed">
        Site này (portfolio + blog cá nhân) được build bằng Next.js trên Vercel, dữ liệu và
        backend logic nằm hoàn toàn ở Supabase Cloud. Trang này giải thích site chạy như thế nào
        — dành cho ai tò mò về kiến trúc.
      </p>

      <h2 className="mt-12 text-xl font-[650] tracking-[-0.02em]">Sơ đồ</h2>
      <div className="border-border mt-6 overflow-x-auto rounded-lg border p-6">
        <div className="flex min-w-[560px] flex-col items-center gap-3 font-mono text-xs">
          <div className="border-border rounded-md border px-4 py-2">Browser</div>
          <span className="text-muted-foreground" aria-hidden="true">
            ↓ HTTPS
          </span>
          <div className="border-accent text-accent rounded-md border px-4 py-2 font-semibold">
            Vercel — Next.js (SSR / ISR / Server Actions)
          </div>
          <span className="text-muted-foreground" aria-hidden="true">
            ↓
          </span>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border-border rounded-md border px-3 py-2 text-center">
              Postgres
              <br />
              (RLS)
            </div>
            <div className="border-border rounded-md border px-3 py-2 text-center">
              Edge Functions
              <br />
              (Deno)
            </div>
            <div className="border-border rounded-md border px-3 py-2 text-center">Auth</div>
            <div className="border-border rounded-md border px-3 py-2 text-center">Storage</div>
          </div>
          <span className="text-muted-foreground" aria-hidden="true">
            ↑ tất cả nằm trong Supabase Cloud
          </span>
        </div>
        <p className="text-muted-foreground mt-6 text-center text-xs">
          Ngoài luồng chính: GitHub Actions build/deploy + backup DB hằng tuần · Sentry nhận lỗi
          runtime · Umami nhận pageview.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-[650] tracking-[-0.02em]">Stack</h2>
      <div className="border-border mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <tbody>
            {stack.map((row) => (
              <tr key={row.layer} className="border-border not-last:border-b">
                <td className="text-muted-foreground w-40 px-4 py-2.5 align-top font-medium">
                  {row.layer}
                </td>
                <td className="px-4 py-2.5">{row.tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-[650] tracking-[-0.02em]">Luồng dữ liệu chính</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {flows.map((flow) => (
          <div key={flow.title} className="border-border rounded-lg border p-5">
            <h3 className="font-[650] tracking-[-0.02em]">{flow.title}</h3>
            <ol className="text-muted-foreground mt-3 space-y-2 text-sm leading-relaxed">
              {flow.steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {i + 1}
                  </Badge>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground mt-12 text-sm">
        Toàn bộ source code (frontend, Edge Functions, migrations, CI/CD) đều public trên{' '}
        <a
          href="https://github.com/Kichirou58/shigakogen"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
