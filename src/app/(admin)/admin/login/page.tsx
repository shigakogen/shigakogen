import type { Metadata } from 'next';

import { sendMagicLink } from '@/app/(admin)/admin/login/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = { title: 'Đăng nhập — Admin', robots: { index: false } };

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'Email không hợp lệ.',
  'send-failed': 'Không gửi được email, thử lại sau.',
  unauthorized: 'Email này không có quyền truy cập admin.',
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="border-border w-full max-w-sm rounded-lg border p-6">
        <h1 className="text-xl font-[650] tracking-[-0.02em]">Đăng nhập Admin</h1>

        {sent ? (
          <p className="text-muted-foreground mt-4 text-sm">
            Đã gửi link đăng nhập — kiểm tra email và bấm vào link để vào trang quản trị.
          </p>
        ) : (
          <form action={sendMagicLink} className="mt-4 space-y-3">
            <Input type="email" name="email" placeholder="you@example.com" required autoFocus />
            {error && <p className="text-destructive text-sm">{ERROR_MESSAGES[error] ?? error}</p>}
            <Button type="submit" className="w-full">
              Gửi link đăng nhập
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
