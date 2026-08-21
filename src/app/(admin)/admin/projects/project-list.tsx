'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type DragEvent, useRef, useState } from 'react';

import {
  deleteProject,
  reorderProjects,
  toggleFeatured,
} from '@/app/(admin)/admin/projects/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/lib/supabase/database.types';

// Kéo-thả bằng HTML5 Drag and Drop API thuần (không thêm dnd-kit/react-dnd
// — danh sách project cá nhân thường ngắn, không cần thư viện riêng).
export function ProjectList({ initialProjects }: { initialProjects: Tables<'projects'>[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const dragIndex = useRef<number | null>(null);
  const [pending, setPending] = useState(false);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(index: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === index) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(from, 1);
    if (!moved) return;
    reordered.splice(index, 0, moved);
    setProjects(reordered);

    await reorderProjects(reordered.map((p, i) => ({ id: p.id, sortOrder: i })));
    router.refresh();
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    setPending(true);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)));
    await toggleFeatured(id, !current);
    setPending(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Xoá vĩnh viễn project này? Không thể hoàn tác.')) return;
    setPending(true);
    await deleteProject(id);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-2">
      {projects.map((project, index) => (
        <div
          key={project.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          className="border-border bg-background flex cursor-move items-center justify-between gap-4 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <Link href={`/admin/projects/${project.id}`} className="hover:text-accent font-medium">
              {project.title}
            </Link>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                {project.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
              </Badge>
              <span>#{project.sort_order}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant={project.featured ? 'default' : 'outline'}
              disabled={pending}
              onClick={() => handleToggleFeatured(project.id, project.featured)}
            >
              {project.featured ? 'Featured' : 'Đánh dấu featured'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => handleDelete(project.id)}
            >
              Xoá
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
