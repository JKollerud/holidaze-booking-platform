import { api } from './api';
import type {
  ApiResponse,
  CreateVenueBody,
  UpdateVenueBody,
  Venue,
} from '../types/api';

const B = '/holidaze/venues';
const q = (o: Record<string, boolean>) => {
  const s = Object.entries(o)
    .filter(([, v]) => v)
    .map(([k]) => `${k}=true`)
    .join('&');
  return s ? `?${s}` : '';
};

export const venueService = {
  getAll: (opts: { _owner?: boolean; _bookings?: boolean } = {}) =>
    api.get<ApiResponse<Venue[]>>(
      `${B}${q({ _owner: !!opts._owner, _bookings: !!opts._bookings })}`,
    ),
  getById: (id: string, opts: { _owner?: boolean; _bookings?: boolean } = {}) =>
    api.get<ApiResponse<Venue>>(
      `${B}/${id}${q({ _owner: !!opts._owner, _bookings: !!opts._bookings })}`,
    ),
  search: (query: string) =>
    api.get<ApiResponse<Venue[]>>(`${B}/search?q=${encodeURIComponent(query)}`),
  create: (body: CreateVenueBody) =>
    api.post<ApiResponse<Venue>>(B, body, true),
  update: (id: string, body: UpdateVenueBody) =>
    api.put<ApiResponse<Venue>>(`${B}/${id}`, body),
  delete: (id: string) => api.delete(`${B}/${id}`),
};
