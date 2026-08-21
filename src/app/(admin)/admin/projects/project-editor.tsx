'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { saveProject } from '@/app/(admin)/admin/projects/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseTags, slugify } from '@/lib/post-utils';
import type { Tables } from '@/lib/supabase/database.types';

export function ProjectEditor({ project }: { project?: Tables<'projects'> }) {
  const router = useRouter();

  const [projectId, setProjectId] = useState(project?.id);
  const [title, setTitle] = useState(project?.title ?? '');
  const [customSlug, setCustomSlug] = useState<string | null>(project?.slug ?? null);
  const [summary, setSummary] = useState(project?.summary ?? '');
  const [techInput, setTechInput] = useState(project?.tech.join(', ') ?? '');
  const [repoUrl, setRepoUrl] = useState(project?.repo_url ?? '');
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? '');
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [content, setContent] = useState(project?.content ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);

  const slug = customSlug ?? slugify(title);

  async function handleSave(publish: boolean) {
    setSaving(publish ? 'publish' : 'draft');
    setError(null);

    const result = await saveProject({
      id: projectId,
      title,
      slug,
      summary,
      content,
      tech: parseTags(techInput),
      repoUrl: repoUrl.trim() || null,
      liveUrl: liveUrl.trim() || null,
      featured,
      publish,
    });

    setSaving(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (!projectId && result.id) {
      setProjectId(result.id);
      router.push(`/admin/projects/${result.id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên project"
          className="text-lg font-medium"
        />
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" disabled={saving !== null} onClick={() => handleSave(false)}>
            {saving === 'draft' ? 'Đang lưu…' : 'Lưu nháp'}
          </Button>
          <Button disabled={saving !== null} onClick={() => handleSave(true)}>
            {saving === 'publish' ? 'Đang xuất bản…' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-muted-foreground text-xs">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setCustomSlug(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-muted-foreground text-xs">Tech (cách nhau bởi dấu phẩy)</label>
          <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} />
        </div>
        <div>
          <label className="text-muted-foreground text-xs">Repo URL</label>
          <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
        </div>
        <div>
          <label className="text-muted-foreground text-xs">Live URL</label>
          <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured (hiện ở trang chủ)
      </label>

      <div className="mt-3">
        <label className="text-muted-foreground text-xs">Tóm tắt</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-3">
        <label className="text-muted-foreground text-xs">
          Nội dung case study (Problem → Solution → Architecture → Impact)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-border bg-background h-[50vh] w-full rounded-md border p-4 font-mono text-sm"
        />
      </div>
    </div>
  );
}
