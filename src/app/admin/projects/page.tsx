'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Project, ProjectVersion } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { slugify } from '@/lib/utils/slugify';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Copy,
  Eye,
  Search,
  SlidersHorizontal,
  Upload,
  Image as ImageIcon,
  Layers,
  Smartphone,
  HardDrive,
  Download,
  Zap,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Star,
  CheckSquare,
  Square,
  Globe,
  Tag,
  Cpu,
  Lock,
} from 'lucide-react';
import { GitHubIcon } from '@/components/ui/Icons';
import { MOCK_PROJECTS } from '@/lib/mock-data';

type TabType = 'basic' | 'images' | 'versions';

interface VersionFormData {
  id?: string;
  version_name: string;
  version_number: string;
  version_type: 'MOD' | 'Original' | 'Beta' | 'Older' | string;
  file_size: string;
  architecture: 'Universal' | 'ARM64' | 'ARM' | 'x86' | 'Other' | string;
  root_requirement: 'Non-Root' | 'Root' | 'Both' | 'Not Applicable' | string;
  download_url: string;
  changelog: string;
  release_date: string;
  is_latest: boolean;
  status: 'published' | 'draft';
  display_order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allVersions, setAllVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Active Project Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [publisher, setPublisher] = useState('Kartik Sharma');
  const [category, setCategory] = useState('Android Apps');
  const [platform, setPlatform] = useState('Android');
  const [appSize, setAppSize] = useState('45 MB');
  const [latestVersion, setLatestVersion] = useState('v1.0.0');
  const [modInfo, setModInfo] = useState('');
  const [whatsNew, setWhatsNew] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [screenshotInput, setScreenshotInput] = useState('');
  const [technologies, setTechnologies] = useState('Android, Kotlin');
  const [githubUrl, setGithubUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Versions for the current project
  const [versions, setVersions] = useState<VersionFormData[]>([]);
  const [editingVersionIdx, setEditingVersionIdx] = useState<number | null>(null);

  // Hidden file input refs for uploads
  const iconFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const screenshotFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjectsAndVersions();
  }, []);

  const fetchProjectsAndVersions = async () => {
    try {
      setLoading(true);
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projErr || !projData || projData.length === 0) {
        setProjects(MOCK_PROJECTS);
      } else {
        setProjects(projData);
      }

      // Try fetching all versions
      try {
        const { data: verData, error: verErr } = await supabase
          .from('project_versions')
          .select('*')
          .order('display_order', { ascending: true });

        if (!verErr && verData) {
          setAllVersions(verData);
        } else {
          // Flatten mock versions
          const mockVers = MOCK_PROJECTS.flatMap((p) => p.versions || []);
          setAllVersions(mockVers);
        }
      } catch {
        const mockVers = MOCK_PROJECTS.flatMap((p) => p.versions || []);
        setAllVersions(mockVers);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  // Upload helper to /api/admin/upload-project-image
  const handleFileUpload = async (file: File, folder: 'icons' | 'banners' | 'screenshots') => {
    setUploadingImage(folder);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload-project-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.url as string;
    } finally {
      setUploadingImage(null);
    }
  };

  // Reset Project Form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setPublisher('Kartik Sharma');
    setCategory('Android Apps');
    setPlatform('Android');
    setAppSize('45 MB');
    setLatestVersion('v1.0.0');
    setModInfo('');
    setWhatsNew('');
    setShortDescription('');
    setContent('');
    setIconUrl('');
    setBannerUrl('');
    setScreenshots([]);
    setScreenshotInput('');
    setTechnologies('Android, Kotlin');
    setGithubUrl('');
    setOriginalUrl('');
    setDemoUrl('');
    setIsFeatured(false);
    setStatus('published');
    setVersions([]);
    setEditingVersionIdx(null);
    setActiveTab('basic');
    setErrorMsg(null);
  };

  // Populate form for editing
  const handleStartEdit = async (proj: Project) => {
    resetForm();
    setEditingId(proj.id);
    setTitle(proj.title);
    setSlug(proj.slug);
    setPublisher(proj.publisher || 'Kartik Sharma');
    setCategory(proj.category || 'Android Apps');
    setPlatform(proj.platform || 'Android');
    setAppSize(proj.app_size || '45 MB');
    setLatestVersion(proj.latest_version || 'v1.0.0');
    setModInfo(proj.mod_info || '');
    setWhatsNew(proj.whats_new || '');
    setShortDescription(proj.short_description || proj.description || '');
    setContent(proj.content || '');
    setIconUrl(proj.icon_url || proj.thumbnail_url || '');
    setBannerUrl(proj.banner_url || proj.thumbnail_url || '');
    setScreenshots(proj.screenshots || (proj.banner_url ? [proj.banner_url] : []));
    setTechnologies((proj.technologies || []).join(', '));
    setGithubUrl(proj.github_url || '');
    setOriginalUrl(proj.original_url || '');
    setDemoUrl(proj.demo_url || '');
    setIsFeatured(Boolean(proj.is_featured));
    setStatus(proj.status === 'draft' ? 'draft' : 'published');

    // Load versions for this project
    try {
      const { data: verData } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', proj.id)
        .order('display_order', { ascending: true });

      if (verData && verData.length > 0) {
        setVersions(
          verData.map((v) => ({
            id: v.id,
            version_name: v.version_name,
            version_number: v.version_number,
            version_type: v.version_type,
            file_size: v.file_size,
            architecture: v.architecture,
            root_requirement: v.root_requirement,
            download_url: v.download_url,
            changelog: v.changelog || '',
            release_date: v.release_date || '',
            is_latest: Boolean(v.is_latest),
            status: v.status || 'published',
            display_order: v.display_order || 0,
          }))
        );
      } else if (proj.versions && proj.versions.length > 0) {
        setVersions(
          proj.versions.map((v) => ({
            id: v.id,
            version_name: v.version_name,
            version_number: v.version_number,
            version_type: v.version_type,
            file_size: v.file_size,
            architecture: v.architecture,
            root_requirement: v.root_requirement,
            download_url: v.download_url,
            changelog: v.changelog || '',
            release_date: v.release_date || '',
            is_latest: Boolean(v.is_latest),
            status: v.status || 'published',
            display_order: v.display_order || 0,
          }))
        );
      }
    } catch {
      // Mock versions fallback
      if (proj.versions) {
        setVersions(
          proj.versions.map((v) => ({
            id: v.id,
            version_name: v.version_name,
            version_number: v.version_number,
            version_type: v.version_type,
            file_size: v.file_size,
            architecture: v.architecture,
            root_requirement: v.root_requirement,
            download_url: v.download_url,
            changelog: v.changelog || '',
            release_date: v.release_date || '',
            is_latest: Boolean(v.is_latest),
            status: v.status || 'published',
            display_order: v.display_order || 0,
          }))
        );
      }
    }

    setEditorOpen(true);
  };

  // Duplicate Project
  const handleDuplicateProject = (proj: Project) => {
    handleStartEdit(proj);
    setEditingId(null);
    setTitle(`${proj.title} (Copy)`);
    setSlug(slugify(`${proj.slug}-copy-${Date.now().toString().slice(-4)}`));
    setSuccessMsg(`Cloned "${proj.title}" as a new draft. Review and save below.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Toggle quick publish/draft
  const handleTogglePublish = async (proj: Project) => {
    const newStatus = proj.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', proj.id);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, status: newStatus } : p))
      );
      setSuccessMsg(`Project status changed to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Update status error: ${err.message}`);
    }
  };

  // Toggle quick featured
  const handleToggleFeatured = async (proj: Project) => {
    const newFeatured = !proj.is_featured;
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: newFeatured, updated_at: new Date().toISOString() })
        .eq('id', proj.id);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, is_featured: newFeatured } : p))
      );
    } catch (err: any) {
      alert(`Update featured error: ${err.message}`);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete project "${name}"?\nAll associated versions will also be removed.`)) {
      return;
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setAllVersions((prev) => prev.filter((v) => v.project_id !== id));
      setSuccessMsg(`Project "${name}" was deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Screenshot helpers
  const handleAddScreenshotUrl = () => {
    if (screenshotInput.trim()) {
      setScreenshots([...screenshots, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const handleRemoveScreenshot = (idx: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx));
  };

  const handleMoveScreenshot = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= screenshots.length) return;
    const copy = [...screenshots];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    setScreenshots(copy);
  };

  // Version helpers
  const handleAddVersion = () => {
    const newVer: VersionFormData = {
      version_name: `${title || 'App'} v${latestVersion || '1.0.0'} MOD`,
      version_number: latestVersion.replace(/^v/, '') || '1.0.0',
      version_type: 'MOD',
      file_size: appSize || '45 MB',
      architecture: 'Universal',
      root_requirement: 'Non-Root',
      download_url: '',
      changelog: 'Initial release with unlocked features.',
      release_date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      is_latest: versions.length === 0,
      status: 'published',
      display_order: versions.length + 1,
    };
    setVersions([newVer, ...versions]);
    setEditingVersionIdx(0);
  };

  const handleDuplicateVersion = (idx: number) => {
    const orig = versions[idx];
    const cloned: VersionFormData = {
      ...orig,
      id: undefined,
      version_name: `${orig.version_name} (Copy)`,
      is_latest: false,
      display_order: versions.length + 1,
    };
    const updated = [...versions];
    updated.splice(idx + 1, 0, cloned);
    setVersions(updated);
  };

  const handleDeleteVersion = (idx: number) => {
    setVersions(versions.filter((_, i) => i !== idx));
    if (editingVersionIdx === idx) setEditingVersionIdx(null);
  };

  const handleMoveVersion = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= versions.length) return;
    const copy = [...versions];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    copy.forEach((v, i) => (v.display_order = i + 1));
    setVersions(copy);
  };

  const handleSetLatestVersion = (idx: number) => {
    setVersions(
      versions.map((v, i) => ({
        ...v,
        is_latest: i === idx,
      }))
    );
  };

  // Main Save Project & Versions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setErrorMsg('Project title and URL slug are required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const techArray = technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const primaryThumb = iconUrl.trim() || bannerUrl.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';

      const projectPayload: any = {
        title: title.trim(),
        slug: slug.trim(),
        description: shortDescription.trim() || null,
        short_description: shortDescription.trim() || null,
        content: content.trim() || null,
        publisher: publisher.trim() || 'Kartik Sharma',
        category: category.trim() || 'Android Apps',
        platform: platform.trim() || 'Android',
        app_size: appSize.trim() || '45 MB',
        latest_version: latestVersion.trim() || 'v1.0.0',
        mod_info: modInfo.trim() || null,
        whats_new: whatsNew.trim() || null,
        icon_url: iconUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        thumbnail_url: primaryThumb,
        screenshots: screenshots.length > 0 ? screenshots : null,
        technologies: techArray,
        github_url: githubUrl.trim() || null,
        original_url: originalUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        is_featured: isFeatured,
        status: status,
        updated_at: new Date().toISOString(),
      };

      let savedProjectId = editingId;

      if (editingId) {
        // Update existing
        const { error: updErr } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', editingId);

        if (updErr) throw updErr;
      } else {
        // Insert new
        const { data: insData, error: insErr } = await supabase
          .from('projects')
          .insert([projectPayload])
          .select()
          .single();

        if (insErr) throw insErr;
        savedProjectId = insData.id;
      }

      // Save / Sync Versions in `project_versions` table
      if (savedProjectId) {
        try {
          // Delete old versions for this project and re-insert fresh
          await supabase.from('project_versions').delete().eq('project_id', savedProjectId);

          if (versions.length > 0) {
            const versionsPayload = versions.map((v, i) => ({
              project_id: savedProjectId,
              version_name: v.version_name.trim(),
              version_number: v.version_number.trim(),
              version_type: v.version_type,
              file_size: v.file_size.trim() || '0 MB',
              architecture: v.architecture,
              root_requirement: v.root_requirement,
              download_url: v.download_url.trim(),
              changelog: v.changelog.trim() || null,
              release_date: v.release_date.trim() || null,
              is_latest: Boolean(v.is_latest),
              status: v.status,
              display_order: i + 1,
              created_at: new Date().toISOString(),
            }));

            const { error: verInsErr } = await supabase
              .from('project_versions')
              .insert(versionsPayload);

            if (verInsErr) {
              console.warn('Could not insert versions to project_versions table:', verInsErr);
            }
          }
        } catch (verErr) {
          console.warn('Version sync error:', verErr);
        }
      }

      setSuccessMsg(`Project "${title}" and ${versions.length} versions saved successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);

      await fetchProjectsAndVersions();
      setEditorOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Save project error:', err);
      setErrorMsg(err.message || 'Failed to save project. Ensure database columns are migrated.');
    } finally {
      setSubmitting(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.status === 'published').length;
    const drafts = total - published;
    const featured = projects.filter((p) => p.is_featured).length;
    const totalVers = allVersions.length;
    return { total, published, drafts, featured, totalVers };
  }, [projects, allVersions]);

  // Filtered project list for dashboard
  const filteredList = useMemo(() => {
    return projects
      .filter((p) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          (p.publisher && p.publisher.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' ? p.status === 'published' : p.status === 'draft');

        const matchesPlatform =
          platformFilter === 'all' ||
          (p.platform && p.platform.toLowerCase() === platformFilter.toLowerCase());

        return matchesQuery && matchesStatus && matchesPlatform;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'oldest') {
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        }
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [projects, searchQuery, statusFilter, platformFilter, sortBy]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-indigo-600" />
            <span>Projects &amp; APK Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage public applications, APK download packages, multiple architectures, and screenshot galleries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              resetForm();
              setEditorOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Project
          </Button>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PART 5: Dashboard Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Total Projects</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono uppercase font-bold text-emerald-600">Published</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">{stats.published}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono uppercase font-bold text-amber-600">Drafts</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 font-mono">{stats.drafts}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono uppercase font-bold text-indigo-600">Featured</span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1 font-mono">{stats.featured}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono uppercase font-bold text-purple-600">Total Versions</span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1 font-mono">{stats.totalVers}</div>
        </div>
      </div>

      {/* PART 5: Filter and Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, package, or publisher..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="android">Android</option>
              <option value="windows">Windows</option>
              <option value="web">Web</option>
            </select>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table / Management Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">Loading projects list...</div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No matching projects found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria or create a new project above.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Application</th>
                  <th className="py-3.5 px-4 font-bold">Category &amp; Platform</th>
                  <th className="py-3.5 px-4 font-bold">Latest Ver.</th>
                  <th className="py-3.5 px-4 font-bold">MOD Info</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Featured</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((proj) => {
                  const icon = proj.icon_url || proj.thumbnail_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=150';

                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Application Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={icon}
                            alt={proj.title}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{proj.title}</h4>
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                              /{proj.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Platform */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">{proj.category || 'Android Apps'}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{proj.platform || 'Android'}</span>
                        </div>
                      </td>

                      {/* Latest Version & Size */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-indigo-600 block">{proj.latest_version || 'v1.0.0'}</span>
                        <span className="text-[10px] text-slate-400">{proj.app_size || '45 MB'}</span>
                      </td>

                      {/* MOD Info Badge */}
                      <td className="py-4 px-4">
                        {proj.mod_info ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                            MOD Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Original</span>
                        )}
                      </td>

                      {/* Published / Draft Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            proj.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="capitalize">{proj.status}</span>
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(proj)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                          title={proj.is_featured ? 'Featured on homepage' : 'Not featured'}
                        >
                          <Star className={`w-4 h-4 ${proj.is_featured ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDuplicateProject(proj)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Duplicate Project"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEdit(proj)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Project & Versions"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PART 3 & PART 4: Project Editor Modal / Full Editor Panel */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {editingId ? `Edit Project: ${title}` : 'Create New Project & APK'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure application details, manual image uploads/URLs, and multi-version APK releases.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditorOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex items-center gap-2 pt-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'basic'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Basic Information
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'images'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>2. Image &amp; Screenshots</span>
                  {screenshots.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-mono">
                      {screenshots.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('versions')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'versions'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>3. Manage Versions ({versions.length})</span>
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProject} className="space-y-6 flex-1 py-2">
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === 'basic' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Project Title / App Name *"
                      placeholder="e.g. YouTube Music"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!editingId) setSlug(slugify(e.target.value));
                      }}
                      required
                    />

                    <Input
                      label="URL Slug (SEO) *"
                      placeholder="e.g. youtube-music-mod"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Publisher / Developer"
                      placeholder="e.g. Kartik Sharma Dev"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                    />

                    <Input
                      label="Category"
                      placeholder="e.g. Android Apps, Music, Tools"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />

                    <Input
                      label="Platform"
                      placeholder="e.g. Android, Windows, Web"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Application Size"
                      placeholder="e.g. 64 MB"
                      value={appSize}
                      onChange={(e) => setAppSize(e.target.value)}
                    />

                    <Input
                      label="Latest Version"
                      placeholder="e.g. v9.47.51"
                      value={latestVersion}
                      onChange={(e) => setLatestVersion(e.target.value)}
                    />
                  </div>

                  {/* MOD Information Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                        MOD Information (Features unlocked)
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">One feature per line</span>
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="1. Premium Features Unlocked&#10;2. No Advertisements&#10;3. Unlimited Downloads"
                      value={modInfo}
                      onChange={(e) => setModInfo(e.target.value)}
                    />
                  </div>

                  {/* What's New changelog */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-indigo-700">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      What's New in this update
                    </label>
                    <Textarea
                      rows={2}
                      placeholder="• Fixed audio background pause bug&#10;• Added Android 15 compatibility&#10;• Improved download speeds"
                      value={whatsNew}
                      onChange={(e) => setWhatsNew(e.target.value)}
                    />
                  </div>

                  {/* Short Description */}
                  <Textarea
                    label="Short Description (Shown on cards & preview header)"
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the application..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />

                  {/* Full Description (Markdown) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Full Case Study / Architecture Article (Markdown Supported)</span>
                      <span className="text-[10px] text-slate-400 font-normal font-mono">Markdown &amp; Code</span>
                    </label>
                    <Textarea
                      rows={6}
                      placeholder="## Overview&#10;Detailed description, features, architecture breakdown, and screenshots..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  {/* External links & tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="GitHub Repository URL"
                      placeholder="https://github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />

                    <Input
                      label="Original / Official Store URL"
                      placeholder="https://play.google.com/store/apps/..."
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Technologies &amp; Libraries (Comma separated)"
                    placeholder="Kotlin, Jetpack Compose, ExoPlayer, AdMob"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                  />

                  {/* Status & Featured Checkboxes */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featuredToggle"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="featuredToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Feature prominently in Featured Showcase
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Publish Status:</span>
                      <select
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold shadow-2xs cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGE MANAGEMENT (PART 3, 2) */}
              {activeTab === 'images' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
                    <strong>Two Upload Methods Supported:</strong> You can upload images directly from your computer (JPG, PNG, WebP) or paste any existing image URL.
                  </div>

                  {/* 1. App Icon */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <span>Project Icon (Squircle / App Icon)</span>
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Icon Preview */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 p-0.5 shadow-sm shrink-0">
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt="Icon Preview"
                            className="w-full h-full object-cover rounded-[14px]"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded-[14px] flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Method A (Upload) + Method B (URL) */}
                      <div className="space-y-3 flex-1 w-full">
                        <Input
                          placeholder="Paste image URL (e.g. https://.../icon.png)"
                          value={iconUrl}
                          onChange={(e) => setIconUrl(e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={iconFileRef}
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const url = await handleFileUpload(f, 'icons');
                                if (url) setIconUrl(url);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            isLoading={uploadingImage === 'icons'}
                            onClick={() => iconFileRef.current?.click()}
                            leftIcon={<Upload className="w-3.5 h-3.5" />}
                          >
                            Upload Icon from Device
                          </Button>

                          {iconUrl && (
                            <button
                              type="button"
                              onClick={() => setIconUrl('')}
                              className="text-xs text-rose-600 hover:underline font-semibold ml-2"
                            >
                              Clear Icon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Banner Image */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Main Banner / Cover Image</span>
                    </h3>

                    {/* Banner Preview */}
                    {bannerUrl && (
                      <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                        <img
                          src={bannerUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setBannerUrl('')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                          title="Remove Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Input
                        placeholder="Paste banner image URL (e.g. https://.../banner.webp)"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={bannerFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await handleFileUpload(f, 'banners');
                              if (url) setBannerUrl(url);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          isLoading={uploadingImage === 'banners'}
                          onClick={() => bannerFileRef.current?.click()}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                        >
                          Upload Banner Image
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Project Screenshots Gallery */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>Project Screenshots ({screenshots.length})</span>
                      </h3>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={screenshotFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await handleFileUpload(f, 'screenshots');
                              if (url) setScreenshots([...screenshots, url]);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          isLoading={uploadingImage === 'screenshots'}
                          onClick={() => screenshotFileRef.current?.click()}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                        >
                          Upload Screenshot
                        </Button>
                      </div>
                    </div>

                    {/* Add URL field */}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Or paste screenshot URL..."
                        value={screenshotInput}
                        onChange={(e) => setScreenshotInput(e.target.value)}
                      />
                      <Button
                        type="button"
                        size="md"
                        variant="secondary"
                        onClick={handleAddScreenshotUrl}
                        disabled={!screenshotInput.trim()}
                      >
                        Add URL
                      </Button>
                    </div>

                    {/* Screenshots Grid */}
                    {screenshots.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                        No screenshots added yet. Upload files or paste URLs above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {screenshots.map((sUrl, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video shadow-2xs"
                          >
                            <img
                              src={sUrl}
                              alt={`Shot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveScreenshot(idx, idx - 1)}
                                  className="p-1 rounded bg-black/50 hover:bg-black"
                                  title="Move Left"
                                >
                                  <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(idx)}
                                className="p-1 rounded bg-rose-600/80 hover:bg-rose-700"
                                title="Remove Screenshot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              {idx < screenshots.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveScreenshot(idx, idx + 1)}
                                  className="p-1 rounded bg-black/50 hover:bg-black"
                                  title="Move Right"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE VERSIONS (PART 4) */}
              {activeTab === 'versions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                    <div>
                      <h3 className="font-bold text-indigo-950 text-sm">
                        Multiple Version Releases ({versions.length})
                      </h3>
                      <p className="text-xs text-indigo-800 mt-0.5">
                        Add MOD releases, original APKs, beta versions, or architecture-specific builds.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={handleAddVersion}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add New Version
                    </Button>
                  </div>

                  {versions.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
                      <Download className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-sm">No versions configured yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click "Add New Version" above to provide your first APK download package.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {versions.map((ver, idx) => {
                        const isExpanded = editingVersionIdx === idx;

                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl border transition-all ${
                              ver.is_latest
                                ? 'bg-indigo-50/30 border-indigo-200 shadow-sm'
                                : 'bg-slate-50/50 border-slate-200'
                            }`}
                          >
                            {/* Version Card Header Bar */}
                            <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {ver.version_name || `Version #${idx + 1}`}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                                  {ver.version_type}
                                </span>
                                {ver.is_latest && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                                    LATEST
                                  </span>
                                )}
                                <span className="text-xs font-mono text-slate-400">
                                  ({ver.file_size || '0 MB'})
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveVersion(idx, idx - 1)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {idx < versions.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveVersion(idx, idx + 1)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateVersion(idx)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                  title="Duplicate Version"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVersion(idx)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                                  title="Delete Version"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingVersionIdx(isExpanded ? null : idx)
                                  }
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50"
                                >
                                  {isExpanded ? 'Done' : 'Edit'}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Version Form */}
                            {isExpanded && (
                              <div className="p-4 sm:p-5 space-y-4 bg-white rounded-b-2xl">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <Input
                                    label="Version Display Name *"
                                    placeholder="e.g. YouTube Music v9.47.51 MOD"
                                    value={ver.version_name}
                                    onChange={(e) => {
                                      const copy = [...versions];
                                      copy[idx].version_name = e.target.value;
                                      setVersions(copy);
                                    }}
                                    required
                                  />

                                  <Input
                                    label="Version Number *"
                                    placeholder="e.g. 9.47.51"
                                    value={ver.version_number}
                                    onChange={(e) => {
                                      const copy = [...versions];
                                      copy[idx].version_number = e.target.value;
                                      setVersions(copy);
                                    }}
                                    required
                                  />

                                  <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Version Type</label>
                                    <select
                                      value={ver.version_type}
                                      onChange={(e) => {
                                        const copy = [...versions];
                                        copy[idx].version_type = e.target.value;
                                        setVersions(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold shadow-2xs"
                                    >
                                      <option value="MOD">MOD (Modified / Unlocked)</option>
                                      <option value="Original">Original (Official / Play Store)</option>
                                      <option value="Beta">Beta (Experimental)</option>
                                      <option value="Older">Older Version</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <Input
                                    label="File Size"
                                    placeholder="e.g. 64 MB"
                                    value={ver.file_size}
                                    onChange={(e) => {
                                      const copy = [...versions];
                                      copy[idx].file_size = e.target.value;
                                      setVersions(copy);
                                    }}
                                  />

                                  <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Architecture</label>
                                    <select
                                      value={ver.architecture}
                                      onChange={(e) => {
                                        const copy = [...versions];
                                        copy[idx].architecture = e.target.value;
                                        setVersions(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold shadow-2xs"
                                    >
                                      <option value="Universal">Universal (All Devices)</option>
                                      <option value="ARM64">ARM64 (v8a)</option>
                                      <option value="ARM">ARM (v7a)</option>
                                      <option value="x86">x86 / x86_64</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">Root Requirement</label>
                                    <select
                                      value={ver.root_requirement}
                                      onChange={(e) => {
                                        const copy = [...versions];
                                        copy[idx].root_requirement = e.target.value;
                                        setVersions(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold shadow-2xs"
                                    >
                                      <option value="Non-Root">Non-Root (Standard)</option>
                                      <option value="Root">Root Required</option>
                                      <option value="Both">Both Root &amp; Non-Root</option>
                                      <option value="Not Applicable">Not Applicable</option>
                                    </select>
                                  </div>
                                </div>

                                <Input
                                  label="Download APK URL *"
                                  placeholder="https://download.example.com/apps/app-mod.apk or Drive/MediaFire link"
                                  value={ver.download_url}
                                  onChange={(e) => {
                                    const copy = [...versions];
                                    copy[idx].download_url = e.target.value;
                                    setVersions(copy);
                                  }}
                                  required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <Input
                                    label="Release Date"
                                    placeholder="e.g. November 2026"
                                    value={ver.release_date}
                                    onChange={(e) => {
                                      const copy = [...versions];
                                      copy[idx].release_date = e.target.value;
                                      setVersions(copy);
                                    }}
                                  />

                                  <Input
                                    label="Changelog / Notes for this Version"
                                    placeholder="e.g. Unlocked high-bitrate audio & background play"
                                    value={ver.changelog}
                                    onChange={(e) => {
                                      const copy = [...versions];
                                      copy[idx].changelog = e.target.value;
                                      setVersions(copy);
                                    }}
                                  />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`latestToggle-${idx}`}
                                      checked={ver.is_latest}
                                      onChange={() => handleSetLatestVersion(idx)}
                                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                                    />
                                    <label htmlFor={`latestToggle-${idx}`} className="text-xs font-bold text-slate-800 cursor-pointer">
                                      Mark as Latest Recommended Version
                                    </label>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-600">Status:</span>
                                    <select
                                      value={ver.status}
                                      onChange={(e: any) => {
                                        const copy = [...versions];
                                        copy[idx].status = e.target.value;
                                        setVersions(copy);
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200"
                                    >
                                      <option value="published">Published</option>
                                      <option value="draft">Draft</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Action Buttons Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {slug && (
                    <Link
                      href={`/projects/${slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Live Preview</span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditorOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    {editingId ? 'Save & Update Project' : 'Create & Publish Project'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
