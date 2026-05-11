import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { venueService } from '../services/venueService';
import type { Venue } from '../types/api';
import VenueCard from '../components/venue/VenueCard';

export default function VenuesPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await (q ? venueService.search(q) : venueService.getAll());
        setVenues(res.data);
      } catch {
        setError('Failed to load venues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">
        {q ? `Results for "${q}"` : 'Top reviewed stay'}
      </h1>
      <p className="font-body text-text-secondary text-sm mb-6">
        {loading
          ? 'Loading…'
          : `${venues.length} venue${venues.length !== 1 ? 's' : ''} found`}
      </p>

      {error && (
        <div role="alert" className="alert-error mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : venues.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-text-secondary">
            No venues found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {venues.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      )}
    </div>
  );
}
