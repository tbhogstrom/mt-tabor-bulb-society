import { NextRequest, NextResponse } from 'next/server';
import { deleteComment } from '@/lib/data';
import { isAdminAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteComment(id);

  if (!success) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
