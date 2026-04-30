import { api } from './api';
import type {
  ApiResponse,
  AuthResponse,
  LoginBody,
  RegisterBody,
} from '../types/api';

export const NOROFF_EMAIL_REGEX = /^[^@]+@stud\.noroff\.no$/i;

export async function register(body: RegisterBody): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', body);
  return res.data;
}

export async function login(body: LoginBody): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>(
    '/auth/login?_holidaze=true',
    body,
  );
  localStorage.setItem('holidaze_user', JSON.stringify(res.data));
  return res.data;
}

export function logout(): void {
  localStorage.removeItem('holidaze_user');
  window.location.href = '/';
}

export function getStoredUser(): AuthResponse | null {
  try {
    const raw = localStorage.getItem('holidaze_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
