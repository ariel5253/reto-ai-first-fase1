import { Route, Routes } from 'react-router-dom';

import { BookmarksPage } from '../pages/Bookmarks/BookmarksPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { DetailPage } from '../pages/Detail/DetailPage';
import { LandingPage } from '../pages/Landing/LandingPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { SavedSearchesPage } from '../pages/SavedSearches/SavedSearchesPage';
import { SearchPage } from '../pages/Search/SearchPage';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/opportunities/:id" element={<DetailPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/saved-searches" element={<SavedSearchesPage />} />
      </Route>
    </Routes>
  );
}
