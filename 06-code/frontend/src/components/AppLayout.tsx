import { Bookmark, LayoutDashboard, LogOut, Search, Star } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Panel de control', icon: LayoutDashboard },
  { to: '/search', label: 'Buscador', icon: Search },
  { to: '/bookmarks', label: 'Seguidas', icon: Star },
  { to: '/saved-searches', label: 'Guardadas', icon: Bookmark },
];

export function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {token && (
        <aside className="app-sidebar fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1E3A5F] text-white shadow-2xl">
          <Link to="/dashboard" className="app-sidebar-logo flex items-center gap-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-base font-black shadow-inner">PC</span>
            <span>
              <span className="block font-extrabold uppercase tracking-[0.16em] text-blue-100">Portal</span>
              <span className="block font-bold leading-tight">Convocatorias</span>
            </span>
          </Link>

          <nav className="mt-3 grid gap-1.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`app-sidebar-item flex items-center gap-2.5 rounded-r-xl border-l-4 font-bold transition ${
                    isActive
                      ? 'border-l-[#60A5FA] bg-white/15 text-white shadow-lg shadow-slate-950/10'
                      : 'border-l-transparent text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon aria-hidden="true" size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-3 pb-4">
            <button
              type="button"
              className="app-sidebar-logout flex w-full items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 font-bold text-white transition hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" size={20} />
              Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      <main className={token ? 'app-main-auth min-h-screen' : 'min-h-screen'}>
        <Outlet />
      </main>
    </div>
  );
}
