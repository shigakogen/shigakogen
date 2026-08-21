import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Bảo vệ /admin/*: chưa login -> /admin/login; login rồi nhưng email không
// nằm trong bảng `admins` -> cũng đá về /admin/login (RPC is_admin() đọc từ
// JWT, đã có RLS/grant đúng từ T0.2).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Bắt buộc gọi getUser() (không phải getSession()) để Supabase tự refresh
  // token hết hạn và ghi cookie mới vào response.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname === '/admin/login') {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
