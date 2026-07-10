import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteBookmark, listBookmarks } from '../services/bookmarks';
import { useAuthStore } from '../store/authStore';
import type { Bookmark } from '../types/api';
import { formatDate } from '../utils/formatters';

export function BookmarksPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadBookmarks() {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await listBookmarks(token);
      setBookmarks(response.items);
    } catch {
      setErrorMessage('No fue posible cargar tus convocatorias seguidas.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBookmarks();
  }, [token]);

  async function handleDelete(bookmarkId: number) {
    if (!token) return;
    setDeletingId(bookmarkId);
    setErrorMessage(null);
    try {
      await deleteBookmark(token, bookmarkId);
      setBookmarks((current) => current.filter((bookmark) => bookmark.id !== bookmarkId));
    } catch {
      setErrorMessage('No fue posible eliminar la convocatoria seguida.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">HU-005 · HU-006</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Convocatorias seguidas</h1>
          <p className="mt-2 text-slate-600">El backend aísla estos registros por el token del usuario activo.</p>
        </div>
        <button type="button" className="button-primary" onClick={() => navigate('/search')}>Buscar oportunidades</button>
      </section>

      {errorMessage && <div className="alert-error">{errorMessage}</div>}
      {isLoading && <div className="empty-state">Cargando convocatorias seguidas...</div>}

      {!isLoading && bookmarks.length === 0 && (
        <div className="empty-state">
          Aún no tienes convocatorias guardadas. Busca oportunidades y presiona ★ Seguir para agregarlas.
          <div className="mt-4"><button type="button" className="button-primary" onClick={() => navigate('/search')}>Ir al buscador</button></div>
        </div>
      )}

      {!isLoading && bookmarks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Opción A: no se hacen N+1 requests; se muestra el identificador y el enlace al detalle. */}
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Oportunidad</th>
                <th>Guardado el</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.map((bookmark) => (
                <tr key={bookmark.id}>
                  <td className="font-semibold text-slate-950">#{bookmark.opportunity_id}</td>
                  <td>{formatDate(bookmark.created_at)}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="button-secondary" onClick={() => navigate(`/opportunities/${bookmark.opportunity_id}`)}>
                        Ver detalle
                      </button>
                      <button type="button" className="button-secondary" disabled={deletingId === bookmark.id} onClick={() => void handleDelete(bookmark.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
