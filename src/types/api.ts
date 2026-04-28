export interface Media {
  url: string;
  alt: string;
}

export interface ApiMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}
export interface ApiResponse<T> {
  data: T;
  meta: Partial<ApiMeta>;
}

export interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}
export interface VenueLocation {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
}
export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  owner?: Profile;
  bookings?: Booking[];
}
export interface CreateVenueBody {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Partial<VenueMeta>;
  location?: Partial<VenueLocation>;
}
export type UpdateVenueBody = Partial<CreateVenueBody>;

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  customer?: Profile;
}
export interface CreateBookingBody {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}
export interface UpdateBookingBody {
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
  venues?: Venue[];
  bookings?: Booking[];
  _count?: { venues: number; bookings: number };
}
export interface UpdateProfileBody {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}
export interface LoginBody {
  email: string;
  password: string;
}
export interface AuthResponse {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
  accessToken: string;
}
