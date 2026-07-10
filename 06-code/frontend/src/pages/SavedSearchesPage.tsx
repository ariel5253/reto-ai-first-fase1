import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteSavedSearch, listSavedSearches } from '../services/savedSearches';
import { useAuthStore } from '../store/authStore';
import type { SavedSearch } from '../types/api';
import { buildSearchParams, formatDate } from '../utils/formatters';

export function SavedSearchesPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadSavedSearches() {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await listSavedSearches(token);
      setSearches(response.items);
    } catch {
      setErrorMessage('No fue posible cargar tus búsquedas guardadas.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSavedSearches();
  }, [token]);

  async function handleDelete(searchId: number) {
    if (!token) return;
    setDeletingId(searchId);
    setErrorMessage(null);
    try {
      await deleteSavedSearch(token, searchId);
      setSearches((current) => current.filter((search) => search.id !== searchId));
    } catch {
      setErrorMessage('No fue posible eliminar la búsqueda guardada.');
    } finally {
      setDeletingId(null);
    }
  }

  function runAgain(search: SavedSearch) {
    const params = buildSearchParams(search.filters);
    navigate(`/search?${params}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">HU-007</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Búsquedas guardadas</h1>
          <p className="mt-2 text-slate-600">Reutiliza filtros frecuentes sin compartir estado global entre páginas.</p>
        </div>
        <button type="button" className="button-primary" onClick={() => navigate('/search')}>Crear desde buscador</button>
      </section>

      {errorMessage && <div className="alert-error">{errorMessage}</div>}
      {isLoading && <div className="empty-state">Cargando búsquedas guardadas...</div>}

      {!isLoading && searches.length === 0 && (
        <div className="empty-state">
          No tienes búsquedas guardadas. Usa los filtros del buscador y guarda tus consultas frecuentes.
          <div className="mt-4"><button type="button" className="button-primary" onClick={() => navigate('/search')}>Ir al buscador</button></div>
        </div>
      )}

      {!isLoading && searches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {searches.map((search) => (
            <article key={search.id} className="content-card">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{search.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">Creada el {formatDate(search.created_at)}</p>
                </div>
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                {search.filters.map((filter) => <span key={`${search.id}-${filter.key}-${filter.value}`} className="chip">{filter.key}: {filter.value}</span>)}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="button-primary" onClick={() => runAgain(search)}>▶ Ejecutar de nuevo</button>
                <button type="button" className="button-secondary" disabled={deletingId === search.id} onClick={() => void handleDelete(search.id)}>🗑 Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
