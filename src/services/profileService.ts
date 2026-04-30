import { api } from './api';
import type {
  ApiResponse,
  Booking,
  Profile,
  UpdateProfileBody,
  Venue,
} from '../types/api';

const B = '/holidaze/profiles';

export const profileService = {
  get: (name: string) =>
    api.get<ApiResponse<Profile>>(
      `${B}/${name}?_bookings=true&_venues=true`,
      true,
    ),
  update: (name: string, body: UpdateProfileBody) =>
    api.put<ApiResponse<Profile>>(`${B}/${name}`, body),
  getBookings: (name: string) =>
    api.get<ApiResponse<Booking[]>>(`${B}/${name}/bookings?_venue=true`, true),
  getVenues: (name: string) =>
    api.get<ApiResponse<Venue[]>>(`${B}/${name}/venues?_bookings=true`, true),
};
