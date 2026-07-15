import { useState } from 'react';
import { 
  INITIAL_OPPORTUNITIES, 
  INITIAL_SAVED_SEARCHES, 
  Opportunity, 
  SavedSearch 
} from './data';
import { LandingView } from './components/LandingView';
import { LoginRegisterView } from './components/LoginRegisterView';
import { DashboardView } from './components/DashboardView';
import { SearchView } from './components/SearchView';
import { DetailView } from './components/DetailView';
import { SavedView } from './components/SavedView';
import { SystemStatesView } from './components/SystemStatesView';

import { 
  LayoutDashboard, 
  Search, 
  FolderGit2, 
  Bookmark, 
  LogOut, 
  Building2, 
  Bell, 
  HelpCircle, 
  Menu
} from 'lucide-react';

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Data states
  const [opportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  
  // IDs son number (bigint de PostgreSQL) — NO string
  const [bookmarks, setBookmarks] = useState<number[]>([1, 3]);

  const [activeQuery, setActiveQuery] = useState<string>('');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number>(1);

  // Notification count
  const [notificationCount, setNotificationCount] = useState<number>(2);

  // Toggle bookmarked status
  const handleToggleBookmark = (id: number, title: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
      showToast(`Removida de favoritas: "${title.substring(0, 30)}..."`, "info");
    } else {
      setBookmarks([...bookmarks, id]);
      showToast(`¡Convocatoria seguida con éxito! ★`, "success");
    }
  };

  // Run filter searches
  const handleRunSavedSearch = (filters: { key: string; value: string }[]) => {
    const kw = filters.find(f => f.key === 'keyword')?.value || '';
    setActiveQuery(kw);
    setCurrentView('search');
  };

  // Save searches to real state
  const handleSaveSearch = (name: string, filters: { key: string; value: string }[]) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      filters,
      created_at: new Date().toLocaleDateString('es-CO')
    };
    setSavedSearches([newSearch, ...savedSearches]);
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches(savedSearches.filter(s => s.id !== id));
  };

  // SOLO MOCKUP: en el producto real la landing redirige a /login — NO auto-login
  const handleSearchLaunch = (query: string) => {
    setActiveQuery(query);
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    showToast("¡Bienvenido al Portal de Convocatorias Públicas!", "success");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
    showToast("Sesión cerrada de forma segura", "info");
  };

  // Find currently selected opportunity object
  const activeOpportunity = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const handleSelectOpportunity = (id: number) => {
    setSelectedOpportunityId(id);
    setCurrentView('detail');
  };

  // Sidebar Links definition matching exactly Colombian required items
  const sidebarLinks = [
    { view: 'dashboard', label: 'Panel de Control', icon: <LayoutDashboard className="h-5 w-5" /> },
    { view: 'search', label: 'Buscador', icon: <Search className="h-5 w-5" /> },
    { view: 'saved-searches', label: 'Búsquedas Guardadas', icon: <FolderGit2 className="h-5 w-5" /> },
    { view: 'bookmarks', label: 'Convocatorias Seguidas', icon: <Bookmark className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col relative font-sans" id="app-root">
      
      {/* -------------------- INTERNAL LOGGED IN SHELL -------------------- */}
      {isLoggedIn && currentView !== 'landing' && currentView !== 'login' && currentView !== 'register' ? (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          
          {/* Mobile Sidebar overlay toggles */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Left Side Navigation bar */}
          <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#001A3D] text-slate-300 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            
            <div className="p-6">
              {/* Brand Logo */}
              <div className="flex items-center space-x-3 pb-6 border-b border-white/10 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
                <div className="bg-[#002F6C] text-white p-2 rounded-lg shadow-2xs">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-lg text-white tracking-tight uppercase">Portal Convocatorias</span>
                  <p className="text-[9px] text-[#E3A134] tracking-widest uppercase font-bold">Colombia Compra Eficiente</p>
                </div>
              </div>

              {/* Navigation Tabs list */}
              <nav className="mt-8 space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = currentView === link.view || (link.view === 'search' && currentView === 'detail');
                  return (
                    <button
                      key={link.view}
                      onClick={() => {
                        setCurrentView(link.view);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-[#003A80] text-white shadow-xs border-l-[3px] border-[#E3A134] rounded-l-none'
                          : 'text-slate-300 hover:bg-[#002459] hover:text-white'
                      }`}
                    >
                      {link.icon}
                      <span className="font-sans">{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Admin Profile bottom card */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-[#002459]/50 rounded-xl">
                <div className="h-9 w-9 bg-[#E3A134] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  JS
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Juan Sebastián Gómez</p>
                  <p className="text-[10px] text-slate-400 truncate">Ministerio de las TIC</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#002459] p-2 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </aside>

          {/* Right Work area content */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Top workspace nav bar */}
            <header className="bg-white border-b border-[#E2E6ED] h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
              
              {/* Left toggles */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-outline hover:text-on-surface p-1.5 rounded-lg border border-outline-variant/60"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Instant Workspace Indicator */}
                <div className="hidden sm:flex items-center space-x-2 text-xs font-medium">
                  <span className="text-[#9AA5B4]">Portal de Convocatorias Públicas</span>
                  <span className="text-[#D1D9E0]">/</span>
                  <span className="font-semibold text-[#002F6C] uppercase tracking-wider font-sans">
                    {currentView === 'bookmarks' ? 'Convocatorias Seguidas' : 
                     currentView === 'saved-searches' ? 'Búsquedas Guardadas' : 
                     currentView === 'search' ? 'Buscador de Convocatorias' : 
                     currentView === 'detail' ? 'Detalle de Convocatoria' : 
                     currentView === 'dashboard' ? 'Panel de Control' : 
                     currentView === 'system-states' ? 'Estados de Sistema' : currentView}
                  </span>
                </div>
              </div>

              {/* Right workspace widgets */}
              <div className="flex items-center space-x-4">
                
                {/* Simulated Notification count bell */}
                <button 
                  onClick={() => { setNotificationCount(0); showToast("Notificaciones marcadas como leídas. Sincronización al día.", "success"); }}
                  className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                  title="Ver Notificaciones"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-[#C0392B] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => showToast("Asistente Virtual: Para cualquier inquietud técnica, por favor comuníquese a soporte@convocatoriaspublicas.gov.co.", "info")}
                  className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                  title="Ayuda Técnica"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>

                {/* Avatar action dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 border border-slate-200 rounded-full p-1 hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-7 w-7 bg-[#E3A134] text-white rounded-full flex items-center justify-center font-bold text-xs font-sans">
                      JS
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-slate-700 px-1 font-sans">Juan S.</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 text-xs">
                        <p className="font-bold text-slate-800">Organización</p>
                        <p className="text-slate-500 text-[10px]">Ministerio de las TIC</p>
                      </div>
                      <button 
                        onClick={() => { setShowProfileDropdown(false); showToast("Firma digital de proponente validada con éxito.", "success"); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                      >
                        Ver Certificado Digital
                      </button>
                      <button 
                        onClick={() => { setShowProfileDropdown(false); setCurrentView('system-states'); }}
                        className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 font-semibold border-t border-slate-100 flex items-center space-x-1"
                      >
                        <span>🛠️ Estados de Sistema</span>
                      </button>
                      <button 
                        onClick={() => { setShowProfileDropdown(false); handleLogout(); }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold border-t border-slate-100"
                      >
                        Cerrar Sesión Segura
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </header>

            {/* Dynamic workspace wrapper */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24">
              {currentView === 'dashboard' && (
                <DashboardView 
                  opportunities={opportunities}
                  savedSearches={savedSearches}
                  bookmarks={bookmarks}
                  onNavigate={setCurrentView}
                  onSelectOpportunity={handleSelectOpportunity}
                  onRunSavedSearch={handleRunSavedSearch}
                />
              )}

              {currentView === 'search' && (
                <SearchView 
                  opportunities={opportunities}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectOpportunity={handleSelectOpportunity}
                  onSaveSearch={handleSaveSearch}
                  activeQuery={activeQuery}
                  setActiveQuery={setActiveQuery}
                />
              )}

              {currentView === 'detail' && (
                <DetailView 
                  opportunity={activeOpportunity}
                  isBookmarked={bookmarks.includes(activeOpportunity.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onBack={() => { setCurrentView('search'); }}
                />
              )}

               {currentView === 'bookmarks' && (
                <SavedView 
                  opportunities={opportunities}
                  bookmarks={bookmarks}
                  savedSearches={savedSearches}
                  onToggleBookmark={handleToggleBookmark}
                  onRunSavedSearch={handleRunSavedSearch}
                  onDeleteSavedSearch={handleDeleteSavedSearch}
                  onSelectOpportunity={handleSelectOpportunity}
                  mode="bookmarks"
                />
              )}

               {currentView === 'saved-searches' && (
                <SavedView 
                  opportunities={opportunities}
                  bookmarks={bookmarks}
                  savedSearches={savedSearches}
                  onToggleBookmark={handleToggleBookmark}
                  onRunSavedSearch={handleRunSavedSearch}
                  onDeleteSavedSearch={handleDeleteSavedSearch}
                  onSelectOpportunity={handleSelectOpportunity}
                  mode="searches"
                />
              )}

              {/* SystemStatesView — SOLO MOCKUP, no implementar en el producto real */}
              {currentView === 'system-states' && (
                <SystemStatesView />
              )}
            </main>

          </div>

        </div>
      ) : (
        /* -------------------- PUBLIC VISITOR VIEW (LANDING, LOGIN, REGISTER) -------------------- */
        <div className="flex-1 flex flex-col">
          {currentView === 'landing' && (
            <LandingView 
              onNavigate={setCurrentView}
              onSearch={handleSearchLaunch}
            />
          )}

          {currentView === 'login' && (
            <LoginRegisterView 
              initialMode="login"
              onNavigate={setCurrentView}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentView === 'register' && (
            <LoginRegisterView 
              initialMode="register"
              onNavigate={setCurrentView}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      )}

      {/* Institutional Global Toast Notification */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-[#001A3D] text-white py-3.5 px-5 rounded-xl shadow-xl border border-white/10 flex items-center justify-between space-x-4 animate-slideIn transition-all" 
          style={{ borderLeft: `4px solid ${toast.type === 'success' ? '#1A7A4A' : toast.type === 'warning' ? '#E3A134' : '#003A80'}` }}
          id="app-global-toast"
        >
          <div className="flex items-center space-x-2.5 text-[13px] font-medium font-sans">
            <span 
              className="h-2.5 w-2.5 rounded-full animate-pulse inline-block" 
              style={{ backgroundColor: toast.type === 'success' ? '#1A7A4A' : toast.type === 'warning' ? '#E3A134' : '#003A80' }}
            />
            <span>{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-white/50 hover:text-white text-lg font-bold ml-2 transition-colors duration-150 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
