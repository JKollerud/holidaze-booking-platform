import { useEffect, useState } from 'react';
import { getStoredUser } from '../services/authService';
import { profileService } from '../services/profileService';
import { venueService } from '../services/venueService';
import { bookingService } from '../services/bookingService';
import type { Booking, Venue } from '../types/api';
import VenueCard from '../components/venue/VenueCard';
import VenueFormModal from '../components/venue/VenueFormModal';

type Tab = 'bookings' | 'favorites' | 'venues';

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=60';

const TABS: { key: Tab; label: string }[] = [
  { key: 'bookings', label: 'Your bookings' },
  { key: 'favorites', label: 'Your favorites' },
  { key: 'venues', label: 'Your venues' },
];

export default function DashboardPage() {
  const user = getStoredUser();
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url ?? '');
  const [bannerUrl, setBannerUrl] = useState(user?.banner?.url ?? '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | undefined>();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      profileService.getBookings(user.name),
      user.venueManager
        ? profileService.getVenues(user.name)
        : Promise.resolve({ data: [] as Venue[] }),
    ])
      .then(([b, v]) => {
        setBookings(b.data);
        setVenues(v.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="font-body text-text-secondary">
          You must be logged in to view your dashboard.
        </p>
      </div>
    );

  const handleSaveProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await profileService.update(user.name, {
        bio: bio || undefined,
        ...(avatarUrl ? { avatar: { url: avatarUrl, alt: user.name } } : {}),
        ...(bannerUrl ? { banner: { url: bannerUrl, alt: '' } } : {}),
      });
      setSaveMsg('Profile updated!');
      setEditMode(false);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingService.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVenue = async (id: string) => {
    if (!confirm('Delete this venue? This cannot be undone.')) return;
    try {
      await venueService.delete(id);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVenueSaved = (saved: Venue) => {
    setVenues((prev) => {
      const idx = prev.findIndex((v) => v.id === saved.id);
      return idx >= 0
        ? prev.map((v, i) => (i === idx ? saved : v))
        : [saved, ...prev];
    });
    setEditingVenue(undefined);
  };

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.dateTo) >= new Date(),
  );
  const visibleTabs = TABS.filter(
    (t) => t.key !== 'venues' || user.venueManager,
  );

  return (
    <div>
      <div className="h-36 sm:h-52 w-full overflow-hidden bg-border">
        <img
          src={user.banner?.url || FALLBACK_BANNER}
          alt="Profile banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_BANNER;
          }}
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Avatar */}
        <div className="-mt-12 sm:-mt-16 mb-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-border overflow-hidden shadow-lg">
            {user.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={`${user.name}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-white font-heading font-bold text-3xl">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-text-primary">
              {user.name}
            </h1>
            <p className="font-body text-sm text-text-secondary">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditMode(!editMode);
                setSaveMsg('');
              }}
              className="btn-outline text-sm px-4 py-2 rounded-lg"
            >
              Edit profile
            </button>
            {user.venueManager && (
              <button
                onClick={() => {
                  setEditingVenue(undefined);
                  setShowVenueForm(true);
                }}
                className="btn-cta text-sm px-4 py-2 rounded-lg"
              >
                + Add venue
              </button>
            )}
          </div>
        </div>
        {saveMsg && (
          <p className="font-body text-sm text-success mb-3">{saveMsg}</p>
        )}
        {editMode && (
          <form
            onSubmit={handleSaveProfile}
            className="card p-5 mb-6 space-y-4 max-w-lg"
            aria-label="Edit profile"
          >
            <h2 className="font-heading font-bold text-text-primary">
              Edit Profile
            </h2>
            <div>
              <label
                htmlFor="edit-avatar"
                className="block font-body text-sm font-medium text-text-primary mb-1"
              >
                Avatar URL
              </label>
              <input
                id="edit-avatar"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="input-field"
                placeholder="https://…"
              />
            </div>
            <div>
              <label
                htmlFor="edit-banner"
                className="block font-body text-sm font-medium text-text-primary mb-1"
              >
                Banner URL
              </label>
              <input
                id="edit-banner"
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="input-field"
                placeholder="https://…"
              />
            </div>
            <div>
              <label
                htmlFor="edit-bio"
                className="block font-body text-sm font-medium text-text-primary mb-1"
              >
                Bio
              </label>
              <textarea
                id="edit-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field resize-none"
                placeholder="Tell guests about yourself…"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2.5 rounded-lg"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setSaveMsg('');
              }}
              className="flex gap-3 btn-outline px-6 py-2.5 rounded-lg"
            >
              Cancel
            </button>
          </form>
        )}
        <div
          className="flex gap-0 border-b border-border mb-6"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {visibleTabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`font-body font-medium text-sm px-4 py-2.5 border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="pb-12">
          {loading ? (
            <div
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              aria-hidden="true"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="bg-border h-36 sm:h-48" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-border rounded w-2/3" />
                    <div className="h-3 bg-border rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {tab === 'bookings' &&
                (upcomingBookings.length === 0 ? (
                  <Empty msg="No upcoming bookings." />
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {upcomingBookings.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={handleCancelBooking}
                      />
                    ))}
                  </div>
                ))}
              {tab === 'favorites' && <Empty msg="No favorites yet." />}
              {tab === 'venues' &&
                user.venueManager &&
                (venues.length === 0 ? (
                  <Empty msg="You haven't listed any venues yet." />
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {venues.map((v) => (
                      <div key={v.id} className="relative group">
                        <VenueCard venue={v} />
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingVenue(v);
                              setShowVenueForm(true);
                            }}
                            className="bg-primary text-white text-xs font-body px-2.5 py-1.5 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVenue(v.id)}
                            className="bg-error text-white text-xs font-body px-2.5 py-1.5 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      <VenueFormModal
        isOpen={showVenueForm}
        onClose={() => {
          setShowVenueForm(false);
          setEditingVenue(undefined);
        }}
        venue={editingVenue}
        onSaved={handleVenueSaved}
      />
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  const venue = booking.venue;
  const img = venue?.media?.[0]?.url;
  const from = new Date(booking.dateFrom).toLocaleDateString('no-NO');
  const to = new Date(booking.dateTo).toLocaleDateString('no-NO');
  return (
    <div className="card overflow-hidden">
      <div className="h-36 sm:h-40 bg-border overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={venue?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-border" />
        )}
      </div>
      <div className="p-3 sm:p-4 space-y-1">
        <h3 className="font-heading font-bold text-text-primary text-sm truncate">
          {venue?.name ?? 'Venue'}
        </h3>
        <p className="font-body text-xs text-text-secondary">
          {from} → {to}
        </p>
        <p className="font-body text-xs text-text-secondary">
          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => onCancel(booking.id)}
          className="mt-1 font-body text-xs text-error hover:underline"
        >
          Cancel booking
        </button>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <p className="text-center font-body text-text-secondary py-16">{msg}</p>
  );
}
