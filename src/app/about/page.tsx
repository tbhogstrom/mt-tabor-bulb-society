import { Metadata } from 'next';
import { BoardMember } from '@/types';

export const metadata: Metadata = {
  title: 'About Us | Mt Tabor Bulb Society',
  description: 'Learn about the Mt Tabor Bulb Society, our mission, and the people who make our community grow.',
};

const boardMembers: BoardMember[] = [
  {
    name: 'Sylvie Falcon',
    role: 'President',
    bio: 'Passionate about connecting neighbors through shared gardening experiences.',
  },
  {
    name: 'Kailey Falcon',
    role: 'Vice President',
    bio: 'Focuses on community outreach and the container garden initiative at Montavilla Farmers Market.',
  },
  {
    name: 'LouAnn PearTree',
    role: 'Secretary',
    bio: 'Dedicated to documenting our community\'s botanical heritage and organizing educational events.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-volcanic text-parchment py-16 md:py-24">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            About the Society
          </h1>
          <p className="text-xl text-parchment-300 max-w-2xl mx-auto">
            Growing roots in the Mt Tabor neighborhood since 2025
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container-narrow">
          <div className="card p-8 md:p-12">
            <h2 className="text-3xl font-serif mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-charcoal-600 text-center max-w-2xl mx-auto">
              The Mt Tabor Bulb Society exists to cultivate community through the shared
              joy of bulb gardening. We connect neighbors, preserve botanical heritage,
              and grow knowledge together — one bulb at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-parchment-100">
        <div className="container-narrow">
          <h2 className="text-3xl font-serif mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-charcoal-600">
            <p>
              The Mt Tabor Bulb Society was born from a simple observation: across our
              neighborhood, gardeners were quietly tending remarkable collections of bulbs —
              heirloom daffodils passed down through generations, rare fritillarias rescued
              from redevelopment sites, native camas bulbs that once carpeted this land.
            </p>
            <p>
              Yet these treasures remained hidden behind fences, unknown to neighbors just
              blocks away. We founded the Society to change that — to create a space where
              these collections and the knowledge behind them could be shared, celebrated,
              and preserved.
            </p>
            <p>
              At our inaugural meeting in 2025, we set ambitious goals: facilitate 100 bulb
              exchanges, establish a master gardener talk series, and build the foundation
              for a lasting community institution. Today, we&apos;re growing toward those goals
              with the help of neighbors like you.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Detail */}
      <section className="section">
        <div className="container-wide">
          <h2 className="text-3xl font-serif mb-12 text-center">Our Three Pillars</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-daffodil-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-xl font-serif mb-4 text-daffodil-700">Community</h3>
              <p className="text-charcoal-500">
                We foster meaningful connections through bulb exchanges, garden visits,
                and shared experiences. Our goal of 100 exchanges in our first year
                reflects our belief that every bulb shared strengthens our neighborhood bonds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-moss-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌿</span>
              </div>
              <h3 className="text-xl font-serif mb-4 text-moss-700">Conservation</h3>
              <p className="text-charcoal-500">
                We champion native and heirloom bulb species, working to preserve
                botanical diversity in our urban landscape. From native camas to
                century-old daffodil varieties, we protect our green heritage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-crocus-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-serif mb-4 text-crocus-700">Education</h3>
              <p className="text-charcoal-500">
                Through master gardener talks, experimental test plots, and community
                resources, we share knowledge across generations. Our upcoming
                &ldquo;Bulb Flowers of Mt Tabor&rdquo; identification deck will help everyone
                discover the botanical treasures around them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="section bg-parchment-100">
        <div className="container-wide">
          <h2 className="text-3xl font-serif mb-4 text-center">Board Members</h2>
          <p className="text-center text-charcoal-400 mb-12 max-w-2xl mx-auto">
            The dedicated volunteers who help our community flourish
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {boardMembers.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-moss-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif text-moss-700">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-serif text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-crocus font-medium mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-charcoal-500">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 501c3 Status */}
      <section className="section">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-serif mb-6">Nonprofit Status</h2>
          <div className="card p-8 bg-daffodil-50 border border-daffodil-200">
            <p className="text-charcoal-600 mb-4">
              The Mt Tabor Bulb Society is currently exploring 501(c)(3) designation
              to better serve our community and support our conservation mission.
            </p>
            <p className="text-sm text-charcoal-500">
              We&apos;ll share updates on our progress here and at community events.
              Thank you for your patience and support as we grow!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
