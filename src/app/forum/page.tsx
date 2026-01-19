import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/data';
import { PostCard } from '@/components/PostCard';
import { NEIGHBORHOODS, Neighborhood } from '@/types';
import { NewPostForm } from '@/components/NewPostForm';

export const metadata: Metadata = {
  title: 'The Garden Fence | Mt Tabor Bulb Society',
  description: 'Share your bulb photos and connect with neighbors on the Mt Tabor Bulb Society community forum.',
};

interface ForumPageProps {
  searchParams: Promise<{
    filter?: string;
    action?: string;
  }>;
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const params = await searchParams;
  const filter = params.filter as 'recent' | 'needs-id' | Neighborhood | undefined;
  const showNewPostForm = params.action === 'new';

  const posts = await getPosts({
    filter: filter || 'recent',
    limit: 50,
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-volcanic text-parchment py-12 md:py-16">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                The Garden Fence
              </h1>
              <p className="text-parchment-300">
                Share what&apos;s blooming and connect with fellow gardeners
              </p>
            </div>
            <Link
              href="/forum?action=new"
              className="btn bg-daffodil text-volcanic hover:bg-daffodil-400 self-start"
            >
              Share Your Blooms
            </Link>
          </div>
        </div>
      </section>

      {/* New Post Form Modal */}
      {showNewPostForm && (
        <Suspense fallback={<div>Loading...</div>}>
          <NewPostForm />
        </Suspense>
      )}

      {/* Filters */}
      <section className="bg-parchment-100 py-4 border-b border-parchment-300">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-charcoal-500 mr-2">Filter:</span>
            <FilterLink href="/forum" active={!filter || filter === 'recent'}>
              Most Recent
            </FilterLink>
            <FilterLink href="/forum?filter=needs-id" active={filter === 'needs-id'}>
              Needs ID
            </FilterLink>
            <span className="text-charcoal-300 mx-2">|</span>
            {NEIGHBORHOODS.map((n) => (
              <FilterLink
                key={n.value}
                href={`/forum?filter=${n.value}`}
                active={filter === n.value}
              >
                {n.label}
              </FilterLink>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section">
        <div className="container-wide">
          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-charcoal-400 mb-4">
                {filter && filter !== 'recent'
                  ? 'No posts match this filter yet.'
                  : 'No posts yet. Be the first to share!'}
              </p>
              <Link href="/forum?action=new" className="btn-primary">
                Share Your Blooms
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="bg-parchment-100 py-8">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-xl mb-3">Community Guidelines</h2>
          <p className="text-sm text-charcoal-500 max-w-2xl mx-auto">
            This is a friendly neighborhood space. Share photos of bulbs and flowers,
            ask for identification help, and be kind to your fellow gardeners.
            Off-topic posts or spam will be removed by our volunteer moderators.
          </p>
        </div>
      </section>
    </>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        active
          ? 'bg-volcanic text-parchment'
          : 'bg-white text-charcoal-600 hover:bg-volcanic-100'
      }`}
    >
      {children}
    </Link>
  );
}
