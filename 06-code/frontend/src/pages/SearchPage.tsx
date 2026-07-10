import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { createBookmark, deleteBookmark, listBookmarks } from '../services/bookmarks';
import { ApiError } from '../services/http';
import { searchOpportunities } from '../services/opportunities';
import { createSavedSearch } from '../services/savedSearches';
import { useAuthStore } from '../store/authStore';
import type { Bookmark, Opportunity, SavedSearchFilter } from '../types/api';
import { formatDate, formatMillionsCOP } from '../utils/formatters';

interface SearchFilters {
  keyword: string;
  entity: string;
  status: string;
  published_after: string;
}

type PageStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const initialFilters: SearchFilters = {
  keyword: '',
  entity: '',
  status: '',
  published_after: '',
};

function normalizeStatus(status: string | null): string {
  const value = (status ?? '').toLowerCase();
  if (value.includes('adjud') || value.includes('seleccion')) return 'adjudicado';
  if (value.includes('cerr') || value.includes('termin')) return 'cerrado';
  return 'activo';
}

function StatusBadge({ status }: { status: string | null }) {
  const normalized = normalizeStatus(status);
  const classes = {
    activo: 'bg-emerald-100 text-emerald-700',
    cerrado: 'bg-slate-200 text-slate-700',
    adjudicado: 'bg-blue-100 text-blue-700',
  }[normalized];

  return <span className={`status-badge ${classes}`}>{status ?? 'activo'}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-200" />
      ))}
    </div>
  );
}

function filtersFromSearchParams(searchParams: URLSearchParams): SearchFilters {
  return {
    keyword: searchParams.get('keyword') ?? searchParams.get('query') ?? '',
    entity: searchParams.get('entity') ?? '',
    status: searchParams.get('status') ?? '',
    published_after: searchParams.get('published_after') ?? searchParams.get('published_from') ?? '',
  };
}

function activeFiltersFromForm(filters: SearchFilters): SavedSearchFilter[] {
  const active: SavedSearchFilter[] = [];
  if (filters.keyword.trim()) active.push({ key: 'keyword', value: filters.keyword.trim() });
  if (filters.entity.trim()) active.push({ key: 'entity', value: filters.entity.trim() });
  if (filters.status.trim()) active.push({ key: 'status', value: filters.status.trim() });
  if (filters.published_after.trim()) active.push({ key: 'published_from', value: filters.published_after.trim() });
  return active;
}

