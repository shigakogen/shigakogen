import Link from 'next/link';
import type { Metadata } from 'next';

import { ProjectList } from '@/app/(admin)/admin/projects/project-list';
import { Button } from '@/components/ui/button';
import { getAllProjectsForAdmin } from '@/lib/queries/admin-projects';

export const metadata: Metadata = { title: 'Projects — Admin', robots: { index: false } };

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-[650] tracking-[-0.02em]">Projects</h1>
          <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm">
            ← Bài viết
          </Link>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>Project mới</Button>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        Kéo-thả để đổi thứ tự hiển thị trên /projects.
      </p>

      {projects.length === 0 ? (
        <p className="text-muted-foreground mt-8">Chưa có project nào.</p>
      ) : (
        <ProjectList initialProjects={projects} />
      )}
    </div>
  );
}
