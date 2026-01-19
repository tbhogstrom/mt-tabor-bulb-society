import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getPost, getComments, createComment } from '@/lib/data';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { Comment } from '@/types';

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || post.isDeleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const comments = await getComments(id);
  
  // Return with no-cache headers
  return NextResponse.json(comments, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: postId } = await params;

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`comment:${clientIP}`, 5, 60000); // 5 per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many comments. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  // Check post exists
  const post = await getPost(postId);
  if (!post || post.isDeleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Check honeypot
    if (body.website) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Validate fields
    const displayName = body.displayName?.trim();
    if (!displayName) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }

    const content = body.content?.trim();
    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment is too long (max 1000 characters)' }, { status: 400 });
    }

    const parentCommentId = body.parentCommentId || undefined;

    // Create comment
    const comment: Comment = {
      id: uuidv4(),
      postId,
      parentCommentId,
      displayName,
      content,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };

    await createComment(comment);

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
