import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectEditor } from '@/app/(admin)/admin/projects/project-editor';
import { getProjectByIdForAdmin } from '@/lib/queries/admin-projects';

export const metadata: Metadata = { title: 'Sửa project — Admin', robots: { index: false } };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectByIdForAdmin(id);
  if (!project) notFound();

  return <ProjectEditor project={project} />;
}
