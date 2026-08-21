const FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// "Fail gracefully" (CLAUDE.md): mọi lỗi gọi Edge Function trả về null thay
// vì throw — trang bài viết vẫn đọc được dù backend chết, chỉ ẩn view/react.
export async function callEdgeFunction<T>(name: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
      ...init,
      headers: { apikey: API_KEY, ...init?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
