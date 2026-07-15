import React, { useState } from 'react';
import { Search, ShieldAlert, Bookmark, BrainCircuit, FileSpreadsheet, LogIn, UserPlus, Building2, ChevronRight, TrendingUp } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const featureCards = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-gov-primary" />,
      title: "Búsqueda Unificada",
      desc: "Consulta convocatorias públicas de múltiples portales del Estado (SECOP I, SECOP II y datos.gov.co) desde un único motor de búsqueda estructurado.",
      color: "border-l-3 border-gov-primary hover:shadow-md"
    },
    {
      icon: <Bookmark className="h-8 w-8 text-gov-success" />,
      title: "Seguimiento de Oportunidades",
      desc: "Guarda convocatorias favoritas en tu biblioteca digital. Organiza tus postulaciones y haz seguimiento al estado del proceso contractual.",
      color: "border-l-3 border-gov-success hover:shadow-md"
    },
    {
      icon: <ShieldAlert className="h-8 w-8 text-gov-accent" />,
      title: "Alertas y Notificaciones",
      desc: "Configura alertas automatizadas sobre plazos de entrega de propuestas, respuestas a observaciones del pliego y adendas publicadas.",
      color: "border-l-3 border-gov-accent hover:shadow-md"
    },
    {
      icon: <FileSpreadsheet className="h-8 w-8 text-blue-700" />,
      title: "Datos Estructurados",
      desc: "Información normalizada con códigos de clasificación de bienes y servicios (UNSPSC), presupuestos en COP y cronogramas consolidados.",
      color: "border-l-3 border-blue-700 hover:shadow-md"
    }
  ];

  const recentTendersHighlights = [
    { id: "CO-MIN-TIC-2026-004", title: "Implementación del Sistema Unificado de Gestión de Trámites Ciudadanos", budget: "$4.500M COP", daysLeft: "14 días" },
    { id: "CO-ANT-EDU-2026-055", title: "Modernización Tecnológica de Aulas de Aprendizaje Rurales", budget: "$6.200M COP", daysLeft: "21 días" },
    { id: "CO-BOG-SDA-2026-012", title: "Optimización de la Red de Monitoreo de Calidad del Aire", budget: "$2.800M COP", daysLeft: "7 días" }
  ];

  return (
    <div className="min-h-screen bg-gov-surface flex flex-col font-sans" id="landing-page-root">
      {/* Institutional Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gov-border shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-gov-primary text-white p-2 rounded-lg shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-gov-primary tracking-tight uppercase">Portal de Convocatorias</span>
              <p className="text-[9px] text-slate-500 tracking-wider uppercase font-bold">Contratación Pública - Colombia</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-gov-primary transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Acceder</span>
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-gov-primary hover:bg-[#003A80] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Registrarse</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with dark blue gradient requested */}
      <section className="relative bg-gradient-to-b from-[#001A3D] to-[#002F6C] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
            alt="Modern business center architecture" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Subtle decorative grid background for tech feeling */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white mb-6 backdrop-blur-xs border border-white/10 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-[#E3A134] animate-pulse" />
            Acceso unificado a oportunidades del SECOP II y datos.gov.co
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Simplifica tu búsqueda de <br />
            <span className="text-[#E3A134] bg-clip-text font-display">Convocatorias Públicas</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-slate-300 mb-10 leading-relaxed font-medium">
            Plataforma inteligente de consulta para la contratación estatal colombiana. Búsqueda unificada, alertas en tiempo real y seguimiento automatizado de pliegos definitivos.
          </p>

          {/* Clean Integrated Search Bar - with hard shadow */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-2 flex flex-col sm:flex-row items-center gap-2 border border-slate-100">
            <div className="relative flex-1 w-full flex items-center px-3">
              <Search className="text-slate-400 h-5 w-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Ej: desarrollo de software, mantenimiento de vías, interventoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#191c1e] py-3 focus:outline-hidden text-sm placeholder:text-slate-400 font-medium"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-[#E3A134] hover:bg-[#c98e2b] text-[#001A3D] px-6 py-3 rounded-lg font-bold text-xs transition-all shadow-sm shrink-0 uppercase tracking-wider cursor-pointer"
            >
              Buscar Convocatorias
            </button>
          </form>

          {/* Quick Stats Banner */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-3xl font-extrabold text-white font-display">15.4K+</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Procesos activos</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#E3A134] font-display">$14.6B COP</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Presupuesto consolidado</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-display">100%</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Consumo vía API</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#E3A134] font-display">Diario</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sincronización de SECOP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="main-content">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl text-gov-primary tracking-tight">
            Herramientas Tecnológicas para Contratistas del Estado
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto leading-relaxed">
            Optimizamos el análisis de las oportunidades públicas mediante un flujo estructurado de datos limpios y herramientas avanzadas.
          </p>
        </div>

        {/* Bento Grid Features - White background, left border 3px, shadow hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {featureCards.map((feat, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-8 rounded-2xl border border-gov-border shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${feat.color} flex flex-col justify-between`}
            >
              <div>
                <div className="mb-4 bg-gov-surface p-3 rounded-xl inline-block">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-gov-primary mb-2 uppercase tracking-wide">{feat.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6 font-medium">{feat.desc}</p>
              </div>
              <button 
                onClick={() => onSearch("")}
                className="text-gov-primary hover:text-[#003A80] font-bold text-xs flex items-center mt-auto transition-colors uppercase tracking-wider"
              >
                <span>Explorar buscador →</span>
              </button>
            </div>
          ))}
        </div>

        {/* Live Tender Feed Highlights preview */}
        <div className="bg-white rounded-2xl p-8 border border-gov-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-gov-primary uppercase tracking-wider">Destacados del SECOP II</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Convocatorias de alto presupuesto publicadas recientemente por entidades oficiales.</p>
            </div>
            <button 
              onClick={() => onSearch("")}
              className="text-gov-primary hover:underline text-xs font-bold mt-2 sm:mt-0 uppercase tracking-wider"
            >
              Ver todas las convocatorias →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTendersHighlights.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSearch("")}
                className="bg-gov-surface p-5 rounded-xl border border-gov-border hover:border-gov-primary/40 cursor-pointer transition-all shadow-2xs group hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[9px] text-slate-400 font-bold bg-white border border-gov-border px-2 py-0.5 rounded-md">{item.id}</span>
                  <span className="bg-[#E8F5EE] text-[#1A7A4A] text-[9px] px-2 py-0.5 rounded-full font-bold border border-[#A8D5B5] uppercase">Activo</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-gov-primary line-clamp-2 mb-4 h-10 leading-tight">
                  {item.title}
                </h4>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-gov-border">
                  <span className="text-[11px]">Presupuesto: <strong className="text-gov-primary">{item.budget}</strong></span>
                  <span className="text-[#E3A134] font-bold text-[11px]">{item.daysLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#001A3D] text-slate-300 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-8 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white tracking-tight uppercase">Portal de Convocatorias</span>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Contratación Estatal - Colombia</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('landing')}>Inicio</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => onSearch("")}>Buscador</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => onNavigate('login')}>Portal Interno</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-medium">
            <p>© 2026 Portal de Convocatorias Públicas - Colombia. Sincronizado mediante consumo de API interna conectada a datos.gov.co.</p>
            <p className="mt-2 sm:mt-0 uppercase tracking-wider font-bold text-slate-600">Colombia Compra Eficiente</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
