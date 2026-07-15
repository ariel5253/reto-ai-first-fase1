import React, { useState } from 'react';
import { LayoutDashboard, Search, Bookmark, FolderGit2, AlertTriangle, ArrowRight, CheckCircle2, XCircle, Clock, FileText, ChevronRight } from 'lucide-react';
import { Opportunity, SavedSearch } from '../data';

interface DashboardViewProps {
  opportunities: Opportunity[];
  savedSearches: SavedSearch[];
  bookmarks: number[]; // IDs numéricos — bigint de PostgreSQL
  onNavigate: (view: string) => void;
  onSelectOpportunity: (id: number) => void;
  onRunSavedSearch: (filters: { key: string; value: string }[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  opportunities,
  savedSearches,
  bookmarks,
  onNavigate,
  onSelectOpportunity,
  onRunSavedSearch
}) => {
  // Simulator States for Figma / QA Review
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  // Active opportunities (status: activo)
  const activeOpportunitiesCount = opportunities.filter(op => op.status === 'activo').length;

  // Bookmarked items
  const bookmarkedOps = opportunities.filter(op => bookmarks.includes(op.id));

  // Format amount to millions of COP
  const formatMillionsCOP = (cents: number) => {
    const cop = cents / 100;
    const millions = cop / 1000000;
    return `$${millions.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M`;
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn" id="dashboard-root">
      
      {/* State Preview Controller for Figma Review */}
      <div className="bg-white p-4 rounded-2xl border border-gov-border flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs text-slate-700">
          <span className="font-bold text-gov-primary uppercase tracking-wide">🛠️ Prototipo:</span>
          <span className="font-medium text-slate-500">Estados para revisión de diseño y QA</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setLoadingState(!loadingState)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              loadingState ? 'bg-gov-primary text-white border-gov-primary shadow-xs' : 'bg-white text-slate-700 border-gov-border hover:bg-slate-50'
            }`}
          >
            {loadingState ? '✓ Cargando: ON' : 'Simular: Cargando'}
          </button>
          <button 
            onClick={() => setApiHealthy(!apiHealthy)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              !apiHealthy ? 'bg-gov-error text-white border-gov-error shadow-xs' : 'bg-white text-slate-700 border-gov-border hover:bg-slate-50'
            }`}
          >
            {apiHealthy ? 'Simular: API Offline' : '✓ API Offline: ON'}
          </button>
        </div>
      </div>

      {/* --- 1. CARGANDO (SKELETON SIMULATION) --- */}
      {loadingState && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gov-border h-28 shimmer-effect space-y-3 shadow-2xs">
                <div className="h-3 w-16 bg-slate-200/60 rounded-sm" />
                <div className="h-8 w-24 bg-slate-200/60 rounded-sm" />
                <div className="h-3.5 w-20 bg-slate-200/60 rounded-sm" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gov-border h-64 shimmer-effect space-y-4 shadow-2xs">
              <div className="h-4 w-1/3 bg-slate-200/60 rounded-sm" />
              <div className="h-10 w-full bg-slate-100/50 rounded-sm" />
              <div className="h-10 w-full bg-slate-100/50 rounded-sm" />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gov-border h-64 shimmer-effect space-y-4 shadow-2xs">
              <div className="h-4 w-1/3 bg-slate-200/60 rounded-sm" />
              <div className="h-10 w-full bg-slate-100/50 rounded-sm" />
              <div className="h-10 w-full bg-slate-100/50 rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {/* --- 2. BACKEND OFFLINE STATE --- */}
      {!loadingState && !apiHealthy && (
        <div className="bg-white border border-gov-error/30 p-8 rounded-2xl text-center max-w-xl mx-auto space-y-4 shadow-xs animate-fadeIn" id="dashboard-backend-error">
          <div className="bg-red-50 text-gov-error p-4 rounded-full inline-block border border-red-100">
            <AlertTriangle className="h-10 w-10 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-gov-error uppercase tracking-wider">El servicio de base de datos no está disponible</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
              En este momento no es posible recuperar los indicadores debido a una latencia de comunicación con la API de datos.gov.co. Por favor intente recargar el módulo.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => setApiHealthy(true)}
              className="bg-gov-error hover:bg-[#A93226] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer uppercase tracking-wider"
            >
              Reintentar Conexión
            </button>
          </div>
        </div>
      )}

