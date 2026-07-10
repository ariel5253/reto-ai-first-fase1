import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { listBookmarks } from '../services/bookmarks';
import { listSavedSearches } from '../services/savedSearches';
import { useAuthStore } from '../store/authStore';
import type { Bookmark, SavedSearch } from '../types/api';
import { formatDate } from '../utils/formatters';

interface DashboardState {
  bookmarks: Bookmark[];
  bookmarkTotal: number;
  savedSearches: SavedSearch[];
  savedSearchTotal: number;
}

export function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    Promise.all([listBookmarks(token), listSavedSearches(token)])
      .then(([bookmarksResponse, savedSearchesResponse]) => {
        setData({
          bookmarks: bookmarksResponse.items.slice(0, 2),
          bookmarkTotal: bookmarksResponse.total,
          savedSearches: savedSearchesResponse.items.slice(0, 2),
          savedSearchTotal: savedSearchesResponse.total,
        });
      })
      .catch(() => setErrorMessage('No fue posible cargar el panel de control.'))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Panel privado</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Panel de control</h1>
          <p className="mt-2 text-slate-600">Resumen de tus convocatorias seguidas y búsquedas guardadas.</p>
        </div>
        <button type="button" className="button-primary" onClick={() => navigate('/search')}>
          Buscar nuevas oportunidades
        </button>
      </section>

      {isLoading && <div className="empty-state">Cargando panel...</div>}
      {errorMessage && <div className="alert-error">{errorMessage}</div>}

      {data && !isLoading && (
        <>
          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="metric-card"><span>Convocatorias seguidas</span><strong>{data.bookmarkTotal}</strong></div>
            <div className="metric-card"><span>Búsquedas guardadas</span><strong>{data.savedSearchTotal}</strong></div>
            <div className="metric-card"><span>Sincronización SECOP</span><strong>Diaria vía API</strong></div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="content-card">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950">Convocatorias Seguidas</h2>
                <button type="button" className="button-secondary" onClick={() => navigate('/bookmarks')}>Ver todas</button>
              </div>
              {data.bookmarks.length === 0 ? (
                <div className="empty-state">Aún no tienes convocatorias seguidas.</div>
              ) : (
                <div className="space-y-3">
                  {data.bookmarks.map((bookmark) => (
                    <Link key={bookmark.id} to={`/opportunities/${bookmark.opportunity_id}`} className="list-row">
                      <strong>Oportunidad #{bookmark.opportunity_id}</strong>
                      <span>Guardada el {formatDate(bookmark.created_at)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="content-card">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950">Búsquedas Guardadas</h2>
                <button type="button" className="button-secondary" onClick={() => navigate('/saved-searches')}>Ver todas</button>
              </div>
              {data.savedSearches.length === 0 ? (
                <div className="empty-state">No tienes búsquedas guardadas.</div>
              ) : (
                <div className="space-y-3">
                  {data.savedSearches.map((search) => (
                    <div key={search.id} className="list-row">
                      <strong>{search.name}</strong>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {search.filters.map((filter) => <span key={`${filter.key}-${filter.value}`} className="chip">{filter.key}: {filter.value}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
