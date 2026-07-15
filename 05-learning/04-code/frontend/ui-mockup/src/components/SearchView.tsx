import React, { useState, useMemo } from 'react';
import { Search, Filter, Bookmark, Info, Sparkles, SlidersHorizontal, ArrowUpDown, ChevronRight, RefreshCw, BookmarkCheck } from 'lucide-react';
import { Opportunity } from '../data';

interface SearchViewProps {
  opportunities: Opportunity[];
  bookmarks: number[];
  onToggleBookmark: (id: number, title: string) => void;
  onSelectOpportunity: (id: number) => void;
  onSaveSearch: (name: string, filters: { key: string; value: string }[]) => void;
  activeQuery: string;
  setActiveQuery: (q: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  opportunities,
  bookmarks,
  onToggleBookmark,
  onSelectOpportunity,
  onSaveSearch,
  activeQuery,
  setActiveQuery
}) => {
  // Filters State
  const [keyword, setKeyword] = useState<string>(activeQuery);
  const [entity, setEntity] = useState<string>('');
  const [status, setStatus] = useState<string>('todos'); // 'todos' | 'activo' | 'cerrado' | 'adjudicado'
  const [dateFrom, setDateFrom] = useState<string>('');

  // Prototype state overrides for Figma Evaluators
  const [mockState, setMockState] = useState<'normal' | 'cargando' | 'sin_resultados' | 'error_secop'>('normal');

  // Modal to save active search query
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [searchSaveName, setSearchSaveName] = useState<string>('');
  const [searchSavedToast, setSearchSavedToast] = useState<string | null>(null);

  // Sorting
  const [sortByAmount, setSortByAmount] = useState<'none' | 'asc' | 'desc'>('none');

  // Trigger search action
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(keyword);
    setMockState('normal');
  };

  const handleResetFilters = () => {
    setKeyword('');
    setActiveQuery('');
    setEntity('');
    setStatus('todos');
    setDateFrom('');
    setSortByAmount('none');
    setMockState('normal');
  };

  // Saved Search configuration trigger
  const handleSaveSearchClick = () => {
    if (!keyword && !entity && status === 'todos' && !dateFrom) {
      alert("Por favor configure al menos un filtro de búsqueda antes de guardar.");
      return;
    }
    setSearchSaveName(
      keyword ? `Búsqueda de ${keyword}` : `Filtro ${entity || 'Convocatorias'}`
    );
    setShowSaveModal(true);
  };

  const confirmSaveSearch = () => {
    if (!searchSaveName.trim()) return;

    const filtersArray = [];
    if (keyword) filtersArray.push({ key: 'keyword', value: keyword });
    if (entity) filtersArray.push({ key: 'entity', value: entity });
    if (status !== 'todos') filtersArray.push({ key: 'status', value: status });
    if (dateFrom) filtersArray.push({ key: 'date_from', value: dateFrom });

    onSaveSearch(searchSaveName, filtersArray);
    setShowSaveModal(false);

    setSearchSavedToast(`Búsqueda "${searchSaveName}" guardada con éxito en tu biblioteca.`);
    setTimeout(() => setSearchSavedToast(null), 4000);
  };

  // Convert amount cents to Millions COP
  const formatMillionsCOP = (cents: number) => {
    const cop = cents / 100;
    const millions = cop / 1000000;
    return `$${millions.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M COP`;
  };

  // Filter & Sort Opportunities based on actual API keys in memory
  const filteredOpportunities = useMemo(() => {
    let result = opportunities.filter((op) => {
      // 1. Keyword filter
      const matchesKeyword = !keyword || 
        op.title.toLowerCase().includes(keyword.toLowerCase()) || 
        op.description.toLowerCase().includes(keyword.toLowerCase()) ||
        op.id.toLowerCase().includes(keyword.toLowerCase());

      // 2. Entity filter
      const matchesEntity = !entity || 
        op.entity.toLowerCase().includes(entity.toLowerCase());

      // 3. Status filter
      const matchesStatus = status === 'todos' || op.status === status;

      // 4. Date From filter (simple comparison by published date year or direct inclusion)
      const matchesDate = !dateFrom || op.published_at.includes(dateFrom);

      return matchesKeyword && matchesEntity && matchesStatus && matchesDate;
    });

    if (sortByAmount === 'asc') {
      result = [...result].sort((a, b) => a.estimated_amount_cents - b.estimated_amount_cents);
    } else if (sortByAmount === 'desc') {
      result = [...result].sort((a, b) => b.estimated_amount_cents - a.estimated_amount_cents);
    }

    return result;
  }, [opportunities, keyword, entity, status, dateFrom, sortByAmount]);

  return (
    <div className="space-y-6 font-sans animate-fadeIn" id="search-root">
      
      {/* Toast Notification of Saved Search - Institutional style */}
      {searchSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001A3D] text-white py-3.5 px-5 rounded-xl shadow-xl border border-white/10 flex items-center justify-between space-x-4 animate-slideIn transition-all"
             style={{ borderLeft: '4px solid #1A7A4A' }}>
          <div className="flex items-center space-x-2.5 text-[13px] font-medium">
            <BookmarkCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{searchSavedToast}</span>
          </div>
          <button onClick={() => setSearchSavedToast(null)} className="text-white/50 hover:text-white text-lg font-bold ml-2 transition-colors cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Controller bar for Figma State evaluation */}
      <div className="bg-white p-4 rounded-2xl border border-gov-border flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="text-xs text-slate-700 font-semibold flex items-center space-x-1.5">
          <span className="text-gov-primary uppercase tracking-wide">🛠️ Prototipo:</span>
          <span className="text-slate-500 font-medium">Intercambie estados para comprobar la adaptabilidad de la tabla</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setMockState('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
              mockState === 'normal' ? 'bg-gov-primary text-white border-gov-primary shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-gov-border'
            }`}
          >
            📋 1. Con Datos (Normal)
          </button>
          <button 
            onClick={() => setMockState('cargando')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
              mockState === 'cargando' ? 'bg-gov-primary text-white border-gov-primary shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-gov-border'
            }`}
          >
            ⏳ 2. Cargando (Skeletons)
          </button>
          <button 
            onClick={() => setMockState('sin_resultados')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
              mockState === 'sin_resultados' ? 'bg-gov-primary text-white border-gov-primary shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-gov-border'
            }`}
          >
            🔍 3. Sin Resultados
          </button>
          <button 
            onClick={() => setMockState('error_secop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
              mockState === 'error_secop' ? 'bg-gov-primary text-white border-gov-primary shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-gov-border'
            }`}
          >
            🚫 4. Error SECOP Caído
          </button>
        </div>
      </div>

      {/* Advanced Filter Parameters Card */}
      <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs">
        <form onSubmit={handleApplyFilters} className="space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gov-border">
            <Filter className="h-4.5 w-4.5 text-gov-primary" />
            <h2 className="font-display font-bold text-base text-gov-primary uppercase tracking-wider">Buscador y Filtros de Convocatorias (SECOP II)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 1. Keyword search input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Palabra Clave (Título o ID)</label>
              <div className="relative rounded-lg border border-gov-border px-3 py-2 flex items-center bg-white transition-all focus-within:border-gov-primary focus-within:ring-3 focus-within:ring-gov-primary/20">
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <input 
                  type="text"
                  placeholder="Ej: software, vías, aulas..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#191c1e] focus:outline-hidden font-medium"
                />
              </div>
            </div>

            {/* 2. Entity filter — texto libre → ?entity= al backend (no hay endpoint de listado de entidades) */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Entidad Contratante</label>
              <div className="relative rounded-lg border border-gov-border bg-white px-3 py-2 flex items-center">
                <input
                  type="text"
                  placeholder="Ej: MinTIC, Gobernación..."
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* 3. Status filter */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estado del Proceso</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gov-border bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-gov-primary focus:ring-3 focus:ring-gov-primary/20 font-medium"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activo">Activo (Abierto)</option>
                <option value="cerrado">Cerrado (Evaluación)</option>
                <option value="adjudicado">Adjudicado (Finalizado)</option>
              </select>
            </div>

            {/* 4. Date from filter */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fecha de Publicación</label>
              <div className="relative rounded-lg border border-gov-border px-3 py-2 flex items-center bg-white transition-all focus-within:border-gov-primary focus-within:ring-3 focus-within:ring-gov-primary/20">
                <input 
                  type="text"
                  placeholder="Ej: 2026, /09/"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#191c1e] focus:outline-hidden font-medium"
                />
              </div>
            </div>

          </div>

          {/* Action buttons inside form */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-3 border-t border-gov-border">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              *Sincronizado vía API interna en tiempo real con SECOP II
            </p>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button 
                type="button"
                onClick={handleResetFilters}
                className="flex-1 sm:flex-none border border-gov-border text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
              >
                Limpiar Filtros
              </button>
              <button 
                type="button"
                onClick={handleSaveSearchClick}
                className="flex-1 sm:flex-none border border-gov-primary text-gov-primary hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
              >
                Guardar Búsqueda ★
              </button>
              <button 
                type="submit"
                className="flex-1 sm:flex-none bg-gov-primary hover:bg-[#003A80] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer uppercase tracking-wider"
              >
                Buscar Convocatorias
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* TABLE RESULTS AREA CONTAINER */}
      <div className="bg-white rounded-2xl border border-gov-border shadow-2xs overflow-hidden">
        
        {/* Table header control and info */}
        <div className="px-6 py-4 border-b border-gov-border bg-gov-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-xs font-bold text-gov-primary flex items-center uppercase tracking-wider">
              <span>Resultados de Oportunidades SECOP</span>
              <span className="ml-2 bg-blue-50 text-gov-primary border border-blue-100 font-mono font-black text-[10px] px-2 py-0.5 rounded-full">
                {mockState === 'normal' ? filteredOpportunities.length : 0} encontrados
              </span>
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Ordenar por Presupuesto:</span>
            <button 
              onClick={() => setSortByAmount(sortByAmount === 'desc' ? 'asc' : 'desc')}
              className="bg-white border border-gov-border px-3 py-1 rounded-lg font-bold hover:bg-slate-50 flex items-center space-x-1 cursor-pointer text-slate-700 text-xs"
            >
              <span>{sortByAmount === 'desc' ? 'Mayor a Menor' : sortByAmount === 'asc' ? 'Menor a Mayor' : 'Sin ordenar'}</span>
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* --- STATE DISPLAY 1: CARGANDO (SKELETON TABLE) --- */}
        {mockState === 'cargando' && (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-gov-border pb-4 last:border-0 last:pb-0 p-2 rounded-xl shimmer-effect">
                <div className="space-y-2 flex-1 pr-6">
                  <div className="h-4 bg-slate-200/60 rounded-sm w-3/4 animate-pulse" />
                  <div className="h-3 w-1/3 bg-slate-200/60 rounded-sm animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-slate-200/60 rounded-lg shrink-0 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* --- STATE DISPLAY 2: SIN RESULTADOS --- */}
        {mockState === 'sin_resultados' && (
          <div className="p-12 text-center max-w-lg mx-auto space-y-3" id="search-empty-state">
            <div className="bg-gov-surface p-4 rounded-full inline-block text-slate-400 border border-gov-border">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-gov-primary uppercase tracking-wide">No se encontraron convocatorias con estos filtros</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Intente flexibilizar los filtros de búsqueda o modifique la palabra clave para abarcar más procesos de contratación estatales.
            </p>
            <div className="pt-2">
              <button 
                onClick={handleResetFilters}
                className="bg-gov-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#003A80] transition-all cursor-pointer uppercase tracking-wider shadow-2xs"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        )}

        {/* --- STATE DISPLAY 3: ERROR SECOP OFFLINE --- */}
        {mockState === 'error_secop' && (
          <div className="p-12 text-center max-w-lg mx-auto space-y-3" id="secop-error-state">
            <div className="bg-red-50 text-gov-error p-4 rounded-full inline-block border border-red-200 animate-pulse">
              <Info className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-gov-error uppercase tracking-wide">El servicio SECOP no está disponible</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              No ha sido posible establecer comunicación segura con el servicio nacional de datos.gov.co / SECOP II. Por favor intente de nuevo.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setMockState('normal')}
                className="bg-gov-error text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#A93226] transition-all cursor-pointer uppercase tracking-wider shadow-2xs"
              >
                Reintentar Conexión
              </button>
            </div>
          </div>
        )}

        {/* --- STATE DISPLAY 4: NORMAL WITH TENDERS DATA --- */}
        {mockState === 'normal' && (
          <>
            {filteredOpportunities.length === 0 ? (
              <div className="p-12 text-center max-w-lg mx-auto space-y-3">
                <div className="bg-gov-surface p-4 rounded-full inline-block text-slate-400 border border-gov-border">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="font-display font-bold text-base text-gov-primary uppercase tracking-wider">No hay coincidencias</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  No se encontraron convocatorias para el término ingresado. Haga clic en Limpiar Filtros para volver a ver los {opportunities.length} de muestra.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={handleResetFilters}
                    className="bg-white border border-gov-border text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Restablecer Todo
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gov-surface border-b border-gov-border text-gov-primary uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-4 font-semibold">Identificador / Título de la Convocatoria</th>
                      <th className="p-4 font-semibold">Entidad Estatal</th>
                      <th className="p-4 font-semibold">Presupuesto Estimado</th>
                      <th className="p-4 font-semibold">Fecha Publicación</th>
                      <th className="p-4 font-semibold">Estado</th>
                      <th className="p-4 text-right font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOpportunities.map((op) => {
                      const isSaved = bookmarks.includes(op.id);
                      return (
                        <tr key={op.id} className="hover:bg-gov-surface/50 transition-colors">
                          <td className="p-4 max-w-sm">
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
                          <td className="p-4 text-slate-500 font-medium">
                            {op.published_at}
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
                                Ficha Técnica
                              </button>
                              
                              <button 
                                onClick={() => onToggleBookmark(op.id, op.title)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSaved 
                                    ? 'bg-[#E8F5EE] text-[#1A7A4A] border-[#A8D5B5]' 
                                    : 'bg-white hover:bg-[#FEF9E7] text-slate-400 hover:text-[#E3A134] border-gov-border hover:border-[#FCF3CF]'
                                }`}
                                title={isSaved ? "Quitar de seguidas" : "Guardar en seguidas"}
                              >
                                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
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
          </>
        )}

      </div>

      {/* --- SAVE SEARCH MODAL POPUP --- */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn animate-duration-150" id="save-search-modal">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gov-border shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gov-border">
              <h3 className="font-display font-bold text-sm text-gov-primary uppercase tracking-wider">Guardar Filtros de Búsqueda</h3>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 leading-relaxed font-medium">
                Asigne un nombre descriptivo a esta configuración de filtros para acceder a ella desde su Panel de Control o Biblioteca con un solo clic.
              </p>
              
              <div className="space-y-1">
                <label className="block font-bold text-slate-500 uppercase tracking-widest text-[9px]">Nombre de la Alerta de Búsqueda</label>
                <input 
                  type="text"
                  placeholder="Ej: Convocatorias de Desarrollo de Software"
                  value={searchSaveName}
                  onChange={(e) => setSearchSaveName(e.target.value)}
                  className="w-full rounded-lg border border-gov-border bg-white px-3 py-2.5 focus:border-gov-primary focus:ring-3 focus:ring-gov-primary/20 focus:outline-hidden text-slate-800 font-medium text-xs"
                />
              </div>

              {/* Print filter values that will be saved */}
              <div className="bg-gov-surface p-3 rounded-lg border border-gov-border space-y-1.5">
                <span className="font-bold text-slate-500 block text-[9px] uppercase tracking-wider">Configuración Guardada:</span>
                <div className="flex flex-wrap gap-1">
                  {keyword && <span className="bg-white border border-gov-border text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">keyword: {keyword}</span>}
                  {entity && <span className="bg-white border border-gov-border text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">entidad: {entity}</span>}
                  {status !== 'todos' && <span className="bg-white border border-gov-border text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">estado: {status}</span>}
                  {dateFrom && <span className="bg-white border border-gov-border text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">fecha: {dateFrom}</span>}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-gov-border">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="bg-white border border-gov-border text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmSaveSearch}
                className="bg-gov-success hover:bg-[#15603A] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer uppercase tracking-wider"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
