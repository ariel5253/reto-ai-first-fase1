import { Landmark } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10">
      <section className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-center text-xl font-bold text-slate-950">
          <Landmark aria-hidden="true" className="text-blue-700" />
          Portal de Convocatorias
        </Link>
        <Outlet />
      </section>
    </main>
  );
}
