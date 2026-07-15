import React, { useState } from 'react';
import { Bookmark, Search, Trash2, Play, Calendar, FolderGit2, X, ExternalLink } from 'lucide-react';
import { Opportunity, SavedSearch } from '../data';

interface SavedViewProps {
  opportunities: Opportunity[];
  bookmarks: number[];
  savedSearches: SavedSearch[];
  onToggleBookmark: (id: number, title: string) => void;
  onRunSavedSearch: (filters: { key: string; value: string }[]) => void;
  onDeleteSavedSearch: (id: string) => void;
  onSelectOpportunity: (id: number) => void;
  mode: 'bookmarks' | 'searches';
}

export const SavedView: React.FC<SavedViewProps> = ({
  opportunities,
  bookmarks,
  savedSearches,
  onToggleBookmark,
  onRunSavedSearch,
  onDeleteSavedSearch,
  onSelectOpportunity,
  mode
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter bookmarked opportunities
  const bookmarkedOps = opportunities.filter(op => bookmarks.includes(op.id));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRemoveBookmark = (id: number, title: string) => {
    onToggleBookmark(id, title);
    showToast(`Removida de convocatorias seguidas: "${title.substring(0, 30)}..."`);
  };

  const handleDeleteSearch = (id: string, name: string) => {
    onDeleteSavedSearch(id);
    showToast(`Búsqueda eliminada: "${name}"`);
  };

  // Convert amount cents to Millions COP
  const formatMillionsCOP = (cents: number) => {
    const cop = cents / 100;
    const millions = cop / 1000000;
    return `$${millions.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M COP`;
  };

  return (
    <div className="space-y-6 font-sans animate-fadeIn" id="saved-view-root">
      
      {/* Toast Interno de Biblioteca - Styled to match global toasts */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001A3D] text-white py-3.5 px-5 rounded-xl shadow-xl border border-white/10 flex items-center justify-between space-x-4 animate-slideIn transition-all"
             style={{ borderLeft: '4px solid #1A7A4A' }}>
          <div className="flex items-center space-x-2.5 text-[13px] font-medium">
            <span className="h-2.5 w-2.5 bg-emerald-400 rounded-full animate-pulse inline-block shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/50 hover:text-white text-lg font-bold ml-2 transition-colors cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs">
        <h1 className="font-display font-extrabold text-2xl text-gov-primary tracking-tight uppercase">
          {mode === 'bookmarks' ? 'Convocatorias Seguidas' : 'Búsquedas Guardadas'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {mode === 'bookmarks' 
            ? 'Monitoree los procesos de contratación pública de su interés y acceda a las adendas del SECOP II.' 
            : 'Gestione y re-ejecute rápidamente sus configuraciones de filtros avanzados.'}
        </p>
      </div>

      {/* --- TAB CONTENT 1: CONVOCATORIAS SEGUIDAS (BOOKMARKS) --- */}
      {mode === 'bookmarks' && (
        <div id="bookmarks-container">
          {bookmarkedOps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gov-border p-12 text-center max-w-xl mx-auto space-y-4 shadow-3xs my-8">
              <div className="bg-slate-50 border border-gov-border text-gov-primary p-4 rounded-full inline-block">
                <Bookmark className="h-10 w-10 shrink-0" />
              </div>
              <h3 className="font-display font-bold text-lg text-gov-primary uppercase tracking-wide">No tienes convocatorias guardadas aún</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Busca oportunidades en el buscador institucional y presiona "Guardar en seguidas ★" para realizar un monitoreo técnico estructurado de pliegos y adendas.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gov-border shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gov-surface border-b border-gov-border text-gov-primary uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-4 font-semibold">Identificador / Título</th>
                      <th className="p-4 font-semibold">Entidad Contratante</th>
                      <th className="p-4 font-semibold">Presupuesto</th>
                      <th className="p-4 font-semibold">Estado</th>
                      <th className="p-4 text-right font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookmarkedOps.map((op) => (
                      <tr key={op.id} className="hover:bg-gov-surface/50 transition-colors">
                        <td className="p-4 max-w-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] text-slate-400 font-bold bg-gov-surface border border-gov-border px-1.5 py-0.5 rounded-md">
                              {op.id}
                            </span>
                            <h4 
                              onClick={() => onSelectOpportunity(op.id)}
                              className="font-bold text-xs text-gov-primary hover:text-[#003A80] cursor-pointer line-clamp-2 leading-tight"
                            >
                              {op.title}
                            </h4>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-bold">
                          {op.entity}
                        </td>
                        <td className="p-4 text-gov-primary font-bold">
                          {formatMillionsCOP(op.estimated_amount_cents)}
                        </td>
                        <td className="p-4">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            op.status === 'activo' ? 'bg-[#E8F5EE] text-[#1A7A4A] border-[#A8D5B5]' :
                            op.status === 'cerrado' ? 'bg-[#F1F3F5] text-[#495057] border-[#CED4DA]' : 
                            'bg-[#E8F0FE] text-[#1A73E8] border-[#AECBFC]'
                          }`}>
                            {op.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => onSelectOpportunity(op.id)}
                              className="bg-white hover:bg-gov-surface text-gov-primary px-3 py-1.5 rounded-lg border border-gov-border text-xs font-bold transition-all shadow-3xs cursor-pointer uppercase tracking-wider"
                            >
                              Ver Detalle
                            </button>
                            <button 
                              onClick={() => handleRemoveBookmark(op.id, op.title)}
                              className="text-gov-error hover:text-white hover:bg-gov-error p-1.5 rounded-lg border border-red-200 hover:border-gov-error transition-all cursor-pointer"
                              title="Eliminar favorito"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT 2: BÚSQUEDAS GUARDADAS --- */}
      {mode === 'searches' && (
        <div id="searches-container">
          {savedSearches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gov-border p-12 text-center max-w-xl mx-auto space-y-4 shadow-3xs my-8">
              <div className="bg-[#FEF9E7] text-gov-accent p-4 rounded-full inline-block border border-[#FCF3CF]">
                <FolderGit2 className="h-10 w-10 shrink-0" />
              </div>
              <h3 className="font-display font-bold text-lg text-gov-primary uppercase tracking-wide">No tienes búsquedas guardadas</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Configure filtros personalizados en el buscador de oportunidades y presione "Guardar Búsqueda" para archivar y re-ejecutar consultas complejas fácilmente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedSearches.map((search) => (
                <div 
                  key={search.id}
                  className="bg-white p-5 rounded-2xl border border-gov-border shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gov-primary/40 transition-all shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-display font-bold text-sm text-gov-primary uppercase tracking-wide">{search.name}</h4>
                      <span className="text-[9px] font-bold uppercase text-slate-400 bg-gov-surface border border-gov-border px-2.5 py-0.5 rounded-full">
                        Fecha: {search.created_at}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mr-1">Filtros aplicados:</span>
                      {search.filters.map((f, i) => (
                        <span key={i} className="bg-gov-surface text-slate-600 text-[9px] px-2 py-0.5 rounded-md border border-gov-border font-bold uppercase">
                          {f.key}: <strong className="text-gov-primary">{f.value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                    <button 
                      onClick={() => onRunSavedSearch(search.filters)}
                      className="bg-gov-success hover:bg-[#15603A] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer uppercase tracking-wider"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Ejecutar de nuevo</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteSearch(search.id, search.name)}
                      className="text-gov-error hover:bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      title="Eliminar búsqueda guardada"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
