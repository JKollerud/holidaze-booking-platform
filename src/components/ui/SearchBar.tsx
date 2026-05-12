import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set('q', destination.trim());
    navigate(`${ROUTES.venues}?${params.toString()}`);
  };

  return (
    <div className="bg-primary/90 py-4 px-4">
      <form
        onSubmit={handleSearch}
        role="search"
        aria-label="Search venues"
        className="max-w-4xl mx-auto flex gap-2"
      >
        <label htmlFor="sb-dest" className="sr-only">
          Destination
        </label>
        <div className="flex items-center bg-white rounded-lg px-3 gap-2 flex-1 focus-within:ring-2 focus-within:ring-secondary transition">
          <FiSearch
            className="w-4 h-4 text-text-secondary shrink-0"
            aria-hidden="true"
          />
          <input
            id="sb-dest"
            type="text"
            placeholder="Search for a destination, venue name..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="py-3 flex-1 outline-none font-body text-sm text-text-primary placeholder:text-text-secondary bg-transparent"
          />
          {destination && (
            <button
              type="button"
              onClick={() => setDestination('')}
              aria-label="Clear search"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg text-sm font-heading font-semibold bg-secondary text-white hover:bg-secondary/90 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </form>
    </div>
  );
}
