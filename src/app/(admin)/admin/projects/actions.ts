'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function revalidateProjects() {
  revalidatePath('/projects');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
}

export type SaveProjectInput = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tech: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  publish: boolean;
};

export async function saveProject(
  input: SaveProjectInput,
): Promise<{ error?: string; id?: string; slug?: string }> {
  if (!input.title.trim()) return { error: 'Thiếu tiêu đề' };
  if (!SLUG_RE.test(input.slug)) {
    return { error: 'Slug không hợp lệ — chỉ chữ thường, số, dấu gạch ngang.' };
  }

  const supabase = await createClient();
  const payload = {
    title: input.title.trim(),
    slug: input.slug,
    summary: input.summary.trim(),
    content: input.content,
    tech: input.tech,
    repo_url: input.repoUrl,
    live_url: input.liveUrl,
    featured: input.featured,
    status: input.publish ? ('published' as const) : ('draft' as const),
  };

  const result = input.id
    ? await supabase.from('projects').update(payload).eq('id', input.id).select('id, slug').single()
    : await supabase.from('projects').insert(payload).select('id, slug').single();

  if (result.error) {
    if (result.error.code === '23505') {
      return { error: 'Slug đã tồn tại, đổi tiêu đề hoặc slug khác.' };
    }
    return { error: result.error.message };
  }

  revalidateProjects();
  revalidatePath(`/projects/${result.data.slug}`);
  return { id: result.data.id, slug: result.data.slug };
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidateProjects();
  return {};
}

export async function toggleFeatured(id: string, featured: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').update({ featured }).eq('id', id);
  if (error) return { error: error.message };
  revalidateProjects();
  return {};
}

export async function reorderProjects(
  order: { id: string; sortOrder: number }[],
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const results = await Promise.all(
    order.map(({ id, sortOrder }) =>
      supabase.from('projects').update({ sort_order: sortOrder }).eq('id', id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidateProjects();
  return {};
}
