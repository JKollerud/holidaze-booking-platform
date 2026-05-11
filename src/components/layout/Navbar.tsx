import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import logo from '../../assets/svg/logo_holidaze.svg';
import { ROUTES } from '../../constants/routes';
import LoginModal from '../ui/LoginModal';
import RegisterModal from '../ui/RegisterModal';
import type { AuthResponse, LoginBody, RegisterBody } from '../../types/api';

interface Props {
  user: AuthResponse | null;
  onLogin: (body: LoginBody) => Promise<AuthResponse>;
  onRegister: (body: RegisterBody) => Promise<AuthResponse>;
  onLogout: () => void;
}

export default function Navbar({ user, onLogin, onRegister, onLogout }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setMenuOpen(false);
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setMenuOpen(false);
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `font-body font-medium text-sm tracking-wide transition-colors ${
      isActive ? 'text-secondary' : 'text-white/90 hover:text-white'
    }`;
  return (
    <>
      <header className="bg-primary sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">
          <Link to={ROUTES.home} aria-label="Holidaze home">
            <span className="sm:hidden font-heading font-extrabold text-white text-lg">
              Holidaze
            </span>
            <img
              src={logo}
              alt="Holidaze"
              className="hidden sm:block h-14 w-auto"
            />
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden sm:flex items-center gap-8"
          >
            <NavLink to={ROUTES.home} className={navLink} end>
              Home
            </NavLink>
            <NavLink to={ROUTES.venues} className={navLink}>
              Venues
            </NavLink>
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={ROUTES.dashboard}
                  className="flex items-center gap-2 font-body text-sm text-white/90 hover:text-white transition-colors"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </span>
                  )}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="font-body text-sm text-white/70 hover:text-white transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openRegister}
                  className="font-body text-sm text-white hover:text-secondary transition-colors underline underline-offset-2"
                >
                  Register
                </button>
                <span className="text-white/40 text-sm">or</span>
                <button
                  onClick={openLogin}
                  className="bg-cta hover:bg-cta-hover text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg transition-colors border-2 border-white/20"
                >
                  Login
                </button>
              </div>
            )}
          </div>
          <div className="sm:hidden flex items-center gap-3">
            {user ? (
              <Link to={ROUTES.dashboard} aria-label="Your profile">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-white/40"
                  />
                ) : (
                  <FiUser className="w-6 h-6 text-white/90" />
                )}
              </Link>
            ) : (
              <button onClick={openLogin} aria-label="Sign in">
                <FiUser className="w-6 h-6 text-white/90" />
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="text-white"
            >
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="sm:hidden bg-primary-hover border-t border-white/10 px-4 py-4 flex flex-col gap-4"
          >
            <NavLink
              to={ROUTES.home}
              className={navLink}
              onClick={() => setMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.venues}
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              Venues
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to={ROUTES.dashboard}
                  className={navLink}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left font-body text-sm text-white/70 hover:text-white transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-3 items-center">
                <button
                  onClick={openRegister}
                  className="font-body text-sm text-white/80"
                >
                  Register
                </button>
                <span className="text-white/40">or</span>
                <button
                  onClick={openLogin}
                  className="btn-cta text-sm px-4 py-2 rounded-lg"
                >
                  Login
                </button>
              </div>
            )}
          </nav>
        )}
      </header>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={openRegister}
        onLogin={onLogin}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={openLogin}
        onRegister={onRegister}
      />
    </>
  );
}
