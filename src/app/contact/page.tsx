'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { YouTubeIcon, GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/ui/Icons';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Ignore spam bot

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill out all fields before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setError(err.message || 'An error occurred while sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-mono uppercase tracking-wider font-bold">
          <Mail className="w-4 h-4" />
          <span>Connect With Me</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Let's Build Something Great Together
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Have an Android app project, need AdMob monetization advice, or want to sponsor a YouTube tutorial? Fill out the form or reach out through my socials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs"
          >
            {/* Honeypot field */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              autoComplete="off"
              tabIndex={-1}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Kartik Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="kartik.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject *"
              placeholder="e.g. Android Consulting / AdMob Integration"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <Textarea
              label="Message *"
              placeholder="Tell me about your project, timeline, and questions..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>
                  Thank you! Your message has been sent successfully. I will get back to you within 24-48 hours.
                </span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={loading}
              rightIcon={<Send className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Info & Response Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Response Guarantee</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              I read every message and typically respond within 24 business hours. For immediate project inquiries or mentorship, include your project repo or brief.
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Direct Inquiries:</span>
                <a
                  href="mailto:kartiksharma20081186@gmail.com"
                  className="text-slate-900 hover:text-indigo-600 font-semibold transition-colors"
                >
                  kartiksharma20081186@gmail.com
                </a>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Location &amp; Timezone:</span>
                <span className="text-slate-900 font-semibold">India (IST / UTC +5:30)</span>
              </div>
            </div>
          </div>

          {/* Social Presence */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Connect Across Platforms</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href="https://www.youtube.com/@kartik_sharma546"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
              >
                <YouTubeIcon className="w-4 h-4 text-red-600" />
                <span>YouTube</span>
              </a>
              <a
                href="https://github.com/iamkartikdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
              >
                <GitHubIcon className="w-4 h-4 text-slate-700" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/kartik-sharma-softwaredeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
              >
                <LinkedInIcon className="w-4 h-4 text-sky-600" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://x.com/KARTIKS9821537"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
              >
                <TwitterIcon className="w-4 h-4 text-sky-600" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
