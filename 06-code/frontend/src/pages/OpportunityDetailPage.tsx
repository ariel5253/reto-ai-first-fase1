import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createBookmark, deleteBookmark, listBookmarks } from '../services/bookmarks';
import { ApiError } from '../services/http';
import { getOpportunityById } from '../services/opportunities';
import { useAuthStore } from '../store/authStore';
import type { Bookmark, Opportunity } from '../types/api';
import { formatDate, formatMillionsCOP } from '../utils/formatters';

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

function DetailSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="mb-8 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}
      </div>
    </div>
  );
}

export function OpportunityDetailPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const { id } = useParams();
  const opportunityId = Number(id);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBookmarkUpdating, setIsBookmarkUpdating] = useState(false);

  const currentBookmark = useMemo(
    () => bookmarks.find((bookmark) => bookmark.opportunity_id === opportunityId) ?? null,
    [bookmarks, opportunityId],
  );

  async function loadDetail() {
    if (!token || Number.isNaN(opportunityId)) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [opportunityResponse, bookmarksResponse] = await Promise.all([
        getOpportunityById(token, opportunityId),
        listBookmarks(token),
      ]);
      setOpportunity(opportunityResponse);
      setBookmarks(bookmarksResponse.items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setErrorMessage('Convocatoria no encontrada');
      } else if (error instanceof ApiError && error.status >= 500) {
        setErrorMessage('No se pudo cargar la convocatoria, SECOP no disponible');
      } else {
        setErrorMessage('No se pudo cargar la convocatoria. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDetail();
  }, [token, opportunityId]);

  async function toggleBookmark() {
    if (!token || !opportunity) return;
    setIsBookmarkUpdating(true);
    setErrorMessage(null);
    try {
      if (currentBookmark) {
        await deleteBookmark(token, currentBookmark.id);
        setBookmarks((current) => current.filter((bookmark) => bookmark.id !== currentBookmark.id));
      } else {
        const bookmark = await createBookmark(token, opportunity.id);
        setBookmarks((current) => [...current, bookmark]);
      }
    } catch {
      setErrorMessage('No fue posible actualizar el seguimiento de la convocatoria.');
    } finally {
      setIsBookmarkUpdating(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <button type="button" className="mb-6 text-sm font-semibold text-blue-700" onClick={() => navigate(-1)}>
        ← Volver a resultados
      </button>

      {isLoading && <DetailSkeleton />}

      {!isLoading && errorMessage && !opportunity && (
        <div className="alert-error">
          {errorMessage}
          <button type="button" className="ml-3 underline" onClick={() => void loadDetail()}>
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && opportunity && (
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {errorMessage && <div className="alert-error">{errorMessage}</div>}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">ID {opportunity.id}</span>
                <StatusBadge status={opportunity.status} />
              </div>
              <h1 className="text-3xl font-black uppercase leading-tight text-slate-950">{opportunity.title}</h1>
              <p className="mt-3 text-slate-600">{opportunity.entity_name} · República de Colombia</p>
            </div>
            <button type="button" className={currentBookmark ? 'button-primary' : 'button-secondary'} disabled={isBookmarkUpdating} onClick={() => void toggleBookmark()}>
              {currentBookmark ? '★ Dejar de seguir' : '☆ Seguir convocatoria'}
            </button>
          </div>

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <span>Presupuesto estimado</span>
              <strong>{formatMillionsCOP(opportunity.estimated_amount_cents)}</strong>
            </div>
            <div className="metric-card">
              <span>Fecha publicación</span>
              <strong>{formatDate(opportunity.published_at)}</strong>
            </div>
            <div className="metric-card">
              <span>Plazo máximo</span>
              <strong>{opportunity.closing_at ? formatDate(opportunity.closing_at) : 'No disponible en SECOP II'}</strong>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-950">Descripción del objeto contractual</h2>
            <p className="whitespace-pre-line leading-7 text-slate-700">{opportunity.description ?? 'Sin descripción disponible.'}</p>
          </section>

          {opportunity.detail_url && (
            <Link className="button-primary" to={opportunity.detail_url} target="_blank" rel="noreferrer">
              Ver en SECOP
            </Link>
          )}
        </article>
      )}
    </main>
  );
}
