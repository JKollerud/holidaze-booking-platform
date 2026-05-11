import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { venueService } from '../services/venueService';
import { bookingService } from '../services/bookingService';
import { getStoredUser } from '../services/authService';
import type { Venue } from '../types/api';
import { FiWifi } from 'react-icons/fi';
import { BsCupHot } from 'react-icons/bs';
import { MdLocalParking, MdPets } from 'react-icons/md';

const FALLBACK =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60';

const AMENITIES: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi: { label: 'WiFi', icon: <FiWifi /> },
  parking: { label: 'Parking', icon: <MdLocalParking /> },
  breakfast: { label: 'Breakfast', icon: <BsCupHot /> },
  pets: { label: 'Pets allowed', icon: <MdPets /> },
};

function AvailabilityCalendar({
  bookedRanges,
}: {
  bookedRanges: { from: Date; to: Date }[];
}) {
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const monthName = month.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = (month.getDay() + 6) % 7; // Mon=0

  const isBooked = (day: number) => {
    const d = new Date(month.getFullYear(), month.getMonth(), day);
    return bookedRanges.some((r) => d >= r.from && d <= r.to);
  };
  const isPast = (day: number) => {
    const d = new Date(month.getFullYear(), month.getMonth(), day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOffset((o) => o - 1)}
          disabled={offset === 0}
          aria-label="Previous month"
          className="p-1 rounded hover:bg-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="font-heading font-semibold text-sm text-text-primary">
          {monthName}
        </span>
        <button
          onClick={() => setOffset((o) => o + 1)}
          aria-label="Next month"
          className="p-1 rounded hover:bg-bg transition-colors"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <div key={d} className="font-body text-xs text-text-secondary pb-1">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const booked = isBooked(day);
          const past = isPast(day);
          return (
            <div
              key={day}
              className={`font-body text-xs rounded py-1 ${
                past
                  ? 'text-text-secondary/40'
                  : booked
                    ? 'bg-error/15 text-error font-medium'
                    : 'bg-success/10 text-success font-medium'
              }`}
              aria-label={`${day} ${monthName} ${booked ? '(booked)' : past ? '(past)' : '(available)'}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs font-body">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-success/20 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-error/15 inline-block" />
          Booked
        </span>
      </div>
    </div>
  );
}

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = getStoredUser();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    venueService
      .getById(id, { _owner: true, _bookings: true })
      .then((r) => setVenue(r.data))
      .catch(() => setError('Venue not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const bookedRanges = useMemo(
    () =>
      (venue?.bookings ?? []).map((b) => ({
        from: new Date(b.dateFrom),
        to: new Date(b.dateTo),
      })),
    [venue],
  );

  const handleBook = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user) {
      setBookError('You must be logged in to book.');
      return;
    }
    if (!dateFrom || !dateTo) {
      setBookError('Please select check-in and check-out dates.');
      return;
    }
    if (new Date(dateTo) <= new Date(dateFrom)) {
      setBookError('Check-out must be after check-in.');
      return;
    }
    setBookError('');
    setBookLoading(true);
    try {
      await bookingService.create({
        venueId: id!,
        dateFrom: new Date(dateFrom).toISOString(),
        dateTo: new Date(dateTo).toISOString(),
        guests,
      });
      setBookSuccess(true);
    } catch (err) {
      setBookError(err instanceof Error ? err.message : 'Booking failed.');
    } finally {
      setBookLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-8 animate-pulse"
        aria-hidden="true"
      >
        <div className="rounded-2xl bg-border h-64 mb-6" />
        <div className="card p-6 space-y-3">
          <div className="h-6 bg-border rounded w-1/2" />
          <div className="h-4 bg-border rounded w-full" />
          <div className="h-4 bg-border rounded w-5/6" />
        </div>
      </div>
    );

  if (error || !venue)
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-text-secondary">
          {error || 'Venue not found.'}
        </p>
      </div>
    );

  const images = venue.media?.length
    ? venue.media
    : [{ url: FALLBACK, alt: venue.name }];
  const loc = [
    venue.location?.address,
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(', ');
  const amenities = Object.entries(venue.meta ?? {}).filter(([, v]) => v);

  const BookingCard = (
    <div className="card p-5">
      <h2 className="font-heading font-semibold text-text-primary mb-1">
        Check availability:
      </h2>
      <p className="font-body text-sm text-text-secondary mb-4">
        {venue.price.toLocaleString('no-NO')} NOK / night
      </p>

      {bookSuccess ? (
        <div role="status" className="alert-success text-center">
          🎉 Booking confirmed! Check your dashboard.
        </div>
      ) : (
        <form onSubmit={handleBook} className="space-y-3" noValidate>
          <div>
            <label htmlFor="date-from" className="sr-only">
              Check-in date
            </label>
            <div className="flex items-center bg-bg border border-border rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-secondary transition">
              <svg
                className="w-4 h-4 text-text-secondary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="Check-in date"
                min={new Date().toISOString().split('T')[0]}
                className="py-2.5 flex-1 outline-none font-body text-sm bg-transparent text-text-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="date-to" className="sr-only">
              Check-out date
            </label>
            <div className="flex items-center bg-bg border border-border rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-secondary transition">
              <svg
                className="w-4 h-4 text-text-secondary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="Check-out date"
                min={dateFrom || new Date().toISOString().split('T')[0]}
                className="py-2.5 flex-1 outline-none font-body text-sm bg-transparent text-text-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="book-guests" className="sr-only">
              Number of guests
            </label>
            <div className="flex items-center bg-bg border border-border rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-secondary transition">
              <svg
                className="w-4 h-4 text-text-secondary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                id="book-guests"
                type="number"
                min={1}
                max={venue.maxGuests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                aria-label="Number of guests"
                className="py-2.5 flex-1 outline-none font-body text-sm bg-transparent text-text-primary"
              />
            </div>
          </div>

          {!dateFrom && (
            <p className="font-body text-xs text-text-secondary">
              Select date and number of guests
            </p>
          )}
          {bookError && (
            <p role="alert" className="font-body text-xs text-error">
              {bookError}
            </p>
          )}

          <button
            type="submit"
            disabled={bookLoading}
            className="btn-cta w-full py-3 text-base"
          >
            {bookLoading ? 'Booking…' : 'Book now'}
          </button>
        </form>
      )}

      <div className="mt-5 pt-5 border-t border-border">
        <h3 className="font-heading font-semibold text-text-primary text-sm mb-2">
          Availability
        </h3>
        <AvailabilityCalendar bookedRanges={bookedRanges} />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        className="relative rounded-2xl overflow-hidden bg-border mb-5 h-56 sm:h-96"
        aria-label="Venue photos"
      >
        <img
          src={images[imgIdx]?.url || FALLBACK}
          alt={images[imgIdx]?.alt || venue.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setImgIdx((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary/80 text-white text-xl flex items-center justify-center hover:bg-primary transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setImgIdx((i) => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary/80 text-white text-xl flex items-center justify-center hover:bg-primary transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="card p-5 sm:p-8">
        <div className="block lg:hidden mb-6">{BookingCard}</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-heading text-xl sm:text-3xl font-extrabold text-text-primary">
                  {venue.name}
                </h1>
                {venue.rating > 0 && (
                  <div
                    className="flex items-center gap-1 shrink-0"
                    aria-label={`${venue.rating} star rating`}
                  >
                    <svg
                      className="w-5 h-5 text-secondary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-heading font-bold text-text-primary text-lg">
                      {venue.rating}
                    </span>
                  </div>
                )}
              </div>
              {loc && (
                <div className="flex items-center gap-1 mt-1">
                  <svg
                    className="w-4 h-4 text-cta shrink-0"
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
                  <span className="font-body text-sm text-text-secondary">
                    {loc}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-heading font-bold text-text-primary text-base mb-2">
                Description:
              </h2>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {venue.description}
              </p>
            </div>

            {amenities.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-text-primary text-base mb-3">
                  Facilities:
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {amenities.map(
                    ([key]) =>
                      AMENITIES[key] && (
                        <li
                          key={key}
                          className="flex items-center gap-2 bg-bg border border-border rounded-full px-3 py-1.5"
                        >
                          <span className="text-secondary" aria-hidden="true">
                            {AMENITIES[key].icon}
                          </span>
                          <span className="font-body text-xs text-text-primary">
                            {AMENITIES[key].label}
                          </span>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            )}

            <p className="font-body text-xs text-text-secondary">
              Max guests:{' '}
              <span className="font-semibold text-text-primary">
                {venue.maxGuests}
              </span>
            </p>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">{BookingCard}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
