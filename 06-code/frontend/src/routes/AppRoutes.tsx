import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '../components/AppLayout';
import { PublicLayout } from '../components/PublicLayout';
import { BookmarksPage } from '../pages/Bookmarks/BookmarksPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { DetailPage } from '../pages/Detail/DetailPage';
import { LandingPage } from '../pages/Landing/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SavedSearchesPage } from '../pages/SavedSearches/SavedSearchesPage';
import { SearchPage } from '../pages/Search/SearchPage';
import { useAuthStore } from '../store/authStore';
import { PrivateRoute } from './PrivateRoute';

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/opportunities/:id" element={<DetailPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route
          path="/login"
          element={(
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/register"
          element={(
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          )}
        />
      </Route>
    </Routes>
  );
}