      {/* --- 3. NORMAL STATE (WITH DATA) --- */}
      {!loadingState && apiHealthy && (
        <>
          {/* Welcome and API Status Badge */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gov-border shadow-2xs gap-4">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-gov-primary tracking-tight uppercase">Panel de Control de Convocatorias</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Sincronización segura con datos.gov.co mediante la API del backend interno.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#E8F5EE] text-[#1A7A4A] border border-[#A8D5B5] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center uppercase tracking-wider">
                <span className="h-2 w-2 bg-[#1A7A4A] rounded-full mr-2 animate-pulse" />
                API activa
              </span>
            </div>
          </div>

          {/* KPI Dashboard Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* KPI 1: Active Opportunities */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-md transition-all duration-300 flex items-center space-x-4">
              <div className="bg-slate-50 text-gov-primary p-3.5 rounded-xl shrink-0 border border-gov-border">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Convocatorias Activas</p>
                <h3 className="text-3xl font-bold font-display text-gov-primary mt-0.5">{activeOpportunitiesCount}</h3>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Con vigencia 'activo' en SECOP II</p>
              </div>
            </div>

            {/* KPI 2: Followed Opportunities (Bookmarks) */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-md transition-all duration-300 flex items-center space-x-4">
              <div className="bg-emerald-50 text-gov-success p-3.5 rounded-xl shrink-0 border border-[#D1E7DD]">
                <Bookmark className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Convocatorias Seguidas</p>
                <h3 className="text-3xl font-bold font-display text-gov-success mt-0.5">{bookmarks.length}</h3>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">En tu lista de favoritos personales</p>
              </div>
            </div>

            {/* KPI 3: Saved Searches */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-md transition-all duration-300 flex items-center space-x-4">
              <div className="bg-[#FEF9E7] text-gov-accent p-3.5 rounded-xl shrink-0 border border-[#FCF3CF]">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Búsquedas Guardadas</p>
                <h3 className="text-3xl font-bold font-display text-gov-primary mt-0.5">{savedSearches.length}</h3>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Alertas automáticas configuradas</p>
              </div>
            </div>

          </div>

          {/* Quick Access Columns: Followed & Saved Searches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bookmarked / Followed quick list */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-gov-primary uppercase tracking-wide">Convocatorias Seguidas</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Acceso directo a las últimas oportunidades que sigues</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('bookmarks')}
                    className="text-xs text-gov-primary font-bold hover:underline flex items-center cursor-pointer uppercase tracking-wider"
                  >
                    Ver todas <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
                </div>

                {bookmarkedOps.length === 0 ? (
                  <div className="p-8 text-center bg-gov-surface rounded-xl border border-dashed border-gov-border space-y-2">
                    <Bookmark className="h-6 w-6 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-600 font-bold">No tienes convocatorias guardadas aún.</p>
                    <p className="text-[10px] text-slate-400">Busca en el buscador y presiona "Guardar en seguidas".</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookmarkedOps.slice(0, 4).map((op) => (
                      <div 
                        key={op.id} 
                        onClick={() => onSelectOpportunity(op.id)}
                        className="p-3 bg-gov-surface hover:bg-slate-50 rounded-xl border border-gov-border cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <h4 className="font-bold text-xs text-slate-700 truncate group-hover:text-gov-primary">{op.title}</h4>
                          <p className="text-[10px] text-slate-400 flex items-center space-x-2">
                            <span className="font-medium">{op.entity}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-gov-primary">{formatMillionsCOP(op.estimated_amount_cents)}</span>
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 border ${
                          op.status === 'activo' ? 'bg-[#E8F5EE] text-gov-success border-[#A8D5B5]' :
                          op.status === 'cerrado' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {op.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => onNavigate('search')}
                className="w-full bg-gov-primary hover:bg-[#003A80] text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-4 flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider shadow-2xs"
              >
                <span>Buscar Nuevas Oportunidades</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Saved searches quick actions list */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-gov-primary uppercase tracking-wide">Búsquedas Guardadas</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Re-ejecuta filtros configurados con un solo clic</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('saved-searches')}
                    className="text-xs text-gov-primary font-bold hover:underline flex items-center cursor-pointer uppercase tracking-wider"
                  >
                    Gestionar búsquedas <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
                </div>

                {savedSearches.length === 0 ? (
                  <div className="p-8 text-center bg-gov-surface rounded-xl border border-dashed border-gov-border space-y-2">
                    <FolderGit2 className="h-6 w-6 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-600 font-bold">No tienes búsquedas guardadas.</p>
                    <p className="text-[10px] text-slate-400">Crea búsquedas automáticas desde la pantalla del buscador.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedSearches.slice(0, 3).map((search) => (
                      <div 
                        key={search.id}
                        className="p-3.5 bg-gov-surface rounded-xl border border-gov-border flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <h4 className="font-bold text-xs text-slate-700 truncate">{search.name}</h4>
                          <div className="flex flex-wrap gap-1">
                            {search.filters.map((f, i) => (
                              <span key={i} className="bg-white border border-gov-border text-slate-500 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                                {f.key}: {f.value}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => onRunSavedSearch(search.filters)}
                          className="bg-gov-success hover:bg-[#15603A] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-all shrink-0 flex items-center space-x-1 cursor-pointer uppercase tracking-wider"
                        >
                          <span>Ejecutar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-gov-border text-xs text-slate-600 leading-relaxed font-medium">
                <span className="font-bold text-gov-primary block mb-0.5 uppercase tracking-wide">💡 Consejo de Uso:</span>
                Puedes registrar múltiples alertas guardadas para recibir alertas de correo internas del backend en cuanto se publiquen nuevos contratos.
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
