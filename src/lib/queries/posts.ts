import { createStaticClient } from '@/lib/supabase/static';
import type { Tables } from '@/lib/supabase/database.types';

const LIST_COLUMNS =
  'slug, title, summary, tags, cover_image, published_at, reading_minutes, view_count';
const DETAIL_COLUMNS =
  'id, slug, title, summary, content, tags, cover_image, published_at, updated_at, reading_minutes, view_count';
const ADJACENT_COLUMNS = 'slug, title, published_at';

export type PostListItem = Pick<
  Tables<'posts'>,
  | 'slug'
  | 'title'
  | 'summary'
  | 'tags'
  | 'cover_image'
  | 'published_at'
  | 'reading_minutes'
  | 'view_count'
>;

export type PostDetail = Pick<
  Tables<'posts'>,
  | 'id'
  | 'slug'
  | 'title'
  | 'summary'
  | 'content'
  | 'tags'
  | 'cover_image'
  | 'published_at'
  | 'updated_at'
  | 'reading_minutes'
  | 'view_count'
>;

export type AdjacentPost = Pick<Tables<'posts'>, 'slug' | 'title' | 'published_at'>;

const DEFAULT_PAGE_SIZE = 10;

export async function getPublishedPosts({
  tag,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: { tag?: string; page?: number; pageSize?: number } = {}): Promise<{
  posts: PostListItem[];
  totalCount: number;
  totalPages: number;
}> {
  const supabase = createStaticClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('posts')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const totalCount = count ?? 0;
  return {
    posts: data as PostListItem[],
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('posts')
    .select(DETAIL_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as PostDetail | null;
}

export async function getAdjacentPosts(
  publishedAt: string,
): Promise<{ prev: AdjacentPost | null; next: AdjacentPost | null }> {
  const supabase = createStaticClient();

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('posts')
      .select(ADJACENT_COLUMNS)
      .eq('status', 'published')
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('posts')
      .select(ADJACENT_COLUMNS)
      .eq('status', 'published')
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (prevResult.error) throw prevResult.error;
  if (nextResult.error) throw nextResult.error;

  return {
    prev: prevResult.data as AdjacentPost | null,
    next: nextResult.data as AdjacentPost | null,
  };
}

export async function getAllTags(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from('posts').select('tags').eq('status', 'published');

  if (error) throw error;

  const tags = new Set<string>();
  for (const row of data as Pick<Tables<'posts'>, 'tags'>[]) {
    for (const tag of row.tags) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export type ReactionCounts = Partial<Record<Tables<'reactions'>['type'], number>>;

// reactions_public_read cho phép ai cũng SELECT (đọc số đếm) — không có RPC
// group-by nên gộp tay ở đây, đủ dùng ở quy mô blog cá nhân.
export async function getPostReactionCounts(postId: string): Promise<ReactionCounts> {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from('reactions').select('type').eq('post_id', postId);

  if (error) throw error;

  const counts: ReactionCounts = {};
  for (const row of data as Pick<Tables<'reactions'>, 'type'>[]) {
    counts[row.type] = (counts[row.type] ?? 0) + 1;
  }
  return counts;
}
