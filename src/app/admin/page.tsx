import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAdminStats, getPosts } from '@/lib/data';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard | Mt Tabor Bulb Society',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const stats = await getAdminStats();
  const posts = await getPosts({ includeDeleted: true, limit: 100 });

  return <AdminDashboard stats={stats} posts={posts} />;
}
