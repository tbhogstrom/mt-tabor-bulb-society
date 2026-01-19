'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Comment } from '@/types';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Check honeypot
    if (formData.get('website')) {
      setError('Submission failed');
      setIsSubmitting(false);
      return;
    }

    const displayName = formData.get('displayName') as string;
    const content = formData.get('content') as string;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          content,
          parentCommentId: replyTo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
      setReplyTo(null);

      // Reset form
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Organize comments into threads
  const topLevelComments = comments.filter(c => !c.parentCommentId);
  const getReplies = (commentId: string) =>
    comments.filter(c => c.parentCommentId === commentId);

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="card p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-organic text-sm mb-4">
            {error}
          </div>
        )}

        {replyTo && (
          <div className="bg-moss-50 border border-moss-200 text-moss-700 px-4 py-2 rounded-organic text-sm mb-4 flex items-center justify-between">
            <span>Replying to a comment</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-moss-600 hover:text-moss-800"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="commentName" className="label">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="commentName"
              name="displayName"
              className="input"
              placeholder="Your name"
              maxLength={50}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="commentContent" className="label">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="commentContent"
              name="content"
              className="input resize-none"
              rows={2}
              placeholder="Share your thoughts..."
              maxLength={1000}
              required
            />
          </div>
        </div>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary text-sm py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              onReply={setReplyTo}
            />
          ))}
        </div>
      ) : (
        <p className="text-charcoal-400 text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}

function CommentThread({
  comment,
  replies,
  onReply,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <CommentItem comment={comment} onReply={() => onReply(comment.id)} />
      {replies.length > 0 && (
        <div className="ml-8 border-l-2 border-parchment-300 pl-4 space-y-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onReply?: () => void;
  isReply?: boolean;
}) {
  const timeAgo = getTimeAgo(new Date(comment.createdAt));

  return (
    <div className={`card p-4 ${isReply ? 'bg-parchment-50' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-medium text-charcoal">{comment.displayName}</span>
        <span className="text-xs text-charcoal-400">{timeAgo}</span>
      </div>
      <p className="text-charcoal-600 whitespace-pre-wrap">{comment.content}</p>
      {onReply && !isReply && (
        <button
          onClick={onReply}
          className="text-sm text-moss hover:text-moss-600 mt-2"
        >
          Reply
        </button>
      )}
    </div>
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
