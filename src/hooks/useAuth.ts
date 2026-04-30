import { useState, useCallback } from 'react';
import {
  getStoredUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '../services/authService';
import type { AuthResponse, LoginBody, RegisterBody } from '../types/api';

export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(getStoredUser);

  const login = useCallback(async (body: LoginBody) => {
    const u = await loginService(body);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (body: RegisterBody) => {
    return registerService(body);
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  return { user, login, register, logout, isLoggedIn: !!user };
}
