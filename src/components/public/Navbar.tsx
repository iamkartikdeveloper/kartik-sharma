'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import {
  Code2,
  BookOpen,
  FolderGit2,
  User,
  Mail,
  Search,
  Menu,
  X,
  Shield,
  ShieldCheck,
  ExternalLink,
  LogIn,
} from 'lucide-react';
import { isUserAdminOrOwner } from '@/lib/auth-helpers';
import { YouTubeIcon } from '@/components/ui/Icons';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Hide public navbar on admin pages
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAdminPage) return null;

  const navLinks = [
    { href: '/', label: 'Home', icon: Code2 },
    { href: '/tutorials', label: 'Tutorials', icon: BookOpen },
    { href: '/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/about', label: 'About', icon: User },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-black text-indigo-600 text-base">
                &lt;K/&gt;
              </span>
            </div>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
              Kartik Sharma
            </span>
            <span className="block text-[10px] text-slate-500 font-mono tracking-widest uppercase font-medium">
              Dev &amp; Tutorials
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Search Link */}
          <Link
            href="/tutorials"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search guides...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs font-mono">
              /
            </kbd>
          </Link>

          {/* YouTube Channel Button */}
          <a
            href="https://www.youtube.com/@kartik_sharma546"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold transition-all"
          >
            <YouTubeIcon className="w-4 h-4" />
            <span>YouTube</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* User Auth Action Button */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              title="View Profile"
            >
              {isUserAdminOrOwner(user.email) || user.email_confirmed_at ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <User className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>Profile</span>
              {(isUserAdminOrOwner(user.email) || user.email_confirmed_at) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Admin Portal Shortcut */}
          {/* <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </Link> */}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="p-2 text-indigo-600 hover:text-indigo-700"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="p-2 text-slate-600 hover:text-slate-900"
              title="Sign In"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          )}
          <Link
            href="/tutorials"
            className="p-2 text-slate-600 hover:text-slate-900"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
