'use server';

import { redirect } from 'next/navigation';

import { siteUrl } from '@/lib/seo';
import { createClient } from '@/lib/supabase/server';

export async function sendMagicLink(formData: FormData) {
  const email = formData.get('email');
  if (typeof email !== 'string' || !email.includes('@')) {
    redirect('/admin/login?error=invalid');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  // Không tiết lộ email có phải admin hay không qua thông báo lỗi — luôn báo
  // đã gửi nếu request tới Supabase thành công, kể cả khi email không có
  // trong bảng admins (Supabase Auth vẫn tạo/tìm user bình thường; is_admin()
  // sẽ chặn ở middleware sau khi họ bấm link).
  if (error) {
    redirect('/admin/login?error=send-failed');
  }

  redirect('/admin/login?sent=1');
}
