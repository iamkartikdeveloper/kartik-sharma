'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/types/database';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import {
  FolderGit2,
  Search,
  ExternalLink,
  Download,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Globe,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  HardDrive,
  Tag,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import { GitHubIcon } from '@/components/ui/Icons';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name'>('featured');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setProjects(MOCK_PROJECTS);
      } else {
        setProjects(data);
      }
    } catch {
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique categories & platforms dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const platforms = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.platform) set.add(p.platform);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          project.title.toLowerCase().includes(query) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          (project.short_description && project.short_description.toLowerCase().includes(query)) ||
          (project.category && project.category.toLowerCase().includes(query)) ||
          (project.publisher && project.publisher.toLowerCase().includes(query)) ||
          (project.technologies && project.technologies.some((t) => t.toLowerCase().includes(query)));

        const matchesPlatform =
          selectedPlatform === 'all' ||
          (project.platform && project.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'all' ||
          (project.category && project.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesPlatform && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.is_featured === b.is_featured) {
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
          }
          return a.is_featured ? -1 : 1;
        }
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [projects, searchQuery, selectedPlatform, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified APK &amp; Mobile Software Repository</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Developer Apps, MODs &amp; Open Source Projects
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Download high-performance Android applications, custom modified utilities, and production-grade developer tools with multi-version architecture releases and verified checksums.
          </p>

          {/* Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Virus &amp; Malware Scanned</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Multi-Architecture APKs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Direct Fast Downloads</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by title, package, features, or keywords..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 shadow-2xs cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Latest Releases</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Platform & Category Filters */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Platform Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mr-1">
              Platform:
            </span>
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Platforms
            </button>
            {['Android', 'Windows', 'Web', 'Cross-Platform'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat.toLowerCase())}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPlatform === plat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Categories Pill list */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mr-1">
                Category:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="h-9 bg-slate-100 rounded-xl w-full pt-2" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 shadow-sm p-8 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No applications or projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No projects matched your active filters. Try clearing search keywords or switching platforms.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('all');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const iconImage = project.icon_url || project.thumbnail_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=200';
            const versionTag = project.latest_version || 'v1.0.0';
            const fileSize = project.app_size || '45 MB';
            const platformName = project.platform || 'Android';
            const categoryName = project.category || 'Android Apps';
            const publisherName = project.publisher || 'Kartik Sharma';

            return (
              <div
                key={project.id}
                className="group relative rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs"
              >
                {/* Top Badge Strip */}
                <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Smartphone className="w-3 h-3 text-slate-500" />
                      <span>{platformName}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[110px]">
                      {categoryName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {project.mod_info && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                        <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        MOD
                      </span>
                    )}
                    {project.is_featured && (
                      <Badge variant="gradient" size="sm">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="p-5 flex-1 space-y-4">
                  {/* App Icon + Title Header */}
                  <div className="flex items-start gap-3.5">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="shrink-0 relative group-hover:scale-105 transition-transform"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm p-0.5">
                        <img
                          src={iconImage}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-[14px]"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span>By {publisherName}</span>
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                      </p>

                      {/* Version & Size Pills */}
                      <div className="flex items-center gap-2 pt-0.5 font-mono text-[11px] text-slate-600">
                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {versionTag}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <HardDrive className="w-3 h-3 text-slate-400" />
                          {fileSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.short_description || project.description || 'Production grade application with complete architecture documentation and source code.'}
                  </p>

                  {/* MOD Information Snippet if available */}
                  {project.mod_info && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-700">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>MOD Info</span>
                      </div>
                      <p className="line-clamp-1 font-medium text-emerald-700">
                        {project.mod_info.replace(/\n/g, ' • ')}
                      </p>
                    </div>
                  )}

                  {/* Tech Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-400 font-mono">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                        title="GitHub Repository"
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.original_url && (
                      <a
                        href={project.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                        title="Official App Source / Store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${project.slug}#downloads`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
                      title="View App Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
