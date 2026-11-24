import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { ProjectDetailClient } from '@/components/public/ProjectDetailClient';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { Project, ProjectVersion } from '@/types/database';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();

  let projectData: any = null;
  try {
    const { data } = await supabase
      .from('projects')
      .select('title, description, short_description, icon_url, banner_url, thumbnail_url')
      .eq('slug', slug)
      .maybeSingle();
    projectData = data;
  } catch {}

  if (!projectData) {
    projectData = MOCK_PROJECTS.find((p) => p.slug === slug);
  }

  if (!projectData) return { title: 'Application Not Found' };

  const image =
    projectData.banner_url ||
    projectData.thumbnail_url ||
    projectData.icon_url ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200';

  return {
    title: `${projectData.title} APK Download & Architecture | Kartik Sharma`,
    description:
      projectData.short_description ||
      projectData.description ||
      'Download verified application APK and inspect modern architecture.',
    openGraph: {
      title: `${projectData.title} APK Download`,
      description: projectData.short_description || projectData.description || '',
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  let project: Project | null = null;
  let versions: ProjectVersion[] = [];

  try {
    const { data: projData, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!projErr && projData) {
      project = projData as Project;

      // Fetch published versions from database
      try {
        const { data: verData, error: verErr } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', project.id)
          .eq('status', 'published')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!verErr && verData && verData.length > 0) {
          versions = verData as ProjectVersion[];
        }
      } catch (e) {
        console.warn('Could not fetch project versions from DB:', e);
      }
    }
  } catch {}

  if (!project) {
    const mockMatch = MOCK_PROJECTS.find((p) => p.slug === slug);
    if (mockMatch) {
      project = mockMatch;
      versions = mockMatch.versions || [];
    }
  }

  if (!project) notFound();

  // If versions are still empty, check if mock data has fallback versions
  if (versions.length === 0 && (project as any).versions?.length > 0) {
    versions = (project as any).versions;
  }

  return <ProjectDetailClient project={project} versions={versions} />;
}
