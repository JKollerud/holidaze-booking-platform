import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (destination) p.set('q', destination);
    if (guests) p.set('guests', guests);
    navigate(`${ROUTES.venues}?${p.toString()}`);
  };

  const inputRow =
    'flex items-center bg-white rounded-lg px-3 gap-2 w-full focus-within:ring-2 focus-within:ring-secondary transition';
  const inputClass =
    'py-3 flex-1 outline-none font-body text-sm text-text-primary placeholder:text-text-secondary bg-transparent';

  return (
    <div className="bg-primary/90 py-4 px-4">
      <form
        onSubmit={handleSearch}
        role="search"
        aria-label="Search venues"
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={inputRow}>
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <label htmlFor="sb-dest" className="sr-only">
              Destination
            </label>
            <input
              id="sb-dest"
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className={inputRow}>
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
            <label htmlFor="sb-dates" className="sr-only">
              Check-in and check-out dates
            </label>
            <input
              id="sb-dates"
              type="text"
              placeholder="Check-in date - Check-out date"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className={inputRow}>
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
            <label htmlFor="sb-guests" className="sr-only">
              Number of guests
            </label>
            <input
              id="sb-guests"
              type="number"
              placeholder="Guests"
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:hidden mt-2 py-3 text-base rounded-lg font-heading font-semibold bg-secondary text-white hover:bg-secondary/90 transition-colors"
        >
          Search
        </button>
        <div className="hidden sm:flex mt-2 justify-end">
          <button
            type="submit"
            className="px-8 py-2.5 rounded-lg text-sm font-heading font-semibold bg-secondary text-white hover:bg-secondary/90 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
