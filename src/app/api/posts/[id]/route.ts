import { NextRequest, NextResponse } from 'next/server';
import { getPost, deletePost } from '@/lib/data';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || post.isDeleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deletePost(id, 'admin');

  if (!success) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
