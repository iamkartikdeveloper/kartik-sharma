export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin' | 'owner';

export interface Profile {
  id: string;
  email?: string | null;
  display_name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  skills: string[];
  is_verified?: boolean;
  verified_at?: string | null;
  verification_badge?: string | null;
  social_links: {
    youtube?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    website?: string;
  };
  created_at?: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  youtube_url: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  prerequisites: string[];
  reading_time: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  is_featured: boolean;
  is_verified?: boolean;
  verification_badge?: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category | null;
  tags?: Tag[];
  code_snippets?: CodeSnippet[];
  resources?: TutorialResource[];
  feedback_stats?: {
    helpful_count: number;
    total_count: number;
  };
}

export interface CodeSnippet {
  id: string;
  tutorial_id: string;
  title: string | null;
  language: string;
  code: string;
  explanation: string | null;
  sort_order: number;
  created_at: string;
}

export interface TutorialResource {
  id: string;
  tutorial_id: string;
  title: string;
  file_url: string;
  resource_type: 'zip' | 'pdf' | 'github' | 'link' | 'other';
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface Comment {
  id: string;
  tutorial_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  created_at: string;
}

export interface TutorialFeedback {
  id: string;
  tutorial_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  created_at: string;
}

export interface TutorialView {
  id: string;
  tutorial_id: string;
  viewed_at: string;
}

export interface WebsiteSettings {
  id: string;
  setting_key: string;
  setting_value: {
    title?: string;
    tagline?: string;
    hero_heading?: string;
    hero_subheading?: string;
    announcement_banner?: string;
    youtube_subscribers?: string;
    total_views?: string;
    footer_text?: string;
    hero_background_image?: string;
    hero_background_opacity?: number;
    [key: string]: any;
  };
  updated_at: string;
}

export interface SearchResult {
  tutorials: Tutorial[];
  projects: Project[];
  total: number;
}
