'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Heart,
  Sparkles,
} from 'lucide-react';
import { YouTubeIcon, GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/ui/Icons';

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hide public footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: subError } = await supabase.from('newsletter_subscribers').insert([
        {
          email: email.trim().toLowerCase(),
          status: 'active',
        },
      ]);

      if (subError) {
        if (subError.code === '23505') {
          // Already subscribed
          setSuccess(true);
          return;
        }
        throw subError;
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError('Unable to subscribe right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 text-sm mt-24">
      {/* Top Section with Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-200">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-mono font-bold text-indigo-600 text-sm">
                  &lt;K/&gt;
                </div>
              </div>
              <span className="font-bold text-slate-900 text-base">Kartik Sharma</span>
            </Link>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Senior Android Engineer &amp; Full Stack Developer. Building production mobile applications, modern web software, and helping 100K+ engineers master real-world code through comprehensive YouTube tutorials.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@kartik_sharma546"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors shadow-2xs"
                title="YouTube Channel"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/iamkartikdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
                title="GitHub Profile"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="www.linkedin.com/in/kartik-sharma-softwaredeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-colors shadow-2xs"
                title="LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/KARTIKS9821537"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-colors shadow-2xs"
                title="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:[kartiksharma20081186@gmail.com]"
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-2xs"
                title="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-indigo-600 transition-colors">
                  All Tutorials
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-indigo-600 transition-colors">
                  Projects Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition-colors">
                  About &amp; Experience
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Tutorial Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/tutorials?category=android-development" className="hover:text-indigo-600 transition-colors">
                  Android &amp; Kotlin
                </Link>
              </li>
              <li>
                <Link href="/tutorials?category=google-admob" className="hover:text-indigo-600 transition-colors">
                  Google AdMob
                </Link>
              </li>
              <li>
                <Link href="/tutorials?category=firebase" className="hover:text-indigo-600 transition-colors">
                  Firebase &amp; Auth
                </Link>
              </li>
              <li>
                <Link href="/tutorials?category=flutter-dart" className="hover:text-indigo-600 transition-colors">
                  Flutter &amp; Dart
                </Link>
              </li>
              <li>
                <Link href="/tutorials?category=web-development" className="hover:text-indigo-600 transition-colors">
                  Next.js &amp; React
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Developer Newsletter</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get notified when fresh YouTube tutorials, source code snippets, and architecture guides drop. No spam, ever.
            </p>

            {success ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>You are subscribed! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Kartik Sharma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
