import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPost, getComments } from '@/lib/data';
import { NEIGHBORHOODS } from '@/types';
import { CommentSection } from '@/components/CommentSection';
import { MarkdownBody } from '@/components/MarkdownBody';

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const isFrostWarning = post.postType === 'frost-warning';
  const defaultTitle = isFrostWarning
    ? `Frost Warning from ${post.displayName}`
    : `${post.displayName}'s Bloom`;

  return {
    title: `${post.title || defaultTitle} | Mt Tabor Bulb Society`,
    description: post.body || post.caption || (isFrostWarning
      ? `Frost warning: ${post.temperature}°F reported by ${post.displayName}`
      : 'A photo shared on the Mt Tabor Bulb Society forum.'),
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
  const isFrostWarning = post.postType === 'frost-warning';

  return (
    <>
      {/* Back Link */}
      <div className={`py-3 border-b ${isFrostWarning ? 'bg-sky-50 border-sky-200' : 'bg-parchment-100 border-parchment-300'}`}>
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
            {/* Image or Frost Warning Placeholder */}
            <div className={`relative aspect-square rounded-organic overflow-hidden ${
              isFrostWarning && !post.imageUrl
                ? 'bg-gradient-to-br from-sky-100 to-sky-200'
                : 'bg-charcoal-100'
            }`}>
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.caption || (isFrostWarning ? 'Frost warning photo' : 'Bulb photo')}
                  fill
                  className="object-contain"
                  priority
                />
              ) : isFrostWarning ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-sky-600">
                  <SnowflakeIcon className="w-32 h-32 mb-4" />
                  {post.temperature !== undefined && (
                    <span className="text-5xl font-bold">{post.temperature}°F</span>
                  )}
                </div>
              ) : null}
              {/* Temperature overlay for frost warnings with images */}
              {isFrostWarning && post.imageUrl && post.temperature !== undefined && (
                <div className="absolute bottom-4 left-4 bg-sky-600/90 text-white px-4 py-2 rounded-full text-2xl font-bold">
                  {post.temperature}°F
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Frost Warning Badge */}
              {isFrostWarning && (
                <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-3 py-1 rounded-full text-sm mb-4">
                  <SnowflakeIcon className="w-4 h-4" />
                  Frost Warning
                </div>
              )}

              <h1 className={`text-2xl font-serif mb-3 ${isFrostWarning ? 'text-sky-900' : ''}`}>
                {post.title || post.caption || 'Untitled'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-charcoal-600">by {post.displayName}</span>
                {neighborhood && (
                  <span className={isFrostWarning ? 'bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full text-sm' : 'badge-moss'}>
                    {neighborhood.label}
                  </span>
                )}
                {post.needsIdHelp && !isFrostWarning && (
                  <span className="badge-crocus">Needs ID</span>
                )}
              </div>

              <p className="text-sm text-charcoal-400 mb-6">
                {formatDate(post.createdAt)}
              </p>

              {/* Temperature display for frost warnings */}
              {isFrostWarning && post.temperature !== undefined && (
                <div className="bg-sky-50 border border-sky-200 rounded-organic p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <ThermometerIcon className="w-8 h-8 text-sky-600" />
                    <div>
                      <p className="text-sm text-sky-600 font-medium">Reported Temperature</p>
                      <p className="text-3xl font-bold text-sky-800">{post.temperature}°F</p>
                    </div>
                  </div>
                </div>
              )}

              {post.body && (
                <div className="prose prose-charcoal max-w-none mb-6">
                  <MarkdownBody content={post.body} />
                </div>
              )}

              {post.caption && !post.body && (
                <p className="text-charcoal-600 mb-6 text-lg">{post.caption}</p>
              )}

              {post.speciesGuess && !isFrostWarning && (
                <div className="bg-moss-50 border border-moss-200 rounded-organic p-4 mb-6">
                  <p className="text-sm text-moss-700">
                    <span className="font-medium">Species guess:</span>{' '}
                    <span className="italic">{post.speciesGuess}</span>
                  </p>
                </div>
              )}

              {post.needsIdHelp && !isFrostWarning && (
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

function SnowflakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M12 2l3 3M12 2L9 5M12 22l3-3M12 22l-3-3M2 12h20M2 12l3 3M2 12l3-3M22 12l-3 3M22 12l-3-3M5.6 5.6l12.8 12.8M5.6 5.6l.7 3.7m-.7-3.7l3.7.7M18.4 18.4l-.7-3.7m.7 3.7l-3.7-.7M18.4 5.6L5.6 18.4M18.4 5.6l-3.7.7m3.7-.7l-.7 3.7M5.6 18.4l3.7-.7m-3.7.7l.7-3.7" />
    </svg>
  );
}

function ThermometerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9V3m0 6a3 3 0 100 6 3 3 0 000-6zm0 6v6m-4-6a4 4 0 118 0 4 4 0 01-8 0z" />
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
