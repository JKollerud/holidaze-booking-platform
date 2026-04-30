import { api } from './api';
import type {
  ApiResponse,
  Booking,
  CreateBookingBody,
  UpdateBookingBody,
} from '../types/api';

const B = '/holidaze/bookings';

export const bookingService = {
  getAll: () =>
    api.get<ApiResponse<Booking[]>>(`${B}?_venue=true&_customer=true`, true),
  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`${B}/${id}?_venue=true`, true),
  create: (body: CreateBookingBody) =>
    api.post<ApiResponse<Booking>>(B, body, true),
  update: (id: string, body: UpdateBookingBody) =>
    api.put<ApiResponse<Booking>>(`${B}/${id}`, body),
  delete: (id: string) => api.delete(`${B}/${id}`),
};
