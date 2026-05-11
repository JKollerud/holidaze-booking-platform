import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-heading text-8xl font-extrabold text-primary/10 leading-none select-none">
        404
      </p>
      <h1 className="font-heading text-2xl font-bold text-text-primary mt-4 mb-2">
        Page not found
      </h1>
      <p className="font-body text-text-secondary mb-8 max-w-sm text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={ROUTES.home} className="btn-primary px-8 py-3 rounded-lg">
        Back to Home
      </Link>
    </div>
  );
}
