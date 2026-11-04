import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, WebP, or AVIF image.' },
        { status: 400 }
      );
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum allowed size is 10MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `hero-bg-${Date.now()}.${ext}`;

    // 1. Try Supabase Storage first (Existing storage system)
    try {
      const supabaseAdmin = createAdminClient();
      
      // Try bucket 'profile-images' (already configured in schema.sql)
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('profile-images')
        .upload(`hero/${filename}`, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadErr && uploadData?.path) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('profile-images')
          .getPublicUrl(uploadData.path);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storage: 'supabase',
          });
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload attempt failed, falling back to local storage:', storageErr);
    }

    // 2. Fallback: Store locally in public/uploads/hero
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'hero');
    await fs.mkdir(uploadDir, { recursive: true });
    const localFilePath = path.join(uploadDir, filename);
    await fs.writeFile(localFilePath, buffer);

    const publicLocalUrl = `/uploads/hero/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicLocalUrl,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('Upload hero image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image upload' },
      { status: 500 }
    );
  }
}

