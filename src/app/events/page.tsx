import { Metadata } from 'next';
import { Event } from '@/types';

export const metadata: Metadata = {
  title: 'Events | Mt Tabor Bulb Society',
  description: 'Join us for bulb walks, master gardener talks, and community events in the Mt Tabor neighborhood.',
};

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Spring Bulb Walk',
    description: 'Join us for a guided walk through Mt Tabor Park to discover early spring bulbs in bloom. We\'ll identify species, discuss growing conditions, and share stories about the park\'s botanical history.',
    date: '2026-03-15',
    time: '10:00 AM',
    location: 'Mt Tabor Park - Main Entrance',
    type: 'walk',
  },
  {
    id: '2',
    title: 'Heirloom Bulbs: Preserving Our Botanical Heritage',
    description: 'Master Gardener presentation on identifying, propagating, and preserving heirloom bulb varieties. Learn about bulbs that have grown in Portland gardens for over a century.',
    date: '2026-03-22',
    time: '2:00 PM',
    location: 'Montavilla Community Center',
    type: 'talk',
  },
  {
    id: '3',
    title: 'Annual Spring Bulb Sale',
    description: 'Our biggest event of the year! Browse tables of locally-grown bulbs from society members, get expert advice, and find rare varieties you won\'t see anywhere else.',
    date: '2026-04-05',
    time: '9:00 AM - 3:00 PM',
    location: 'Montavilla Farmers Market',
    type: 'sale',
  },
  {
    id: '4',
    title: 'Native Bulbs of the Pacific Northwest',
    description: 'Explore the native bulb species that once blanketed our region. Learn about camas, trillium, and other indigenous plants and how to incorporate them into your garden.',
    date: '2026-04-19',
    time: '2:00 PM',
    location: 'Mt Tabor Presbyterian Church',
    type: 'talk',
  },
];

const pastEvents: Event[] = [
  {
    id: 'p1',
    title: 'Inaugural Meeting',
    description: 'The founding meeting of the Mt Tabor Bulb Society where we established our mission, goals, and elected our first board.',
    date: '2025-10-15',
    time: '6:00 PM',
    location: 'Private Residence',
    type: 'meeting',
  },
];

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-volcanic text-parchment py-16 md:py-24">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Events
          </h1>
          <p className="text-xl text-parchment-300 max-w-2xl mx-auto">
            From guided walks to expert talks, there&apos;s always something growing in our calendar
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section">
        <div className="container-wide">
          <h2 className="text-3xl font-serif mb-8">Upcoming Events</h2>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Embed Placeholder */}
      <section className="section bg-parchment-100">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-serif mb-6">Add to Your Calendar</h2>
          <p className="text-charcoal-500 mb-8">
            Never miss an event — subscribe to our community calendar
          </p>
          <div className="card p-12 bg-white">
            <p className="text-charcoal-400 italic">
              Google Calendar integration coming soon
            </p>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="section">
        <div className="container-wide">
          <h2 className="text-3xl font-serif mb-8">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="card p-6 opacity-75">
                <div className="flex flex-wrap items-start gap-4">
                  <EventTypeBadge type={event.type} />
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg mb-1">{event.title}</h3>
                    <p className="text-sm text-charcoal-400">
                      {formatDate(event.date)} at {event.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host an Event */}
      <section className="section bg-moss text-parchment">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-serif mb-4">Want to Host an Event?</h2>
          <p className="text-parchment-300 mb-8 max-w-xl mx-auto">
            Have expertise to share or a garden to show off? We&apos;re always looking
            for community members to lead walks, give talks, or host gatherings.
          </p>
          <a
            href="mailto:events@mttaborbulbs.org"
            className="btn bg-parchment text-moss hover:bg-parchment-300"
          >
            Contact Us About Hosting
          </a>
        </div>
      </section>
    </>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Date Block */}
        <div className="flex-shrink-0 text-center md:w-24">
          <div className="inline-block md:block bg-volcanic text-parchment rounded-organic p-4 md:p-3">
            <div className="text-sm uppercase tracking-wide">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-3xl font-serif font-bold">
              {new Date(event.date).getDate()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <EventTypeBadge type={event.type} />
            <h3 className="font-serif text-xl md:text-2xl">{event.title}</h3>
          </div>
          <p className="text-charcoal-600 mb-4">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-charcoal-500">
            <span className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              {event.time}
            </span>
            <span className="flex items-center gap-2">
              <LocationIcon className="w-4 h-4" />
              {event.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventTypeBadge({ type }: { type: Event['type'] }) {
  const styles: Record<Event['type'], string> = {
    walk: 'badge-moss',
    talk: 'badge-crocus',
    sale: 'badge-daffodil',
    meeting: 'bg-charcoal-100 text-charcoal-700',
    other: 'bg-charcoal-100 text-charcoal-700',
  };

  const labels: Record<Event['type'], string> = {
    walk: 'Bulb Walk',
    talk: 'Talk',
    sale: 'Sale',
    meeting: 'Meeting',
    other: 'Event',
  };

  return <span className={`badge ${styles[type]}`}>{labels[type]}</span>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
