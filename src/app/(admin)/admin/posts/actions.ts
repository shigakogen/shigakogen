'use server';

import { revalidatePath } from 'next/cache';

import { renderMdx } from '@/lib/mdx';
import { estimateReadingMinutes } from '@/lib/post-utils';
import { createClient } from '@/lib/supabase/server';

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function revalidatePost(slug: string) {
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
  revalidatePath('/rss.xml');
}

export type SavePostInput = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage: string | null;
  publish: boolean;
};

export async function savePost(
  input: SavePostInput,
): Promise<{ error?: string; id?: string; slug?: string }> {
  if (!input.title.trim()) return { error: 'Thiếu tiêu đề' };
  if (!SLUG_RE.test(input.slug)) {
    return { error: 'Slug không hợp lệ — chỉ chữ thường, số, dấu gạch ngang.' };
  }

  const supabase = await createClient();
  const readingMinutes = estimateReadingMinutes(input.content);

  const basePayload = {
    title: input.title.trim(),
    slug: input.slug,
    summary: input.summary.trim(),
    content: input.content,
    tags: input.tags,
    cover_image: input.coverImage,
    reading_minutes: readingMinutes,
    status: input.publish ? ('published' as const) : ('draft' as const),
  };

  let oldSlug: string | null = null;
  let result;

  if (input.id) {
    const { data: existing } = await supabase
      .from('posts')
      .select('slug, published_at')
      .eq('id', input.id)
      .maybeSingle();
    oldSlug = existing?.slug ?? null;

    const publishedAt = input.publish ? (existing?.published_at ?? new Date().toISOString()) : null;

    result = await supabase
      .from('posts')
      .update({ ...basePayload, published_at: publishedAt })
      .eq('id', input.id)
      .select('id, slug')
      .single();
  } else {
    result = await supabase
      .from('posts')
      .insert({ ...basePayload, published_at: input.publish ? new Date().toISOString() : null })
      .select('id, slug')
      .single();
  }

  if (result.error) {
    if (result.error.code === '23505') {
      return { error: 'Slug đã tồn tại, đổi tiêu đề hoặc slug khác.' };
    }
    return { error: result.error.message };
  }

  revalidatePost(result.data.slug);
  if (oldSlug && oldSlug !== result.data.slug) revalidatePost(oldSlug);

  return { id: result.data.id, slug: result.data.slug };
}

export async function unpublishPost(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .update({ status: 'draft' })
    .eq('id', id)
    .select('slug')
    .single();

  if (error) return { error: error.message };
  revalidatePost(data.slug);
  return {};
}

export async function deletePost(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: existing } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();
  if (!existing) return { error: 'Không tìm thấy bài viết' };

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePost(existing.slug);
  return {};
}

export async function renderPreviewContent(markdown: string) {
  return renderMdx(markdown || '_(chưa có nội dung)_');
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadPostImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file');
  if (!(file instanceof File)) return { error: 'Không có file' };
  if (!file.type.startsWith('image/')) return { error: 'Chỉ nhận file ảnh' };
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Ảnh tối đa 5MB' };

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, file, { contentType: file.type });

  // RLS storage.objects (post-images admin write) chặn nếu không phải
  // authenticated + is_admin() — lỗi ở đây thường là do session hết hạn.
  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from('post-images').getPublicUrl(path);

  return { url: publicUrl };
}
