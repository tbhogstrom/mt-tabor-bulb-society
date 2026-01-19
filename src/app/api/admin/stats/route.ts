import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAdminStats } from '@/lib/data';

export async function GET() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getAdminStats();
  return NextResponse.json(stats);
}
