import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { getPosts, createPost } from '@/lib/data';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { ForumPost, Neighborhood } from '@/types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get('filter') as 'recent' | 'needs-id' | Neighborhood | undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const posts = await getPosts({ filter, limit, offset });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`post:${clientIP}`, 1, 60000); // 1 per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many posts. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();

    // Check honeypot
    if (formData.get('website')) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Get image file
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or HEIC image.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image is too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Get form fields
    const displayName = (formData.get('displayName') as string)?.trim();
    if (!displayName) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }

    const title = (formData.get('title') as string)?.trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const body = (formData.get('body') as string)?.trim() || undefined;
    const caption = (formData.get('caption') as string)?.trim() || undefined;
    const neighborhood = (formData.get('neighborhood') as Neighborhood) || undefined;
    const speciesGuess = (formData.get('speciesGuess') as string)?.trim() || undefined;
    const needsIdHelp = formData.get('needsIdHelp') === 'on';

    // Generate post ID
    const postId = uuidv4();
    const timestamp = Date.now();
    const extension = imageFile.name.split('.').pop() || 'jpg';

    // Upload original image to Vercel Blob
    let imageUrl = '';
    let thumbnailUrl = '';

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Use Vercel Blob
      const blob = await put(`posts/${postId}/original.${extension}`, imageFile, {
        access: 'public',
        contentType: imageFile.type,
      });
      imageUrl = blob.url;

      // For MVP, use the same image as thumbnail
      // TODO: Implement Sharp-based thumbnail generation
      thumbnailUrl = blob.url;
    } else {
      // Development: Store locally or use placeholder
      // In a real setup, you'd save to local filesystem
      // For now, we'll use a data URL approach for testing
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
      thumbnailUrl = imageUrl;
    }

    // Create post record
    const post: ForumPost = {
      id: postId,
      imageUrl,
      thumbnailUrl,
      displayName,
      title,
      body,
      caption,
      neighborhood,
      speciesGuess,
      needsIdHelp,
      createdAt: new Date(timestamp).toISOString(),
      isDeleted: false,
    };

    await createPost(post);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create post', details: errorMessage },
      { status: 500 }
    );
  }
}
