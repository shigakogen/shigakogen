import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getPublishedProjects } from '@/lib/queries/projects';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description: 'Các project đã xây dựng — kiến trúc, vấn đề, giải pháp.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-16">
      <h1 className="text-3xl font-[650] tracking-[-0.02em]">Projects</h1>
      <p className="text-muted-foreground mt-2">
        Các project đã xây dựng — kiến trúc, vấn đề, giải pháp.
      </p>

      {projects.length === 0 ? (
        <p className="text-muted-foreground mt-12">Chưa có project nào.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="border-border hover:border-accent-strong focus-visible:outline-accent-strong group rounded-lg border p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <h2 className="group-hover:text-accent-strong font-[650] tracking-[-0.02em] transition-colors">
                {project.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
