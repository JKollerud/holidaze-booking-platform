import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { api } from '../services/api';
import { venueService } from '../services/venueService';
import type { ApiResponse, Venue } from '../types/api';
import VenueCard from '../components/venue/VenueCard';

const PAGE_LIMIT = 9;
const FETCH_ALL_LIMIT = 100;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'guests';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'guests', label: 'Most Guests' },
];

function sortVenues(venues: Venue[], sort: SortOption): Venue[] {
  const copy = [...venues];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'guests':
      return copy.sort((a, b) => b.maxGuests - a.maxGuests);
    default:
      return copy;
  }
}

async function fetchAllVenues(): Promise<Venue[]> {
  let all: Venue[] = [];
  let currentPage = 1;
  let isLastPage = false;
  while (!isLastPage) {
    const res = await api.get<ApiResponse<Venue[]>>(
      `/holidaze/venues?limit=${FETCH_ALL_LIMIT}&page=${currentPage}`,
    );
    all = [...all, ...res.data];
    isLastPage = res.meta.isLastPage ?? true;
    currentPage++;
  }
  return all;
}

function Spinner({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      role="status"
    >
      <svg
        className="w-10 h-10 animate-spin text-secondary"
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
      <p className="font-body text-sm text-text-secondary">{label}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      aria-hidden="true"
    >
      {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
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

export default function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [pagedVenues, setPagedVenues] = useState<Venue[]>([]);
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const resetAndFetch = useCallback(async (query: string) => {
    setPagedVenues([]);
    setAllVenues([]);
    setPage(1);
    setHasMore(true);
    setError('');
    setSort('default');
    setLoading(true);
    try {
      if (query) {
        const res = await venueService.search(query);
        setPagedVenues(res.data);
        setAllVenues(res.data);
        setHasMore(false);
      } else {
        const res = await api.get<ApiResponse<Venue[]>>(
          `/holidaze/venues?limit=${PAGE_LIMIT}&page=1`,
        );
        setPagedVenues(res.data);
        setHasMore(!res.meta.isLastPage);
      }
    } catch {
      setError('Failed to load venues. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    resetAndFetch(q);
  }, [q, resetAndFetch]);

  const handleClearFilters = () => {
    setSearchParams({});
    setSort('default');
    resetAndFetch('');
  };

  const handleSortChange = async (newSort: SortOption) => {
    setSort(newSort);
    if (newSort === 'default') return;
    if (allVenues.length > 0) return;
    setLoadingAll(true);
    try {
      const all = await fetchAllVenues();
      setAllVenues(all);
      setHasMore(false);
    } catch {
      setError('Failed to fetch all venues for sorting.');
    } finally {
      setLoadingAll(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get<ApiResponse<Venue[]>>(
        `/holidaze/venues?limit=${PAGE_LIMIT}&page=${nextPage}`,
      );
      setPagedVenues((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(!res.meta.isLastPage);
    } catch {
      setError('Failed to load more venues.');
    } finally {
      setLoadingMore(false);
    }
  };

  const displayVenues =
    sort !== 'default' && allVenues.length > 0 ? allVenues : pagedVenues;
  const sortedVenues = useMemo(
    () => sortVenues(displayVenues, sort),
    [displayVenues, sort],
  );
  const showLoadMore = sort === 'default' && hasMore && !q;
  const isFiltered = q !== '' || sort !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
            {q ? `Results for "${q}"` : 'Holidaze Venues'}
          </h1>
          <p className="font-body text-text-secondary text-sm mt-0.5">
            {loading
              ? 'Loading…'
              : `${sortedVenues.length} venue${sortedVenues.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 font-body text-sm text-text-secondary hover:text-error transition-colors"
            >
              <FiX className="w-4 h-4" />
              Clear filters
            </button>
          )}

          {!loading && sortedVenues.length > 0 && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="font-body text-sm text-text-secondary whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="input-field w-auto py-2 pr-8 cursor-pointer"
                disabled={loadingAll}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-6">
          {error}
        </div>
      )}

      {loadingAll ? (
        <Spinner label="Fetching all venues for sorting…" />
      ) : loading ? (
        <SkeletonGrid />
      ) : sortedVenues.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-text-secondary mb-4">No venues found.</p>
          <button
            onClick={handleClearFilters}
            className="btn-outline px-6 py-2.5 rounded-lg text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {sortedVenues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>

          {showLoadMore && (
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

          {!hasMore &&
            sortedVenues.length > PAGE_LIMIT &&
            sort === 'default' &&
            !q && (
              <p className="text-center font-body text-sm text-text-secondary mt-10">
                You've seen all {sortedVenues.length} venues!
              </p>
            )}
        </>
      )}
    </div>
  );
}
