import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

// Giống admin-posts.ts: dùng client session, dựa vào RLS projects_admin_all
// (yêu cầu is_admin()) — không lọc theo status như queries/projects.ts public.

export async function getAllProjectsForAdmin(): Promise<Tables<'projects'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProjectByIdForAdmin(id: string): Promise<Tables<'projects'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}
