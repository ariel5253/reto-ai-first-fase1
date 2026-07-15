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
        <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#1E3A5F] text-white shadow-2xl">
          <Link to="/dashboard" className="flex items-center gap-3 px-6 py-7 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-black shadow-inner">PC</span>
            <span>
              <span className="block text-sm font-extrabold uppercase tracking-[0.18em] text-blue-100">Portal</span>
              <span className="block text-base font-bold leading-tight">Convocatorias</span>
            </span>
          </Link>

          <nav className="mt-4 grid gap-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-r-2xl border-l-4 px-4 py-3 text-sm font-bold transition ${
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

          <div className="mt-auto px-4 pb-6">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" size={20} />
              Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      <main className={token ? 'min-h-screen pl-72' : 'min-h-screen'}>
        <Outlet />
      </main>
    </div>
  );
}
