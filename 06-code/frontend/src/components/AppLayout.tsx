import { LogOut } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Buscar' },
  { to: '/bookmarks', label: 'Seguidas' },
  { to: '/saved-searches', label: 'Búsquedas guardadas' },
];

export function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold text-slate-950">
            Portal de Convocatorias
          </Link>
          <div className="flex items-center gap-4">
            {token && (
              <>
                <div className="hidden items-center gap-3 md:flex">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-950'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
                <button type="button" className="button-secondary" onClick={handleLogout}>
                  <LogOut aria-hidden="true" size={16} />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
