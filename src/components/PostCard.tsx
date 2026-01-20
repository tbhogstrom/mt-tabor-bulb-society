import Link from 'next/link';
import Image from 'next/image';
import { ForumPost, NEIGHBORHOODS } from '@/types';

interface PostCardProps {
  post: ForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const neighborhood = NEIGHBORHOODS.find(n => n.value === post.neighborhood);
  const timeAgo = getTimeAgo(new Date(post.createdAt));

  return (
    <Link href={`/forum/${post.id}`} className="card-elevated group block">
      <div className="aspect-square relative overflow-hidden bg-charcoal-100">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.caption || 'Bulb photo'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal-300">
            <PlaceholderIcon className="w-16 h-16" />
          </div>
        )}
        {post.needsIdHelp && (
          <div className="absolute top-3 right-3">
            <span className="badge-crocus text-xs">Needs ID</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif font-medium text-charcoal line-clamp-2 mb-2">
          {post.title || post.caption || 'Untitled'}
        </h3>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-sm text-charcoal-500 truncate">{post.displayName}</span>
          {neighborhood && (
            <span className="badge-moss text-xs flex-shrink-0">{neighborhood.label}</span>
          )}
        </div>
        {post.speciesGuess && (
          <p className="text-sm italic text-moss mb-2">&ldquo;{post.speciesGuess}&rdquo;</p>
        )}
        <div className="flex items-center justify-between text-xs text-charcoal-400">
          <span>{timeAgo}</span>
          <span>{post.commentCount || 0} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
