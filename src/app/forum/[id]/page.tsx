import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPost, getComments } from '@/lib/data';
import { NEIGHBORHOODS } from '@/types';
import { CommentSection } from '@/components/CommentSection';
import { MarkdownBody } from '@/components/MarkdownBody';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: 'Post Not Found | Mt Tabor Bulb Society',
    };
  }

  return {
    title: `${post.title || post.displayName + "'s Bloom"} | Mt Tabor Bulb Society`,
    description: post.body || post.caption || 'A photo shared on the Mt Tabor Bulb Society forum.',
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || post.isDeleted) {
    notFound();
  }

  const comments = await getComments(id);
  const neighborhood = NEIGHBORHOODS.find(n => n.value === post.neighborhood);

  return (
    <>
      {/* Back Link */}
      <div className="bg-parchment-100 py-3 border-b border-parchment-300">
        <div className="container-wide">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-charcoal-500 hover:text-charcoal transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            Back to Forum
          </Link>
        </div>
      </div>

      {/* Post Content */}
      <section className="section">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square bg-charcoal-100 rounded-organic overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.caption || 'Bulb photo'}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-2xl font-serif mb-3">
                {post.title || post.caption || 'Untitled'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-charcoal-600">by {post.displayName}</span>
                {neighborhood && (
                  <span className="badge-moss">{neighborhood.label}</span>
                )}
                {post.needsIdHelp && (
                  <span className="badge-crocus">Needs ID</span>
                )}
              </div>

              <p className="text-sm text-charcoal-400 mb-6">
                {formatDate(post.createdAt)}
              </p>

              {post.body && (
                <div className="prose prose-charcoal max-w-none mb-6">
                  <MarkdownBody content={post.body} />
                </div>
              )}

              {post.caption && !post.body && (
                <p className="text-charcoal-600 mb-6 text-lg">{post.caption}</p>
              )}

              {post.speciesGuess && (
                <div className="bg-moss-50 border border-moss-200 rounded-organic p-4 mb-6">
                  <p className="text-sm text-moss-700">
                    <span className="font-medium">Species guess:</span>{' '}
                    <span className="italic">{post.speciesGuess}</span>
                  </p>
                </div>
              )}

              {post.needsIdHelp && (
                <div className="bg-crocus-50 border border-crocus-200 rounded-organic p-4 mb-6">
                  <p className="text-sm text-crocus-700">
                    This poster would like help identifying this plant!
                    Share your knowledge in the comments below.
                  </p>
                </div>
              )}

              {/* Comment Section */}
              <div className="border-t border-parchment-300 pt-8 mt-8">
                <h2 className="text-xl font-serif mb-6">
                  Comments ({comments.length})
                </h2>
                <CommentSection postId={id} initialComments={comments} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
