import { useState } from 'react';
import Modal from './Modal';
import { NOROFF_EMAIL_REGEX } from '../../services/authService';
import type { LoginBody } from '../../types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLogin: (body: LoginBody) => Promise<void>;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!NOROFF_EMAIL_REGEX.test(email)) {
      setError('You must use a stud.noroff.no email address.');
      return;
    }
    setLoading(true);
    try {
      await onLogin({ email, password });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in or create an account"
      titleId="login-title"
    >
      <p className="font-body text-text-secondary text-sm mb-5 -mt-2">
        You can sign in using your Holidaze account to access our services.
      </p>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="block font-body text-sm font-medium text-text-primary mb-1"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@stud.noroff.no"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block font-body text-sm font-medium text-text-primary mb-1"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-cta w-full py-3 text-base"
        >
          {loading ? 'Signing in…' : 'Sign in with Email'}
        </button>
      </form>

      <p className="text-center font-body text-sm text-text-secondary mt-5">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-cta font-medium hover:underline"
        >
          Register here
        </button>
      </p>
    </Modal>
  );
}
