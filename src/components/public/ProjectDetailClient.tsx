'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, ProjectVersion } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { MarkdownRenderer } from '@/components/public/MarkdownRenderer';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Calendar,
  Smartphone,
  HardDrive,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  X,
  ChevronLeft,
  Share2,
  FileCode,
  Tag,
  Cpu,
  Lock,
} from 'lucide-react';
import { GitHubIcon } from '@/components/ui/Icons';
import { formatDate } from '@/lib/utils/reading-time';

interface ProjectDetailClientProps {
  project: Project;
  versions: ProjectVersion[];
}

export function ProjectDetailClient({ project, versions }: ProjectDetailClientProps) {
  const [modInfoOpen, setModInfoOpen] = useState(true);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const iconImage = project.icon_url || project.thumbnail_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=300';
  const bannerImage = project.banner_url || project.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400';
  const screenshots = project.screenshots && project.screenshots.length > 0 ? project.screenshots : [bannerImage];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const scrollToDownloads = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('downloads');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => setActiveLightboxIndex(index);
  const closeLightbox = () => setActiveLightboxIndex(null);
  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % screenshots.length);
    }
  };
  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + screenshots.length) % screenshots.length);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/projects" className="hover:text-indigo-600 transition-colors">
          Projects &amp; Apps
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{project.title}</span>
      </nav>

      {/* PART 1, A: Project Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
        {/* Banner Image with Multi-stop Gradient */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={bannerImage}
            alt={project.title}
            className="w-full h-full object-cover object-center brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
        </div>

        {/* Floating App Info Over Banner */}
        <div className="relative -mt-24 sm:-mt-28 z-10 px-6 sm:px-10 pb-8 sm:pb-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* App Icon + Title */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 p-1 shadow-2xl shrink-0 group">
                <img
                  src={iconImage}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>

              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{project.platform || 'Android'}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    {project.category || 'Android Apps'}
                  </span>
                  {project.mod_info && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      MOD UNLOCKED
                    </span>
                  )}
                  {project.is_featured && (
                    <Badge variant="gradient" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {project.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <span>Developer:</span>
                  <span className="font-semibold text-white">{project.publisher || 'Kartik Sharma'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                </p>
              </div>
            </div>

            {/* Action Buttons: Primary Download & Share */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-sm"
                title="Share Project Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToDownloads}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK ({versions.length} {versions.length === 1 ? 'Version' : 'Versions'})</span>
              </button>
            </div>
          </div>

          {/* Short Description */}
          {(project.short_description || project.description) && (
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl pt-2">
              {project.short_description || project.description}
            </p>
          )}

          {/* Quick specs pills bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Latest Version</span>
              <span className="font-bold text-white text-sm">{project.latest_version || 'v1.0.0'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">App Size</span>
              <span className="font-bold text-white text-sm">{project.app_size || '45 MB'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Last Updated</span>
              <span className="font-semibold text-slate-300">{formatDate(project.updated_at)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Security</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Clean
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on desktop (Content + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): MOD Info, What's New, Screenshots, Description, Downloads */}
        <div className="lg:col-span-2 space-y-8">
          {/* PART 1, C: Collapsible MOD Information Section */}
          {project.mod_info && (
            <div className="rounded-3xl bg-white border border-emerald-200 overflow-hidden shadow-sm transition-all">
              <button
                onClick={() => setModInfoOpen(!modInfoOpen)}
                className="w-full p-5 sm:p-6 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 flex items-center justify-between text-left cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span>MOD Information &amp; Features</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        Active
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Exclusive features, unlocked capabilities, and enhancements included in this build.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/80 border border-emerald-200 text-emerald-700">
                  {modInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {modInfoOpen && (
                <div className="p-6 bg-white border-t border-emerald-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.mod_info.split('\n').filter(Boolean).map((line, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 text-xs font-semibold text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{line.replace(/^\d+[\.\)]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PART 1, D: What's New Section */}
          {project.whats_new && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="w-4 h-4" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider font-mono">
                  What's New in {project.latest_version || 'Latest Version'}
                </h2>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-line">
                {project.whats_new}
              </div>
            </div>
          )}

          {/* PART 1, E: Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Screenshots &amp; App Previews
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any screenshot to zoom and preview in high-resolution lightbox.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {screenshots.length} {screenshots.length === 1 ? 'Shot' : 'Shots'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {screenshots.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all text-left"
                  >
                    <img
                      src={imgUrl}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm text-xs font-semibold">
                        View Full
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PART 1, F: Long Description / Article */}
          {project.content && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-3">
                About {project.title} &amp; Architecture
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                <MarkdownRenderer content={project.content} />
              </div>
            </div>
          )}

          {/* PART 2: DOWNLOAD BUTTON + MULTIPLE VERSIONS SECTION */}
          <section id="downloads" className="p-6 sm:p-8 rounded-3xl bg-white border border-indigo-200 shadow-md space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-indigo-600 mb-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Verified Downloads</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Available APK Versions &amp; Downloads
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your desired release architecture and version type below.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Virus &amp; Malware Scanned</span>
              </div>
            </div>

            {/* Version Cards List */}
            {versions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No downloads available yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The administrator has not published release packages for this application yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {versions.map((ver) => {
                  const isMod = ver.version_type === 'MOD';
                  const isOriginal = ver.version_type === 'Original';
                  const isBeta = ver.version_type === 'Beta';

                  return (
                    <div
                      key={ver.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        ver.is_latest
                          ? 'bg-indigo-50/40 border-indigo-200 hover:border-indigo-300'
                          : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Version Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">
                            {ver.version_name}
                          </span>

                          {/* Version Type Badge */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isMod
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isOriginal
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : isBeta
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {ver.version_type}
                          </span>

                          {/* Latest Tag */}
                          {ver.is_latest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-2xs">
                              LATEST
                            </span>
                          )}
                        </div>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-mono">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ver.file_size}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ver.architecture}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ver.root_requirement}</span>
                          </span>
                          {ver.release_date && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 font-sans">{ver.release_date}</span>
                            </>
                          )}
                        </div>

                        {/* Changelog description */}
                        {ver.changelog && (
                          <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                            {ver.changelog}
                          </p>
                        )}
                      </div>

                      {/* Right: Direct Download Button */}
                      <div className="shrink-0 flex items-center gap-2">
                        <a
                          href={ver.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download APK</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (1 Col): App Specifications Card & External Links */}
        <div className="space-y-6">
          {/* PART 1, B: Detailed Specifications Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Application Details</span>
            </h3>

            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">App Name</dt>
                <dd className="font-bold text-slate-900 text-right">{project.title}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">Developer</dt>
                <dd className="font-semibold text-slate-900 text-right">{project.publisher || 'Kartik Sharma'}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-semibold text-indigo-600 text-right">{project.category || 'Android Apps'}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">Platform</dt>
                <dd className="font-semibold text-slate-900 text-right">{project.platform || 'Android'}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">File Size</dt>
                <dd className="font-mono font-bold text-slate-900 text-right">{project.app_size || '45 MB'}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">Latest Version</dt>
                <dd className="font-mono font-bold text-indigo-600 text-right">{project.latest_version || 'v1.0.0'}</dd>
              </div>

              <div className="py-2.5 flex justify-between gap-3">
                <dt className="text-slate-500">Last Updated</dt>
                <dd className="text-slate-700 text-right">{formatDate(project.updated_at)}</dd>
              </div>

              {project.original_url && (
                <div className="py-2.5 flex justify-between gap-3">
                  <dt className="text-slate-500">Official Store</dt>
                  <dd className="text-right">
                    <a
                      href={project.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Store Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Technologies Stack Card */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Developer Links */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Developer Repositories</h3>
            <div className="space-y-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GitHubIcon className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                    <span>Live Showcase Demo</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Screenshots */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10 hidden sm:block"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col items-center">
            <img
              src={screenshots[activeLightboxIndex]}
              alt={`Screenshot ${activeLightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <span className="text-white/70 text-xs mt-3 font-mono">
              {activeLightboxIndex + 1} of {screenshots.length}
            </span>
          </div>

          <button
            onClick={nextLightbox}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10 hidden sm:block"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

