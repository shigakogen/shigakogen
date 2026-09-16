import { Code2, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { renderMdx } from '@/lib/mdx';
import { getProjectBySlug } from '@/lib/queries/projects';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { createStaticClient } from '@/lib/supabase/static';

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('projects').select('slug').eq('status', 'published');
  return (data ?? []).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: 'Trang chủ', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground focus-visible:outline-accent-strong rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← Tất cả project
      </Link>

      <h1 className="mt-4 text-3xl font-[650] tracking-[-0.02em]">{project.title}</h1>
      <p className="text-muted-foreground mt-2">{project.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="ml-auto flex gap-3">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-accent-strong inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Code2 className="size-4" /> Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-accent-strong inline-flex items-center gap-1 rounded-sm text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <ExternalLink className="size-4" /> Xem live
            </a>
          )}
        </div>
      </div>

      {/* Nội dung case study (Problem → Solution → Architecture → Impact) do
          chính bài viết Markdown quyết định cấu trúc heading — xem seed
          "sample-project" trong supabase/seed.sql làm mẫu. */}
      <div className="prose-mdx mt-8">{await renderMdx(project.content)}</div>
    </div>
  );
}