export function SearchPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const didApplyUrlParams = useRef(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [status, setStatus] = useState<PageStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [bookmarkByOpportunityId, setBookmarkByOpportunityId] = useState<Map<number, Bookmark>>(new Map());
  const [bookmarkActionId, setBookmarkActionId] = useState<number | null>(null);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [saveSearchMessage, setSaveSearchMessage] = useState<string | null>(null);
  const [saveSearchError, setSaveSearchError] = useState<string | null>(null);
  const [isSavingSearch, setIsSavingSearch] = useState(false);

  const activeFilters = useMemo(() => activeFiltersFromForm(filters), [filters]);
  const canSaveSearch = activeFilters.length > 0;

  const bookmarkedOpportunityIds = useMemo(
    () => new Set(bookmarkByOpportunityId.keys()),
    [bookmarkByOpportunityId],
  );

  async function refreshBookmarks(authToken: string) {
    const response = await listBookmarks(authToken);
    setBookmarkByOpportunityId(new Map(response.items.map((bookmark) => [bookmark.opportunity_id, bookmark])));
  }

  useEffect(() => {
    if (!token) return;
    refreshBookmarks(token).catch(() => {
      setErrorMessage('No fue posible cargar tus convocatorias seguidas.');
    });
  }, [token]);

  async function runSearch(nextFilters: SearchFilters = filters) {
    if (!token) return;
    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await searchOpportunities(token, {
        keyword: nextFilters.keyword || undefined,
        entity: nextFilters.entity || undefined,
        status: nextFilters.status || undefined,
        published_after: nextFilters.published_after || undefined,
        page: 1,
        page_size: 10,
      });
      setOpportunities(response.items);
      setStatus(response.total === 0 ? 'empty' : 'success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        setErrorMessage('El servicio SECOP no está disponible en este momento. Intente más tarde.');
      } else {
        setErrorMessage('No fue posible consultar convocatorias. Intenta de nuevo.');
      }
      setStatus('error');
    }
  }

  useEffect(() => {
    if (!token || didApplyUrlParams.current || Array.from(searchParams.keys()).length === 0) return;
    didApplyUrlParams.current = true;
    const nextFilters = filtersFromSearchParams(searchParams);
    setFilters(nextFilters);
    void runSearch(nextFilters);
  }, [token, searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch();
  }

  function clearFilters() {
    setFilters(initialFilters);
    setOpportunities([]);
    setStatus('idle');
    setErrorMessage(null);
    setSaveSearchMessage(null);
    setSaveSearchError(null);
    setShowSaveSearch(false);
  }

  async function toggleBookmark(opportunityId: number) {
    if (!token) return;
    setBookmarkActionId(opportunityId);
    setErrorMessage(null);
    try {
      const existing = bookmarkByOpportunityId.get(opportunityId);
      if (existing) {
        await deleteBookmark(token, existing.id);
        setBookmarkByOpportunityId((current) => {
          const next = new Map(current);
          next.delete(opportunityId);
          return next;
        });
      } else {
        const bookmark = await createBookmark(token, opportunityId);
        setBookmarkByOpportunityId((current) => new Map(current).set(opportunityId, bookmark));
      }
    } catch {
      setErrorMessage('No fue posible actualizar la convocatoria seguida.');
    } finally {
      setBookmarkActionId(null);
    }
  }

  async function handleSaveSearch() {
    if (!token) return;
    setSaveSearchMessage(null);
    setSaveSearchError(null);

    if (!savedSearchName.trim()) {
      setSaveSearchError('Ingresa un nombre para la búsqueda.');
      return;
    }
    if (activeFilters.length === 0) {
      setSaveSearchError('Debes ingresar al menos un filtro');
      return;
    }

    setIsSavingSearch(true);
    try {
      await createSavedSearch(token, { name: savedSearchName.trim(), filters: activeFilters });
      setSaveSearchMessage('Búsqueda guardada');
      setSavedSearchName('');
      setShowSaveSearch(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setSaveSearchError('Ya existe una búsqueda con ese nombre');
      } else if (error instanceof ApiError && error.status === 422) {
        setSaveSearchError('Debes ingresar al menos un filtro');
      } else {
        setSaveSearchError('No fue posible guardar la búsqueda.');
      }
    } finally {
      setIsSavingSearch(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8">
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Buscador de convocatorias</h1>
        <p className="mt-2 text-slate-600">Consulta oportunidades públicas normalizadas desde SECOP a través del backend.</p>
      </section>

      <form className="filter-panel" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Título o ID</span>
          <input type="text" value={filters.keyword} onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))} placeholder="Título o ID" />
        </label>
        <label className="form-field">
          <span>Entidad</span>
          <input type="text" value={filters.entity} onChange={(event) => setFilters((current) => ({ ...current, entity: event.target.value }))} placeholder="Ej: MinTIC, Gobernación..." />
        </label>
        <label className="form-field">
          <span>Estado</span>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">Todos</option>
            <option value="activo">activo</option>
            <option value="cerrado">cerrado</option>
            <option value="adjudicado">adjudicado</option>
          </select>
        </label>
        <label className="form-field">
          <span>Publicado después de</span>
          <input type="date" value={filters.published_after} onChange={(event) => setFilters((current) => ({ ...current, published_after: event.target.value }))} />
        </label>
        <div className="flex flex-wrap items-end gap-3 md:col-span-2 lg:col-span-4">
          <button type="submit" className="button-primary" disabled={status === 'loading'}>{status === 'loading' ? 'Buscando...' : 'Buscar'}</button>
          <button type="button" className="button-secondary" onClick={clearFilters}>Limpiar filtros</button>
          <button type="button" className="button-secondary" disabled={!canSaveSearch} onClick={() => setShowSaveSearch((value) => !value)}>Guardar Búsqueda ★</button>
        </div>
        {showSaveSearch && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 md:col-span-2 lg:col-span-4">
            <label className="form-field">
              <span>Nombre de la búsqueda</span>
              <input type="text" value={savedSearchName} onChange={(event) => setSavedSearchName(event.target.value)} placeholder="Ej: Convocatorias MinTIC activas" />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="button-primary" disabled={isSavingSearch} onClick={() => void handleSaveSearch()}>{isSavingSearch ? 'Guardando...' : 'Confirmar guardado'}</button>
              <button type="button" className="button-secondary" onClick={() => setShowSaveSearch(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </form>

      {saveSearchMessage && <div className="alert-success mt-6">{saveSearchMessage}</div>}
      {saveSearchError && <div className="alert-error mt-6">{saveSearchError}</div>}
      {errorMessage && (
        <div className="alert-error mt-6">
          {errorMessage}
          {status === 'error' && <button type="button" className="ml-3 underline" onClick={() => void runSearch()}>Reintentar</button>}
        </div>
      )}

      <section className="mt-8">
        {status === 'idle' && <div className="empty-state">Usa los filtros y presiona “Buscar” para consultar convocatorias.</div>}
        {status === 'loading' && <LoadingSkeleton />}
        {status === 'empty' && <div className="empty-state">No se encontraron convocatorias con esos criterios.</div>}
        {status === 'success' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Título</th><th>Entidad</th><th>Presupuesto</th><th>Publicado</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => {
                  const isBookmarked = bookmarkedOpportunityIds.has(opportunity.id);
                  return (
                    <tr key={opportunity.id}>
                      <td>{opportunity.id}</td>
                      <td className="font-semibold text-slate-950">{opportunity.title}</td>
                      <td>{opportunity.entity_name}</td>
                      <td>{formatMillionsCOP(opportunity.estimated_amount_cents)}</td>
                      <td>{formatDate(opportunity.published_at)}</td>
                      <td><StatusBadge status={opportunity.status} /></td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="button-secondary" onClick={() => navigate(`/opportunities/${opportunity.id}`)}>Ver detalle</button>
                          <button type="button" className={isBookmarked ? 'button-primary' : 'button-secondary'} disabled={bookmarkActionId === opportunity.id} onClick={() => void toggleBookmark(opportunity.id)}>
                            {isBookmarked ? '★ Seguida' : '☆ Seguir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
