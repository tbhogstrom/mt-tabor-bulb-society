import Link from 'next/link';
import { getPosts } from '@/lib/data';
import { PostCard } from '@/components/PostCard';

export default async function HomePage() {
  const recentPosts = await getPosts({ limit: 6 });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-volcanic text-parchment overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-moss to-crocus"></div>
        </div>
        <div className="container-wide py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-balance">
              Growing Community
              <span className="block text-daffodil">Community Grows</span>
            </h1>
            <p className="text-xl text-parchment-300 mb-8 max-w-2xl">
              Welcome to the Mt Tabor Bulb Society — where neighbors share their love
              of bulb gardening, exchange blooms, and cultivate community together.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/forum?action=new" className="btn bg-daffodil text-volcanic hover:bg-daffodil-400">
                Share Your Blooms
              </Link>
              <Link href="/about" className="btn border-2 border-parchment-400 text-parchment hover:bg-parchment hover:text-volcanic">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="section bg-parchment-100">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
            Our Three Pillars
          </h2>
          <p className="text-center text-charcoal-400 mb-12 max-w-2xl mx-auto">
            The Mt Tabor Bulb Society is built on three foundational principles that
            guide everything we do.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <PillarCard
              icon={<CommunityIcon />}
              title="Community"
              description="Fostering bulb exchanges between neighbors, building connections through shared passion for gardening."
              color="daffodil"
            />
            <PillarCard
              icon={<ConservationIcon />}
              title="Conservation"
              description="Supporting native and heirloom bulb species, preserving botanical heritage for future generations."
              color="moss"
            />
            <PillarCard
              icon={<EducationIcon />}
              title="Education"
              description="Experimental test plots and knowledge sharing through talks, walks, and community resources."
              color="crocus"
            />
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="section">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif mb-2">From the Garden Fence</h2>
              <p className="text-charcoal-400">See what&apos;s blooming in the community</p>
            </div>
            <Link href="/forum" className="btn-outline hidden sm:inline-flex">
              View All Posts
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-organic">
              <p className="text-charcoal-400 mb-4">No posts yet. Be the first to share!</p>
              <Link href="/forum?action=new" className="btn-primary">
                Share Your Blooms
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/forum" className="btn-outline">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="section bg-moss text-parchment">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Join Us at an Event
              </h2>
              <p className="text-parchment-300 mb-6">
                From guided bulb walks through Mt Tabor Park to master gardener talks,
                there&apos;s always something growing in our community calendar.
              </p>
              <Link href="/events" className="btn bg-parchment text-moss hover:bg-parchment-300">
                See All Events
              </Link>
            </div>
            <div className="bg-moss-600 rounded-organic p-6">
              <h3 className="font-serif text-xl mb-4">Coming Up</h3>
              <div className="space-y-4">
                <EventPreview
                  title="Spring Bulb Walk"
                  date="March 15, 2026"
                  type="walk"
                />
                <EventPreview
                  title="Heirloom Bulbs Talk"
                  date="March 22, 2026"
                  type="talk"
                />
                <EventPreview
                  title="Annual Bulb Sale"
                  date="April 5, 2026"
                  type="sale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Ready to Dig In?
          </h2>
          <p className="text-charcoal-400 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a seasoned gardener or just planting your first bulb,
            there&apos;s a place for you in our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-primary">
              Get Involved
            </Link>
            <Link href="/forum?action=new" className="btn-secondary">
              Share a Photo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PillarCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'daffodil' | 'moss' | 'crocus';
}) {
  const colorClasses = {
    daffodil: 'bg-daffodil-100 text-daffodil-700',
    moss: 'bg-moss-100 text-moss-700',
    crocus: 'bg-crocus-100 text-crocus-700',
  };

  return (
    <div className="card p-8 text-center">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-serif mb-3">{title}</h3>
      <p className="text-charcoal-400">{description}</p>
    </div>
  );
}

function EventPreview({
  title,
  date,
  type,
}: {
  title: string;
  date: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-moss-700 rounded-organic">
      <div className="w-10 h-10 bg-daffodil rounded-full flex items-center justify-center text-volcanic text-sm font-semibold">
        {type === 'walk' && 'W'}
        {type === 'talk' && 'T'}
        {type === 'sale' && 'S'}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-parchment-400">{date}</div>
      </div>
    </div>
  );
}

function CommunityIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function ConservationIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.62 13.38 2.5 12 2.5S9.5 3.62 9.5 5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z" />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}
