'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils/cn';
import {
  Settings,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mail,
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { YouTubeIcon, GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/ui/Icons';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile
  const [profileId, setProfileId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [skills, setSkills] = useState('');

  // Social Links
  const [youtube, setYoutube] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');

  // Website Settings
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [youtubeSubs, setYoutubeSubs] = useState('');
  const [totalViews, setTotalViews] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('/images/hero-cinematic.png');
  const [heroBgOpacity, setHeroBgOpacity] = useState(100);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [savingOpacity, setSavingOpacity] = useState(false);
  const [opacitySuccess, setOpacitySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Load Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (profile) {
        setProfileId(profile.id);
        setDisplayName(profile.display_name || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
        setSkills((profile.skills || []).join(', '));

        const soc = profile.social_links || {};
        setYoutube(soc.youtube || '');
        setGithub(soc.github || '');
        setLinkedin(soc.linkedin || '');
        setTwitter(soc.twitter || '');
        setEmail(soc.email || '');
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setProfileId(session.user.id);
          setDisplayName(
            session.user.user_metadata?.full_name ||
              session.user.email?.split('@')[0] ||
              'Kartik Sharma'
          );
          setEmail(session.user.email || '');
        }
      }

      // Load Site Settings
      const { data: siteConfig } = await supabase
        .from('website_settings')
        .select('*')
        .eq('setting_key', 'site_config')
        .maybeSingle();

      if (siteConfig?.setting_value) {
        const val = siteConfig.setting_value;
        setHeroHeading(val.hero_heading || '');
        setHeroSubheading(val.hero_subheading || '');
        setAnnouncement(val.announcement_banner || '');
        setYoutubeSubs(val.youtube_subscribers || '');
        setTotalViews(val.total_views || '');
        setHeroBgImage(
          val.hero_background_image !== undefined
            ? val.hero_background_image
            : '/images/hero-cinematic.png'
        );
        setHeroBgOpacity(
          typeof val.hero_background_opacity === 'number'
            ? val.hero_background_opacity
            : 100
        );
      }
    } catch (err) {
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg(null);
      setUploadSuccess(false);

      // Instant preview for fast responsive UI
      const previewUrl = URL.createObjectURL(file);
      setHeroBgImage(previewUrl);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-hero', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setHeroBgImage(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Image upload failed. Please try a different image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRestoreDefaultBg = () => {
    setHeroBgImage('/images/hero-cinematic.png');
    setHeroBgOpacity(100);
    setUploadSuccess(false);
  };

  const handleRemoveCustomBg = () => {
    setHeroBgImage('');
    setUploadSuccess(false);
  };

  const handleResetVisibility = () => {
    setHeroBgOpacity(100);
    setOpacitySuccess(false);
  };

  const handleSaveVisibility = async () => {
    try {
      setSavingOpacity(true);
      setErrorMsg(null);

      // Load existing config to ensure clean atomic merge
      const { data: currentConfig } = await supabase
        .from('website_settings')
        .select('setting_value')
        .eq('setting_key', 'site_config')
        .maybeSingle();

      const existingVal = currentConfig?.setting_value || {};

      const { error: setErr } = await supabase
        .from('website_settings')
        .upsert(
          {
            setting_key: 'site_config',
            setting_value: {
              ...existingVal,
              hero_heading: heroHeading.trim() || existingVal.hero_heading,
              hero_subheading: heroSubheading.trim() || existingVal.hero_subheading,
              announcement_banner: announcement.trim() || existingVal.announcement_banner,
              youtube_subscribers: youtubeSubs.trim() || existingVal.youtube_subscribers,
              total_views: totalViews.trim() || existingVal.total_views,
              hero_background_image: heroBgImage.trim() || existingVal.hero_background_image,
              hero_background_opacity: Number(heroBgOpacity),
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'setting_key' }
        );

      if (setErr) throw setErr;

      setOpacitySuccess(true);
      setTimeout(() => setOpacitySuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save visibility:', err);
      setErrorMsg(err.message || 'Failed to save visibility setting.');
    } finally {
      setSavingOpacity(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(false);

      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const socialLinks = {
        youtube: youtube.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        twitter: twitter.trim() || undefined,
        email: email.trim() || undefined,
      };

      // 1. Update/Upsert Profile
      let targetId = profileId;
      if (!targetId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          targetId = session.user.id;
          setProfileId(session.user.id);
        }
      }

      if (targetId) {
        const { error: profErr } = await supabase
          .from('profiles')
          .upsert(
            {
              id: targetId,
              display_name: displayName.trim(),
              bio: bio.trim(),
              avatar_url: avatarUrl.trim(),
              skills: skillsArray,
              social_links: socialLinks,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

        if (profErr) throw profErr;
      }

      // 2. Update Website Settings
      const { error: setErr } = await supabase
        .from('website_settings')
        .upsert(
          {
            setting_key: 'site_config',
            setting_value: {
              hero_heading: heroHeading.trim(),
              hero_subheading: heroSubheading.trim(),
              announcement_banner: announcement.trim(),
              youtube_subscribers: youtubeSubs.trim(),
              total_views: totalViews.trim(),
              hero_background_image: heroBgImage.trim(),
              hero_background_opacity: Number(heroBgOpacity),
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'setting_key' }
        );

      if (setErr) throw setErr;

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portfolio &amp; Website Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Update your public developer identity, bio, social presence, and homepage announcements.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Website &amp; profile settings updated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Developer Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name *"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              label="Avatar Image URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <Textarea
            label="Professional Biography"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Input
            label="Technical Skills (Comma separated)"
            placeholder="Android Development, Kotlin, Flutter, Google AdMob, Firebase"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <YouTubeIcon className="w-4 h-4 text-red-600" />
            <span>Social &amp; Contact Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="YouTube Channel URL"
              placeholder="https://youtube.com/@..."
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              leftIcon={<YouTubeIcon className="w-4 h-4" />}
            />
            <Input
              label="GitHub Profile URL"
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              leftIcon={<GitHubIcon className="w-4 h-4" />}
            />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              leftIcon={<LinkedInIcon className="w-4 h-4" />}
            />
            <Input
              label="Twitter / X URL"
              placeholder="https://twitter.com/..."
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              leftIcon={<TwitterIcon className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Public Contact Email"
            type="email"
            placeholder="contact@..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Homepage & Content Config */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Homepage Copy &amp; Verified Stats</span>
          </h2>

          <Input
            label="Announcement Banner Text"
            placeholder="🚀 New Google AdMob & Android Masterclass is live!"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />

          <Input
            label="Hero Heading"
            placeholder="Crafting Scalable Mobile Apps & Educating 100K+ Developers"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
          />

          <Textarea
            label="Hero Subheading"
            rows={2}
            value={heroSubheading}
            onChange={(e) => setHeroSubheading(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="YouTube Subscribers Stat (e.g. 125,000+)"
              value={youtubeSubs}
              onChange={(e) => setYoutubeSubs(e.target.value)}
            />
            <Input
              label="Total Views Stat (e.g. 4.8M+)"
              value={totalViews}
              onChange={(e) => setTotalViews(e.target.value)}
            />
          </div>
        </div>

        {/* Hero Background Image Settings */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Hero Background Image Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage and preview the cinematic background image displayed exclusively on the homepage Hero section.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDefaultBg}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                title="Restore default cinematic background image"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Restore Default Background</span>
              </button>
              {heroBgImage && (
                <button
                  type="button"
                  onClick={handleRemoveCustomBg}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  title="Remove custom image and use clean light default"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Preview of the Hero Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Live Preview (Hero Mockup)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {heroBgImage ? 'Cinematic Mode' : 'Clean Light Mode'}
              </span>
            </div>

            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col justify-center items-center text-center p-6 shadow-inner">
              {heroBgImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-150"
                    style={{
                      backgroundImage: `url('${heroBgImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: heroBgOpacity / 100,
                    }}
                  />
                  {/* Dark Cinematic Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-slate-950/65 backdrop-brightness-[0.75]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
                </>
              ) : (
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                  <div className="w-[300px] h-[150px] bg-gradient-to-tr from-indigo-100/70 via-sky-100/50 to-transparent blur-2xl rounded-full" />
                </div>
              )}

              {/* Sample Live Mockup matching homepage hero typography */}
              <div className="relative z-10 max-w-md space-y-2">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                  heroBgImage
                    ? "bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-indigo-300 shadow-md"
                    : "bg-indigo-50 border border-indigo-200 text-indigo-700"
                )}>
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>{announcement || '🚀 New Google AdMob & Android Masterclass is live!'}</span>
                </div>
                <h3 className={cn(
                  "text-lg sm:text-xl font-extrabold tracking-tight leading-snug",
                  heroBgImage ? "text-white drop-shadow-md" : "text-slate-900"
                )}>
                  {heroHeading || 'Crafting Scalable Mobile Apps & Educating 100K+ Developers'}
                </h3>
                <p className={cn(
                  "text-xs line-clamp-2 max-w-sm mx-auto",
                  heroBgImage ? "text-slate-200" : "text-slate-600"
                )}>
                  {heroSubheading || 'Explore production-grade Android, Flutter, and Full-Stack tutorials with complete source code.'}
                </p>
              </div>

              {heroBgImage && (
                <div className="absolute bottom-2.5 right-2.5 z-10 text-[10px] bg-black/70 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-md font-mono border border-white/10">
                  cover • center
                </div>
              )}
            </div>
          </div>

          {/* Upload & Replacement Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* File Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Upload Image File</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select a high-resolution cinematic image from your device (JPG, PNG, WebP up to 10MB).
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={uploading}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  {heroBgImage ? 'Replace Background Image' : 'Upload Background Image'}
                </Button>
                {uploadSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Uploaded &amp; applied
                  </span>
                )}
              </div>
            </div>

            {/* Direct Image URL or Path Input */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Or Image URL / Path</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enter an image URL (Supabase, Unsplash, CDN) or local static path.
                </p>
              </div>

              <Input
                placeholder="https://... or /images/hero-cinematic.png"
                value={heroBgImage}
                onChange={(e) => {
                  setHeroBgImage(e.target.value);
                  setUploadSuccess(false);
                }}
              />
            </div>
          </div>

          {/* Hero Background Visibility Control */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Hero Background Visibility Control</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-2xs">
                {heroBgOpacity}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Control how visible or faded the homepage Hero background image appears. Changes reflect immediately in the live preview above.
            </p>

            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={heroBgOpacity}
                onChange={(e) => {
                  setHeroBgOpacity(Number(e.target.value));
                  setOpacitySuccess(false);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Completely Hidden)</span>
                <span>Default: 100%</span>
                <span>100% (Fully Visible)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleResetVisibility}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Reset visibility to default (100%)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-2">
                {opacitySuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Visibility setting saved!
                  </span>
                )}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveVisibility}
                  isLoading={savingOpacity}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Visibility Setting
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
