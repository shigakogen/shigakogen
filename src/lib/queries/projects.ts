import { createStaticClient } from '@/lib/supabase/static';
import type { Tables } from '@/lib/supabase/database.types';

const LIST_COLUMNS =
  'slug, title, summary, tech, cover_image, featured, sort_order, repo_url, live_url';
const DETAIL_COLUMNS =
  'slug, title, summary, content, tech, cover_image, featured, repo_url, live_url';

export type ProjectListItem = Pick<
  Tables<'projects'>,
  | 'slug'
  | 'title'
  | 'summary'
  | 'tech'
  | 'cover_image'
  | 'featured'
  | 'sort_order'
  | 'repo_url'
  | 'live_url'
>;

export type ProjectDetail = Pick<
  Tables<'projects'>,
  | 'slug'
  | 'title'
  | 'summary'
  | 'content'
  | 'tech'
  | 'cover_image'
  | 'featured'
  | 'repo_url'
  | 'live_url'
>;

export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('projects')
    .select(LIST_COLUMNS)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectListItem[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('projects')
    .select(DETAIL_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as ProjectDetail | null;
}
