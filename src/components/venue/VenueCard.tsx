import { Link } from 'react-router-dom';
import type { Venue } from '../../types/api';

const FALLBACK =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60';

export default function VenueCard({ venue }: { venue: Venue }) {
  const img = venue.media?.[0]?.url || FALLBACK;
  const alt = venue.media?.[0]?.alt || venue.name;
  const loc =
    [venue.location?.city, venue.location?.country]
      .filter(Boolean)
      .join(', ') || 'Location not specified';

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="card overflow-hidden group flex flex-col focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`${venue.name}, ${loc}, starting from NOK ${venue.price.toLocaleString('no-NO')}`}
    >
      <div className="overflow-hidden h-40 sm:h-48 bg-border shrink-0">
        <img
          src={img}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK;
          }}
        />
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-heading font-bold text-text-primary text-sm sm:text-base truncate">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3 text-cta shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-body text-xs text-text-secondary truncate">
            {loc}
          </span>
        </div>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <span className="font-body text-xs text-text-secondary">
              Starting from{' '}
            </span>
            <span className="font-heading font-bold text-text-primary text-sm sm:text-base">
              NOK {venue.price.toLocaleString('no-NO')}
            </span>
          </div>
          {venue.rating > 0 && (
            <div
              className="flex items-center gap-0.5"
              aria-label={`${venue.rating} stars`}
            >
              <svg
                className="w-3.5 h-3.5 text-secondary"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-body text-xs font-medium text-text-primary">
                {venue.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
