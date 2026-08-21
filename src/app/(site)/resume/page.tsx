import { Download } from 'lucide-react';
import type { Metadata } from 'next';

import { PrintButton } from '@/components/site/print-button';
import { Button } from '@/components/ui/button';
import { profileConfig } from '@/lib/profile-config';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Resume',
  description: profileConfig.resume.summary,
  path: '/resume',
});

const resumePdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${profileConfig.resume.resumePdfPath}`;

export default function ResumePage() {
  const { resume } = profileConfig;

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-16 print:py-0">
      <div className="no-print mb-8 flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Resume</p>
        <div className="flex gap-2">
          <PrintButton />
          <Button variant="outline" render={<a href={resumePdfUrl} download />}>
            <Download className="size-4" /> Tải PDF
          </Button>
        </div>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-[650] tracking-[-0.02em]">{profileConfig.hero.name}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{resume.summary}</p>
      </header>

      <section className="mb-8">
        <h2 className="border-border border-b pb-1 text-lg font-[650] tracking-[-0.02em]">
          Kỹ năng
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span
              key={skill}
              className="bg-surface rounded-full px-3 py-1 text-sm print:bg-transparent print:p-0"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="border-border border-b pb-1 text-lg font-[650] tracking-[-0.02em]">
          Kinh nghiệm
        </h2>
        <div className="mt-4 space-y-6">
          {resume.experience.map((job) => (
            <div key={`${job.company}-${job.role}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">
                  {job.role} — {job.company}
                </h3>
                <span className="text-muted-foreground shrink-0 text-sm">{job.period}</span>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {job.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="border-border border-b pb-1 text-lg font-[650] tracking-[-0.02em]">
          Học vấn
        </h2>
        <div className="mt-4 space-y-3">
          {resume.education.map((edu) => (
            <div key={edu.school} className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-medium">{edu.school}</p>
                <p className="text-muted-foreground text-sm">{edu.degree}</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-sm">{edu.period}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-muted-foreground mt-10 text-sm">
        {siteConfig.social.email.replace('mailto:', '')}
      </p>
    </div>
  );
}
