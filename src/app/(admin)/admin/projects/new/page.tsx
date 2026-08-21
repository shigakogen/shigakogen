import type { Metadata } from 'next';

import { ProjectEditor } from '@/app/(admin)/admin/projects/project-editor';

export const metadata: Metadata = { title: 'Project mới — Admin', robots: { index: false } };

export default function NewProjectPage() {
  return <ProjectEditor />;
}
