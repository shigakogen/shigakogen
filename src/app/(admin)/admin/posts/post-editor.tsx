'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { renderPreviewContent, savePost, uploadPostImage } from '@/app/(admin)/admin/posts/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { estimateReadingMinutes, parseTags, slugify } from '@/lib/post-utils';
import type { Tables } from '@/lib/supabase/database.types';

type DraftShape = {
  title: string;
  customSlug: string | null;
  summary: string;
  tagsInput: string;
  content: string;
  coverImage: string;
  savedAt: number;
};

export function PostEditor({ post }: { post?: Tables<'posts'> }) {
  const router = useRouter();
  const draftKey = `admin-draft:${post?.id ?? 'new'}`;

  const [postId, setPostId] = useState(post?.id);
  const [title, setTitle] = useState(post?.title ?? '');
  const [customSlug, setCustomSlug] = useState<string | null>(post?.slug ?? null);
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [tagsInput, setTagsInput] = useState(post?.tags.join(', ') ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '');
  const [preview, setPreview] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Slug là giá trị tính toán trực tiếp từ title, trừ khi người dùng tự sửa
  // tay (customSlug) — không dùng useEffect để "đồng bộ" state phái sinh.
  const slug = customSlug ?? slugify(title);

  // Restore bản nháp autosave nếu có, chỉ 1 lần lúc mount.
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as DraftShape;
      if (!confirm('Có bản nháp tự lưu chưa publish, khôi phục?')) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- khôi phục 1 lần lúc mount theo lựa chọn của user, không phải derived state
      setTitle(draft.title);
      setCustomSlug(draft.customSlug);
      setSummary(draft.summary);
      setTagsInput(draft.tagsInput);
      setContent(draft.content);
      setCoverImage(draft.coverImage);
    } catch {
      // localStorage lỗi/không khả dụng — bỏ qua.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy đúng 1 lần lúc mount
  }, []);

  // Autosave mỗi 10s (chỉ khi có nội dung, tránh ghi rác cho bài trống).
  useEffect(() => {
    const interval = setInterval(() => {
      if (!title && !content) return;
      const draft: DraftShape = {
        title,
        customSlug,
        summary,
        tagsInput,
        content,
        coverImage,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [draftKey, title, customSlug, summary, tagsInput, content, coverImage]);

  // Live preview: debounce 500ms sau khi ngừng gõ, render qua đúng pipeline
  // MDX thật trên server (renderPreviewHtml) để preview khớp 100% bài thật.
  useEffect(() => {
    const timer = setTimeout(() => {
      renderPreviewContent(content).then(setPreview);
    }, 500);
    return () => clearTimeout(timer);
  }, [content]);

  async function handleSave(publish: boolean) {
    setSaving(publish ? 'publish' : 'draft');
    setError(null);

    const result = await savePost({
      id: postId,
      title,
      slug,
      summary,
      content,
      tags: parseTags(tagsInput),
      coverImage: coverImage.trim() || null,
      publish,
    });

    setSaving(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }

    if (!postId && result.id) {
      setPostId(result.id);
      router.push(`/admin/posts/${result.id}`);
    } else {
      router.refresh();
    }
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const imageItem = Array.from(e.clipboardData.items).find((item) =>
      item.type.startsWith('image/'),
    );
    if (!imageItem) return; // paste text bình thường, không can thiệp

    e.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;

    const textarea = e.currentTarget;
    const cursor = textarea.selectionStart;
    const placeholder = '![đang tải ảnh lên…]()';
    const withPlaceholder = content.slice(0, cursor) + placeholder + content.slice(cursor);
    setContent(withPlaceholder);
    setUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadPostImage(formData);
    setUploadingImage(false);

    setContent((prev) =>
      prev.replace(
        placeholder,
        result.url ? `![](${result.url})` : `<!-- lỗi upload ảnh: ${result.error} -->`,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết"
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

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="text-muted-foreground text-xs">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setCustomSlug(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-muted-foreground text-xs">Tags (cách nhau bởi dấu phẩy)</label>
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
        </div>
        <div>
          <label className="text-muted-foreground text-xs">Cover image URL (tuỳ chọn)</label>
          <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-muted-foreground text-xs">Tóm tắt</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <p className="text-muted-foreground mt-3 text-xs">
        ~{estimateReadingMinutes(content)} min read (tự tính khi lưu)
        {uploadingImage && ' · đang tải ảnh lên…'}
      </p>

      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="Nội dung Markdown/MDX… (paste ảnh trực tiếp để upload)"
          className="border-border bg-background h-[70vh] w-full rounded-md border p-4 font-mono text-sm"
        />
        <div className="border-border h-[70vh] w-full overflow-y-auto rounded-md border p-4">
          {preview}
        </div>
      </div>
    </div>
  );
}
