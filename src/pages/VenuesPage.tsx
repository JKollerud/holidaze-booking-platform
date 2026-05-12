import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { venueService } from '../services/venueService';
import type { ApiResponse, Venue } from '../types/api';
import VenueCard from '../components/venue/VenueCard';

const LIMIT = 9;

export default function VenuesPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [venues, setVenues] = useState<Venue[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setVenues([]);
    setPage(1);
    setHasMore(true);
    setError('');
    setLoading(true);

    const fetchVenues = async () => {
      try {
        if (q) {
          const res = await venueService.search(q);
          setVenues(res.data);
          setHasMore(false);
        } else {
          const res = await api.get<ApiResponse<Venue[]>>(
            `/holidaze/venues?limit=${LIMIT}&page=1`,
          );
          setVenues(res.data);
          setHasMore(!res.meta.isLastPage);
        }
      } catch {
        setError('Failed to load venues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [q]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get<ApiResponse<Venue[]>>(
        `/holidaze/venues?limit=${LIMIT}&page=${nextPage}`,
      );
      setVenues((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(!res.meta.isLastPage);
    } catch {
      setError('Failed to load more venues.');
    } finally {
      setLoadingMore(false);
    }
  };

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
        <SkeletonGrid />
      ) : venues.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-text-secondary">
            No venues found. Try a different search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-outline px-8 py-3 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Loading…
                  </span>
                ) : (
                  'Load more venues'
                )}
              </button>
            </div>
          )}

          {!hasMore && venues.length > LIMIT && (
            <p className="text-center font-body text-sm text-text-secondary mt-10">
              You've seen all {venues.length} venues!
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      aria-hidden="true"
    >
      {Array.from({ length: LIMIT }).map((_, i) => (
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
