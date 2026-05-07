import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import { ROUTES } from './constants/routes';

import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { user, login, register, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              user={user}
              onLogin={login}
              onRegister={register}
              onLogout={logout}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path={ROUTES.venues} element={<VenuesPage />} />
          <Route path={ROUTES.venueDetails} element={<VenueDetailsPage />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.login} element={<HomePage />} />
          <Route path={ROUTES.register} element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
