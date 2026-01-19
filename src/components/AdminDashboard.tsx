'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminStats, ForumPost } from '@/types';

interface AdminDashboardProps {
  stats: AdminStats;
  posts: ForumPost[];
}

export function AdminDashboard({ stats, posts }: AdminDashboardProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'deleted'>('active');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (filter === 'active') return !post.isDeleted;
    if (filter === 'deleted') return post.isDeleted;
    return true;
  });

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeletingId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.refresh();
    } catch (error) {
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="container-wide py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-charcoal-500 hover:text-charcoal text-sm"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Posts" value={stats.totalPosts} />
        <StatCard label="Posts This Week" value={stats.postsThisWeek} />
        <StatCard label="Total Comments" value={stats.totalComments} />
        <StatCard label="Comments This Week" value={stats.commentsThisWeek} />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Deleted Posts"
          value={stats.deletedPosts}
          variant="warning"
        />
        <StatCard
          label="Deleted Comments"
          value={stats.deletedComments}
          variant="warning"
        />
        <div className="md:col-span-2 card p-4 flex items-center justify-center">
          <p className="text-charcoal-400 text-sm">
            Deletion rate:{' '}
            {stats.totalPosts > 0
              ? ((stats.deletedPosts / (stats.totalPosts + stats.deletedPosts)) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Posts Management */}
      <div className="card">
        <div className="border-b border-parchment-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif">Posts</h2>
          <div className="flex gap-2">
            <FilterButton
              active={filter === 'active'}
              onClick={() => setFilter('active')}
            >
              Active
            </FilterButton>
            <FilterButton
              active={filter === 'deleted'}
              onClick={() => setFilter('deleted')}
            >
              Deleted
            </FilterButton>
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
          </div>
        </div>

        <div className="divide-y divide-parchment-200">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`p-4 flex items-center gap-4 ${
                  post.isDeleted ? 'opacity-50 bg-red-50' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 relative flex-shrink-0 bg-charcoal-100 rounded-organic overflow-hidden">
                  {post.thumbnailUrl && (
                    <Image
                      src={post.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{post.displayName}</span>
                    {post.isDeleted && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        Deleted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-charcoal-400 truncate">
                    {post.caption || 'No caption'}
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {new Date(post.createdAt).toLocaleDateString()} &middot;{' '}
                    {post.commentCount || 0} comments
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {!post.isDeleted ? (
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === post.id ? 'Deleting...' : 'Delete'}
                    </button>
                  ) : (
                    <span className="text-xs text-charcoal-400">
                      {post.deletedAt &&
                        `Deleted ${new Date(post.deletedAt).toLocaleDateString()}`}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-charcoal-400">
              No posts to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: number;
  variant?: 'default' | 'warning';
}) {
  return (
    <div
      className={`card p-4 ${
        variant === 'warning' ? 'bg-red-50 border border-red-200' : ''
      }`}
    >
      <p className="text-sm text-charcoal-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-serif ${
          variant === 'warning' ? 'text-red-700' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        active
          ? 'bg-volcanic text-parchment'
          : 'bg-parchment-200 text-charcoal-600 hover:bg-parchment-300'
      }`}
    >
      {children}
    </button>
  );
}
