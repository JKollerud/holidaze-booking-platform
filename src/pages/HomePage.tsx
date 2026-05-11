import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { venueService } from '../services/venueService';
import type { Venue } from '../types/api';
import VenueCard from '../components/venue/VenueCard';
import { ROUTES } from '../constants/routes';
import {
  FiCheckCircle,
  FiThumbsUp,
  FiGlobe,
  FiHeadphones,
} from 'react-icons/fi';

const FEATURES = [
  {
    icon: <FiCheckCircle className="text-secondary text-3xl" />,
    title: 'Free cancellation',
    desc: 'Up to 3 days before',
  },
  {
    icon: <FiThumbsUp className="text-secondary text-3xl" />,
    title: '10M+ reviews from guests',
    desc: 'Get info from other guests',
  },
  {
    icon: <FiGlobe className="text-secondary text-3xl" />,
    title: '50k properties worldwide',
    desc: 'Hotels, guest houses, apartments etc.',
  },
  {
    icon: <FiHeadphones className="text-secondary text-3xl" />,
    title: 'Trusted 24/7 customer service',
    desc: "We're always here to help",
  },
];

export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    venueService
      .getAll()
      .then((r) =>
        setVenues([...r.data].sort((a, b) => b.rating - a.rating).slice(0, 3)),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section
        aria-label="Hero"
        className="relative h-52 sm:h-80 overflow-hidden flex items-end justify-center pb-6"
      >
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/20 to-black/55"
          aria-hidden="true"
        />
        <div className="relative text-center text-white px-4">
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold drop-shadow mb-1">
            Find your next stay at Holidaze
          </h1>
          <p className="font-body text-white/80 text-xs sm:text-base">
            Search for hotels, homes and much more
          </p>
        </div>
      </section>
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="section-title mb-6">
          Why guests choose Holidaze
        </h2>
        <ul className="flex flex-col gap-3 sm:hidden">
          {FEATURES.map((f) => (
            <li key={f.title} className="card p-4 flex items-center gap-4">
              <span className="text-3xl shrink-0" aria-hidden="true">
                {f.icon}
              </span>
              <div>
                <p className="font-heading font-bold text-text-primary text-sm">
                  {f.title}
                </p>
                <p className="font-body text-text-secondary text-xs mt-0.5">
                  {f.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 flex flex-col gap-3">
              <span className="text-3xl" aria-hidden="true">
                {f.icon}
              </span>
              <p className="font-heading font-bold text-text-primary text-sm sm:text-base">
                {f.title}
              </p>
              <p className="font-body text-text-secondary text-xs sm:text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        aria-labelledby="favorites-heading"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="favorites-heading" className="section-title">
            Our guests favorites
          </h2>
          <Link
            to={ROUTES.venues}
            className="font-body text-secondary text-sm hover:underline"
          >
            Discover more
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="bg-border h-40 sm:h-48" />
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-3 bg-border rounded w-2/3" />
            <div className="h-3 bg-border rounded w-1/2" />
            <div className="h-3 bg-border rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
