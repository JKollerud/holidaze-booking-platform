import { useState } from 'react';
import Modal from './Modal';
import { NOROFF_EMAIL_REGEX } from '../../services/authService';
import type { AuthResponse, RegisterBody } from '../../types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (body: RegisterBody) => Promise<AuthResponse>;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegister,
}: Props) {
  const [isManager, setIsManager] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!NOROFF_EMAIL_REGEX.test(email)) {
      setError('You must use a stud.noroff.no email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await onRegister({ name, email, password, venueManager: isManager });
      onClose();
      onSwitchToLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create an account"
      titleId="register-title"
    >
      {/* Account type selector */}
      <div className="mb-5">
        <p className="font-body text-sm text-text-secondary mb-2">
          Select account type:
        </p>
        <div
          className="flex rounded-lg border border-border overflow-hidden"
          role="group"
          aria-label="Account type"
        >
          {[
            { label: 'Customer', val: false },
            { label: 'Venue Manager', val: true },
          ].map(({ label, val }) => (
            <button
              key={label}
              type="button"
              onClick={() => setIsManager(val)}
              aria-pressed={isManager === val}
              className={`flex-1 py-2.5 text-sm font-body font-medium transition-colors ${
                isManager === val
                  ? 'bg-cta text-white'
                  : 'bg-white text-text-secondary hover:bg-bg'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-heading font-bold text-text-primary text-sm">
          {isManager ? 'Venue Manager account' : 'Customer account'}
        </p>
        <p className="font-body text-xs text-text-secondary mt-1">
          {isManager
            ? 'Lets you register and manage your own venues on Holidaze.'
            : 'Used for booking venues. To manage venues, switch to Venue Manager.'}
        </p>
      </div>

      {error && (
        <div role="alert" className="alert-error mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {[
          {
            id: 'reg-name',
            label: 'Name',
            type: 'text',
            val: name,
            set: setName,
            ph: 'Your username',
            ac: 'name',
          },
          {
            id: 'reg-email',
            label: 'Email address',
            type: 'email',
            val: email,
            set: setEmail,
            ph: 'you@stud.noroff.no',
            ac: 'email',
          },
          {
            id: 'reg-pass',
            label: 'Password',
            type: 'password',
            val: password,
            set: setPassword,
            ph: 'Min. 8 characters',
            ac: 'new-password',
          },
          {
            id: 'reg-conf',
            label: 'Confirm Password',
            type: 'password',
            val: confirm,
            set: setConfirm,
            ph: 'Repeat password',
            ac: 'new-password',
          },
        ].map(({ id, label, type, val, set, ph, ac }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block font-body text-sm font-medium text-text-primary mb-1"
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              required
              autoComplete={ac}
              value={val}
              onChange={(e) => set(e.target.value)}
              className="input-field"
              placeholder={ph}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="btn-cta w-full py-3 text-base"
        >
          {loading ? 'Creating account…' : 'Register account'}
        </button>
      </form>

      <p className="text-center font-body text-sm text-text-secondary mt-5">
        Already got an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-cta font-medium hover:underline"
        >
          Login here
        </button>
      </p>
    </Modal>
  );
}
