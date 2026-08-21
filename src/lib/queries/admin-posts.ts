import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

// Khác với src/lib/queries/posts.ts (chỉ đọc bài published, dùng client
// tĩnh/anon cho public) — file này dùng client session (đọc cookie), dựa
// vào RLS posts_admin_read/posts_admin_write (yêu cầu is_admin()) để chỉ
// admin đã đăng nhập mới đọc/ghi được bài ở mọi trạng thái.

export async function getAllPostsForAdmin(status?: 'draft' | 'published') {
  const supabase = await createClient();
  let query = supabase
    .from('posts')
    .select('id, slug, title, status, tags, reading_minutes, view_count, published_at, updated_at')
    .order('updated_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPostByIdForAdmin(id: string): Promise<Tables<'posts'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}
