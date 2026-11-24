-- ==============================================================================
-- PROJECTS V2 & MULTIPLE VERSION MANAGEMENT MIGRATION
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/igrritzxmfjymshjdphy/sql
-- ==============================================================================

-- 1. Extend the public.projects table with enhanced APK MOD & app info fields
ALTER TABLE public.projects 
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS publisher TEXT DEFAULT 'Kartik Sharma',
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Android Apps',
    ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'Android',
    ADD COLUMN IF NOT EXISTS app_size TEXT DEFAULT '45 MB',
    ADD COLUMN IF NOT EXISTS latest_version TEXT DEFAULT 'v1.0.0',
    ADD COLUMN IF NOT EXISTS mod_info TEXT,
    ADD COLUMN IF NOT EXISTS whats_new TEXT,
    ADD COLUMN IF NOT EXISTS icon_url TEXT,
    ADD COLUMN IF NOT EXISTS banner_url TEXT,
    ADD COLUMN IF NOT EXISTS original_url TEXT,
    ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- 2. Create the project_versions table for multiple versions & downloads
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    version_number TEXT NOT NULL,
    version_type TEXT NOT NULL DEFAULT 'MOD' CHECK (version_type IN ('MOD', 'Original', 'Beta', 'Older', 'Custom')),
    file_size TEXT NOT NULL DEFAULT '0 MB',
    architecture TEXT NOT NULL DEFAULT 'Universal',
    root_requirement TEXT NOT NULL DEFAULT 'Non-Root',
    download_url TEXT NOT NULL,
    changelog TEXT,
    release_date TEXT,
    is_latest BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the project_images table for gallery management
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'screenshot',
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_status ON public.project_versions(status);
CREATE INDEX IF NOT EXISTS idx_project_versions_is_latest ON public.project_versions(is_latest);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for project_versions
DROP POLICY IF EXISTS "Public read published project_versions" ON public.project_versions;
CREATE POLICY "Public read published project_versions" ON public.project_versions
    FOR SELECT USING (
        status = 'published' OR 
        (SELECT public.is_admin())
    );

DROP POLICY IF EXISTS "Admin manage project_versions" ON public.project_versions;
CREATE POLICY "Admin manage project_versions" ON public.project_versions
    FOR ALL USING (
        (SELECT public.is_admin())
    );

-- 7. RLS Policies for project_images
DROP POLICY IF EXISTS "Public read project_images" ON public.project_images;
CREATE POLICY "Public read project_images" ON public.project_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage project_images" ON public.project_images;
CREATE POLICY "Admin manage project_images" ON public.project_images
    FOR ALL USING (
        (SELECT public.is_admin())
    );

-- 8. Seed default versions for any existing projects without versions
DO $$
DECLARE
    proj RECORD;
BEGIN
    FOR proj IN SELECT id, title, latest_version, app_size, demo_url, github_url FROM public.projects LOOP
        IF NOT EXISTS (SELECT 1 FROM public.project_versions WHERE project_id = proj.id) THEN
            INSERT INTO public.project_versions (
                project_id,
                version_name,
                version_number,
                version_type,
                file_size,
                architecture,
                root_requirement,
                download_url,
                changelog,
                release_date,
                is_latest,
                status,
                display_order
            ) VALUES (
                proj.id,
                proj.title || ' Latest Stable',
                COALESCE(proj.latest_version, 'v1.0.0'),
                'Original',
                COALESCE(proj.app_size, '42 MB'),
                'Universal',
                'Non-Root',
                COALESCE(proj.demo_url, proj.github_url, 'https://github.com/kartiksharma'),
                'Initial release with high-performance architecture and full documentation.',
                '2026',
                true,
                'published',
                0
            );
        END IF;
    END LOOP;
END $$;

