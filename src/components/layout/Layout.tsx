import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchBar from '../ui/SearchBar';
import type { AuthResponse, LoginBody, RegisterBody } from '../../types/api';

interface Props {
  user: AuthResponse | null;
  onLogin: (body: LoginBody) => Promise<AuthResponse>;
  onRegister: (body: RegisterBody) => Promise<AuthResponse>;
  onLogout: () => void;
}

export default function Layout({ user, onLogin, onRegister, onLogout }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg font-body text-sm"
      >
        Skip to main content
      </a>
      <Navbar
        user={user}
        onLogin={onLogin}
        onRegister={onRegister}
        onLogout={onLogout}
      />
      <SearchBar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
