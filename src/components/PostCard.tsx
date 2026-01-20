import Link from 'next/link';
import Image from 'next/image';
import { ForumPost, NEIGHBORHOODS } from '@/types';

interface PostCardProps {
  post: ForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const neighborhood = NEIGHBORHOODS.find(n => n.value === post.neighborhood);
  const timeAgo = getTimeAgo(new Date(post.createdAt));
  const isFrostWarning = post.postType === 'frost-warning';

  return (
    <Link href={`/forum/${post.id}`} className={`card-elevated group block ${isFrostWarning ? 'ring-2 ring-sky-400' : ''}`}>
      <div className={`aspect-square relative overflow-hidden ${isFrostWarning ? 'bg-gradient-to-br from-sky-100 to-sky-200' : 'bg-charcoal-100'}`}>
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.caption || (isFrostWarning ? 'Frost warning photo' : 'Bulb photo')}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : isFrostWarning ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-sky-600">
            <SnowflakeIcon className="w-20 h-20 mb-2" />
            {post.temperature !== undefined && (
              <span className="text-3xl font-bold">{post.temperature}°F</span>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal-300">
            <PlaceholderIcon className="w-16 h-16" />
          </div>
        )}
        {/* Badge area */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isFrostWarning && (
            <span className="bg-sky-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <SnowflakeIcon className="w-3 h-3" />
              Frost
            </span>
          )}
          {post.needsIdHelp && !isFrostWarning && (
            <span className="badge-crocus text-xs">Needs ID</span>
          )}
        </div>
        {/* Temperature overlay for cards with images */}
        {isFrostWarning && post.thumbnailUrl && post.temperature !== undefined && (
          <div className="absolute bottom-3 left-3 bg-sky-600/90 text-white px-3 py-1 rounded-full text-lg font-bold">
            {post.temperature}°F
          </div>
        )}
      </div>
      <div className={`p-4 ${isFrostWarning ? 'bg-sky-50' : ''}`}>
        <h3 className={`font-serif font-medium line-clamp-2 mb-2 ${isFrostWarning ? 'text-sky-900' : 'text-charcoal'}`}>
          {post.title || post.caption || 'Untitled'}
        </h3>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-sm text-charcoal-500 truncate">{post.displayName}</span>
          {neighborhood && (
            <span className={`text-xs flex-shrink-0 ${isFrostWarning ? 'bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full' : 'badge-moss'}`}>
              {neighborhood.label}
            </span>
          )}
        </div>
        {post.speciesGuess && !isFrostWarning && (
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

function SnowflakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M12 2l3 3M12 2L9 5M12 22l3-3M12 22l-3-3M2 12h20M2 12l3 3M2 12l3-3M22 12l-3 3M22 12l-3-3M5.6 5.6l12.8 12.8M5.6 5.6l.7 3.7m-.7-3.7l3.7.7M18.4 18.4l-.7-3.7m.7 3.7l-3.7-.7M18.4 5.6L5.6 18.4M18.4 5.6l-3.7.7m3.7-.7l-.7 3.7M5.6 18.4l3.7-.7m-3.7.7l.7-3.7" />
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
