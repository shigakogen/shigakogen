import type { MetadataRoute } from 'next';

import { getAllTags, getPublishedPosts } from '@/lib/queries/posts';
import { getPublishedProjects } from '@/lib/queries/projects';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ posts }, projects, tags] = await Promise.all([
    getPublishedPosts({ pageSize: 1000 }),
    getPublishedProjects(),
    getAllTags(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/blog'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/projects'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/resume'), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.published_at ?? undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: absoluteUrl(`/blog/tags/${tag}`),
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...projectPages, ...tagPages];
}
