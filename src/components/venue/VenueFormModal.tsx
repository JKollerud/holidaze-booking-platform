import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { venueService } from '../../services/venueService';
import type { Venue } from '../../types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue; // if provided = edit mode
  onSaved: (venue: Venue) => void;
}

export default function VenueFormModal({
  isOpen,
  onClose,
  venue,
  onSaved,
}: Props) {
  const isEdit = !!venue;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (venue) {
      setName(venue.name);
      setDescription(venue.description);
      setPrice(String(venue.price));
      setMaxGuests(String(venue.maxGuests));
      setImageUrl(venue.media?.[0]?.url ?? '');
      setAddress(venue.location?.address ?? '');
      setCity(venue.location?.city ?? '');
      setCountry(venue.location?.country ?? '');
      setWifi(venue.meta?.wifi ?? false);
      setParking(venue.meta?.parking ?? false);
      setBreakfast(venue.meta?.breakfast ?? false);
      setPets(venue.meta?.pets ?? false);
    }
  }, [venue, isOpen]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !description || !price || !maxGuests) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const body = {
      name,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      media: imageUrl ? [{ url: imageUrl, alt: name }] : [],
      meta: { wifi, parking, breakfast, pets },
      location: {
        address: address || null,
        city: city || null,
        country: country || null,
      },
    };
    try {
      const res = isEdit
        ? await venueService.update(venue!.id, body)
        : await venueService.create(body);
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save venue.');
    } finally {
      setLoading(false);
    }
  };

  const Check = ({
    label,
    val,
    set,
  }: {
    label: string;
    val: boolean;
    set: (v: boolean) => void;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={val}
        onChange={(e) => set(e.target.checked)}
        className="w-4 h-4 accent-secondary rounded"
      />
      <span className="font-body text-sm text-text-primary">{label}</span>
    </label>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Venue' : 'Create a New Venue'}
      titleId="venue-form-title"
    >
      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="vf-name"
            className="block font-body text-sm font-medium text-text-primary mb-1"
          >
            Venue name *
          </label>
          <input
            id="vf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="e.g. Cozy Beach House"
          />
        </div>
        <div>
          <label
            htmlFor="vf-desc"
            className="block font-body text-sm font-medium text-text-primary mb-1"
          >
            Description *
          </label>
          <textarea
            id="vf-desc"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            placeholder="Describe your venue…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="vf-price"
              className="block font-body text-sm font-medium text-text-primary mb-1"
            >
              Price / night (NOK) *
            </label>
            <input
              id="vf-price"
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label
              htmlFor="vf-guests"
              className="block font-body text-sm font-medium text-text-primary mb-1"
            >
              Max guests *
            </label>
            <input
              id="vf-guests"
              type="number"
              required
              min={1}
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="vf-img"
            className="block font-body text-sm font-medium text-text-primary mb-1"
          >
            Image URL
          </label>
          <input
            id="vf-img"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'vf-addr', label: 'Address', val: address, set: setAddress },
            { id: 'vf-city', label: 'City', val: city, set: setCity },
            {
              id: 'vf-country',
              label: 'Country',
              val: country,
              set: setCountry,
            },
          ].map(({ id, label, val, set }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block font-body text-xs font-medium text-text-primary mb-1"
              >
                {label}
              </label>
              <input
                id={id}
                type="text"
                value={val}
                onChange={(e) => set(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          ))}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-text-primary mb-2">
            Facilities
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Check label="WiFi" val={wifi} set={setWifi} />
            <Check label="Parking" val={parking} set={setParking} />
            <Check label="Breakfast" val={breakfast} set={setBreakfast} />
            <Check label="Pets allowed" val={pets} set={setPets} />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-cta w-full py-3 text-base"
        >
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create venue'}
        </button>
      </form>
    </Modal>
  );
}
