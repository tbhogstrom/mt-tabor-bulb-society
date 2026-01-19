import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get Involved | Mt Tabor Bulb Society',
  description: 'Join the Mt Tabor Bulb Society! Share photos, attend events, exchange bulbs, and help our community grow.',
};

export default function GetInvolvedPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-volcanic text-parchment py-16 md:py-24">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Get Involved
          </h1>
          <p className="text-xl text-parchment-300 max-w-2xl mx-auto">
            There are many ways to join our growing community — find what works for you
          </p>
        </div>
      </section>

      {/* Ways to Participate */}
      <section className="section">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Share Photos */}
            <div className="card p-8">
              <div className="w-16 h-16 rounded-full bg-daffodil-100 flex items-center justify-center mb-6">
                <CameraIcon className="w-8 h-8 text-daffodil-700" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Share Your Blooms</h2>
              <p className="text-charcoal-600 mb-6">
                Snap a photo of what&apos;s blooming in your garden and share it on our
                community forum. No account needed — just upload and connect with
                fellow gardeners.
              </p>
              <Link href="/forum?action=new" className="btn-primary">
                Post a Photo
              </Link>
            </div>

            {/* Attend Events */}
            <div className="card p-8">
              <div className="w-16 h-16 rounded-full bg-moss-100 flex items-center justify-center mb-6">
                <CalendarIcon className="w-8 h-8 text-moss-700" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Attend Events</h2>
              <p className="text-charcoal-600 mb-6">
                Join us for bulb walks through Mt Tabor Park, master gardener talks,
                and our annual bulb sale. It&apos;s the best way to meet fellow enthusiasts
                and learn something new.
              </p>
              <Link href="/events" className="btn-secondary">
                View Events
              </Link>
            </div>

            {/* Exchange Bulbs */}
            <div className="card p-8">
              <div className="w-16 h-16 rounded-full bg-crocus-100 flex items-center justify-center mb-6">
                <ExchangeIcon className="w-8 h-8 text-crocus-700" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Exchange Bulbs</h2>
              <p className="text-charcoal-600 mb-6">
                Have bulbs to share or looking for something special? Our community
                exchange helps gardeners trade and gift bulbs across the neighborhood.
                We&apos;re working toward 100 exchanges this year!
              </p>
              <span className="text-sm text-charcoal-400 italic">
                Exchange board coming soon
              </span>
            </div>

            {/* Volunteer */}
            <div className="card p-8">
              <div className="w-16 h-16 rounded-full bg-volcanic-100 flex items-center justify-center mb-6">
                <HandsIcon className="w-8 h-8 text-volcanic" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Volunteer</h2>
              <p className="text-charcoal-600 mb-6">
                Help with experimental test gardens, assist at events, or contribute
                to our educational resources. We have opportunities for gardeners
                of all experience levels.
              </p>
              <a
                href="mailto:volunteer@mttaborbulbs.org"
                className="btn-outline"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experimental Gardens */}
      <section className="section bg-parchment-100">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-moss mb-4">Coming Soon</span>
              <h2 className="text-3xl font-serif mb-4">Experimental Gardens</h2>
              <p className="text-charcoal-600 mb-6">
                We&apos;re establishing community test plots to trial different bulb
                varieties and growing techniques. Current proposals include:
              </p>
              <ul className="space-y-3 text-charcoal-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-moss rounded-full mt-2 flex-shrink-0"></span>
                  <span>Right-of-way gardens showcasing drought-tolerant bulbs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-moss rounded-full mt-2 flex-shrink-0"></span>
                  <span>Container gardens at Montavilla Farmers Market</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-moss rounded-full mt-2 flex-shrink-0"></span>
                  <span>Native bulb restoration projects in Mt Tabor Park</span>
                </li>
              </ul>
            </div>
            <div className="bg-moss-100 rounded-organic p-8 text-center">
              <p className="text-moss-700 font-serif text-lg">
                Interested in hosting or maintaining a test plot?
              </p>
              <a
                href="mailto:gardens@mttaborbulbs.org"
                className="btn-secondary mt-4"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="section">
        <div className="container-narrow">
          <div className="card p-8 md:p-12 text-center">
            <h2 className="text-3xl font-serif mb-4">Membership</h2>
            <p className="text-charcoal-600 mb-6 max-w-xl mx-auto">
              The Mt Tabor Bulb Society is open to everyone. While we&apos;re exploring
              formal membership structures, participation in the forum and most events
              is completely free.
            </p>
            <p className="text-charcoal-500 text-sm mb-8">
              As we work toward 501(c)(3) status, we&apos;ll share more about how you
              can support the society through membership or donations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/forum" className="btn-primary">
                Join the Conversation
              </Link>
              <Link href="/events" className="btn-outline">
                Find an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section bg-volcanic text-parchment">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-serif mb-4">Questions?</h2>
          <p className="text-parchment-300 mb-8 max-w-xl mx-auto">
            We&apos;d love to hear from you. Whether you have questions about the society,
            want to share an idea, or just want to say hello — reach out!
          </p>
          <a
            href="mailto:hello@mttaborbulbs.org"
            className="btn bg-daffodil text-volcanic hover:bg-daffodil-400"
          >
            hello@mttaborbulbs.org
          </a>
        </div>
      </section>
    </>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ExchangeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function HandsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  );
}
