import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'images'; // icons, banners, screenshots

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, WebP, or SVG image.' },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum allowed size is 15MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 30);
    const filename = `${folder}/${cleanBaseName}-${Date.now()}.${ext}`;

    // 1. Try Supabase Storage first ('project-images' or 'profile-images')
    try {
      const supabaseAdmin = createAdminClient();
      
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('project-images')
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadErr && uploadData?.path) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('project-images')
          .getPublicUrl(uploadData.path);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storage: 'supabase',
          });
        }
      } else {
        // Try fallback bucket 'profile-images'
        const { data: fallbackUpload, error: fallbackErr } = await supabaseAdmin.storage
          .from('profile-images')
          .upload(`projects/${filename}`, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!fallbackErr && fallbackUpload?.path) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('profile-images')
            .getPublicUrl(fallbackUpload.path);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              storage: 'supabase',
            });
          }
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload attempt failed, falling back to local storage:', storageErr);
    }

    // 2. Local Fallback: Store locally in public/uploads/projects/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', folder);
    await fs.mkdir(uploadDir, { recursive: true });
    const localBaseFilename = `${cleanBaseName}-${Date.now()}.${ext}`;
    const localFilePath = path.join(uploadDir, localBaseFilename);
    await fs.writeFile(localFilePath, buffer);

    const publicLocalUrl = `/uploads/projects/${folder}/${localBaseFilename}`;

    return NextResponse.json({
      success: true,
      url: publicLocalUrl,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('Upload project image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image upload' },
      { status: 500 }
    );
  }
}

