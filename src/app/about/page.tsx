import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Sparkles,
  Smartphone,
  Globe,
  Database,
  Mail,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { YouTubeIcon, GitHubIcon, LinkedInIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'About Kartik Sharma | Senior Android & Full Stack Developer',
  description:
    'Learn about Kartik Sharma, a Senior Mobile Engineer & Technical Educator with 5+ years of experience building production Android and Flutter apps and teaching 100K+ developers worldwide.',
};

export default async function AboutPage() {
  const supabase = createServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const skills = profile?.skills || [
    'Android Development',
    'Kotlin',
    'Java',
    'Flutter',
    'Dart',
    'Google AdMob',
    'Firebase',
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Supabase',
    'REST APIs',
    'PostgreSQL',
    'Docker',
  ];

  const milestones = [
    {
      year: '2020 - Present',
      title: 'Senior Mobile Engineer & Content Creator',
      company: 'YouTube & Developer Consulting',
      description:
        'Created 150+ high-production tutorials on Android monetization, Google AdMob, Jetpack Compose, and cross-platform Flutter architecture, growing an active community of 125,000+ developers.',
    },
    {
      year: '2021 - 2023',
      title: 'Lead Android Developer',
      company: 'PulseStream Software',
      description:
        'Architected high-throughput mobile telemetry clients and AdMob mediation SDKs serving 2M+ active monthly users with 99.9% crash-free sessions.',
    },
    {
      year: '2019 - 2021',
      title: 'Full Stack Mobile & Web Developer',
      company: 'TechCraft Solutions',
      description:
        'Designed end-to-end REST APIs and built client applications in Flutter, Android Kotlin, and React for fintech and health clients.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* 1. Header & Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-mono uppercase tracking-wider font-bold">
            <User className="w-4 h-4" />
            <span>Developer Journey</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Hi, I'm {profile?.display_name || 'Kartik Sharma'} 👋
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            {profile?.bio ||
              'Senior Android Engineer & Educator passionate about crafting high-performance mobile applications and sharing practical, real-world development tutorials with engineers worldwide.'}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            Over the past 5+ years, I have specialized in native Android architecture, Google AdMob monetization strategies, Flutter cross-platform applications, and modern TypeScript full-stack web platforms. My goal is to break down complex architectural patterns into clear, step-by-step guides with 100% production-ready source code.
          </p>

          {/* Social Profiles */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://www.youtube.com/@kartik_sharma546"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold transition-colors"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span>YouTube</span>
            </a>
            <a
              href="https://github.com/iamkartikdeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/kartik-sharma-softwaredeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <Link href="/contact">
              <Button size="sm" variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="light-card rounded-3xl p-6 text-center space-y-5 border border-slate-200 bg-white shadow-xs">
            <div className="w-36 h-36 mx-auto rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400">
              <img
                src={
                  profile?.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                }
                alt="Kartik Sharma"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Kartik Sharma</h3>
              <p className="text-xs text-indigo-600 font-mono mt-1 font-semibold">
                Senior Engineer &amp; Educator
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span className="text-slate-900 font-semibold">India / Remote Global</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Experience:</span>
                <span className="text-slate-900 font-semibold">5+ Years</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Available for contracts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Technical Skills Matrix */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technical Mastery</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Technologies, libraries, and tools I use on a daily basis to architect robust software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Mobile Engineering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kotlin, Java, Android Jetpack, Compose, Coroutines, Room, Retrofit, Flutter &amp; Dart, Bloc, Riverpod.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Web &amp; Full Stack</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Next.js 14 App Router, React 19, TypeScript, Tailwind CSS, Server Actions, REST APIs, Microservices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cloud &amp; Monetization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google AdMob (Banners, Interstitial, Rewarded), Firebase Suite, Supabase PostgreSQL, RLS, Auth, Storage.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Professional Timeline */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Experience &amp; Career</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            My career highlights, software engineering roles, and open source achievements.
          </p>
        </div>

        <div className="space-y-6">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1">
                <span className="font-mono text-indigo-600 font-bold">{item.company}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
