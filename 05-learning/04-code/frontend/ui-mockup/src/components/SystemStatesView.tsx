import React, { useState } from 'react';
import { WifiOff, RefreshCw, Lock, Clock, Play, FileSearch, CheckCircle, AlertCircle, X } from 'lucide-react';

export const SystemStatesView: React.FC = () => {
  const [activeError, setActiveError] = useState<'none' | 'cargando' | 'sin_resultados' | 'error_backend' | 'sesion_expirada' | 'acceso_no_autorizado'>('none');
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerLoading = () => {
    setActiveError('cargando');
    setLoadingSimulation(true);
    setTimeout(() => {
      setLoadingSimulation(false);
      setActiveError('none');
      showToast("Sistemas sincronizados exitosamente con el backend.");
    }, 2500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 font-sans" id="system-states-root">
      
      {/* Toast interno */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002F6C] text-white py-3.5 px-5 rounded-xl shadow-xl border border-white/10 flex items-center justify-between space-x-4 animate-slideIn">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-emerald-400 font-bold">● Portal:</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-300 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-2xs">
        <h1 className="font-display font-extrabold text-2xl text-primary-brand tracking-tight">Estados de Error y de Carga</h1>
        <p className="text-sm text-on-surface-variant">
          Este módulo de diseño institucional simula y valida las respuestas de la interfaz ante fallos técnicos, latencias de red y estados lógicos del flujo del producto.
        </p>
      </div>

      {/* Controller Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <button 
          onClick={() => setActiveError('cargando')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            activeError === 'cargando' ? 'bg-blue-50 text-link-action border-blue-300' : 'bg-white hover:bg-surface border-outline-variant'
          }`}
        >
          ⏳ 1. Cargando
        </button>
        <button 
          onClick={() => setActiveError('sin_resultados')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            activeError === 'sin_resultados' ? 'bg-gray-50 text-on-surface border-gray-300' : 'bg-white hover:bg-surface border-outline-variant'
          }`}
        >
          🔍 2. Sin Resultados
        </button>
        <button 
          onClick={() => setActiveError('error_backend')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            activeError === 'error_backend' ? 'bg-red-50 text-error-alert border-red-300' : 'bg-white hover:bg-surface border-outline-variant'
          }`}
        >
          🚫 3. Error de Backend
        </button>
        <button 
          onClick={() => setActiveError('sesion_expirada')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            activeError === 'sesion_expirada' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-white hover:bg-surface border-outline-variant'
          }`}
        >
          ⌛ 4. Sesión Expirada
        </button>
        <button 
          onClick={() => setActiveError('acceso_no_autorizado')}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            activeError === 'acceso_no_autorizado' ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-white hover:bg-surface border-outline-variant'
          }`}
        >
          🔒 5. Acceso No Autorizado
        </button>
        <button 
          onClick={triggerLoading}
          className="px-3 py-2.5 rounded-xl text-xs font-bold bg-primary-brand text-white hover:bg-primary-container transition-all flex items-center justify-center space-x-1"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Simular Flujo</span>
        </button>
      </div>

      {/* --- RENDER SIMULATED STATES --- */}
      <div className="bg-white p-8 rounded-2xl border border-outline-variant/80 min-h-[340px] flex items-center justify-center relative shadow-xs">
        
        {/* Helper tag */}
        <span className="absolute top-4 left-4 bg-surface text-outline font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-outline-variant/40">
          Visualizador de Estado de UX/UI
        </span>

        {/* 1. Normal State / No errors active */}
        {activeError === 'none' && !loadingSimulation && (
          <div className="text-center max-w-md space-y-4 animate-fadeIn">
            <div className="bg-emerald-50 text-success-saved p-4 rounded-full inline-block border border-emerald-200">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#002F6C]">Todos los Sistemas Operativos</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Selecciona uno de los cinco estados estandarizados en la barra superior para evaluar la resiliencia de la interfaz institucional y la coherencia del diseño visual.
              </p>
            </div>
          </div>
        )}

        {/* 2. State: Cargando (Loading simulation with beautiful shimmers) */}
        {activeError === 'cargando' && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-4">
              <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4.5 w-1/4 rounded-sm bg-slate-200 animate-pulse" />
                <div className="h-3.5 w-1/3 rounded-sm bg-slate-200 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="h-14 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-14 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-14 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        )}

        {/* 3. State: Sin Resultados (No search results match) */}
        {activeError === 'sin_resultados' && (
          <div className="text-center max-w-md space-y-4 animate-fadeIn">
            <div className="bg-gray-100 text-outline p-4 rounded-full inline-block border border-outline-variant/60">
              <FileSearch className="h-10 w-10 text-slate-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-primary-brand">Búsqueda sin Resultados</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                No se encontraron convocatorias públicas vigentes que coincidan con los criterios establecidos. Intente modificar los términos clave o relajar los filtros aplicados.
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => setActiveError('none')}
                className="bg-[#002F6C] hover:bg-[#004B87] text-white px-5 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Restaurar Filtros
              </button>
            </div>
          </div>
        )}

        {/* 4. State: Error de Backend (API connection failure/timeout) */}
        {activeError === 'error_backend' && (
          <div className="text-center max-w-md space-y-4 animate-fadeIn">
            <div className="bg-red-50 text-error-alert p-4 rounded-full inline-block border border-red-200">
              <WifiOff className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-red-950">Fallo de Comunicación con el Servidor</h3>
              <p className="text-xs text-red-800 leading-relaxed mt-1">
                No ha sido posible conectar con la API interna del backend para recuperar los datos de SECOP II. Por favor, intente de nuevo en unos minutos. Si el problema persiste, contacte con el soporte técnico.
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => { triggerLoading(); }}
                className="bg-red-800 hover:bg-red-950 text-white px-5 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Reintentar Conexión
              </button>
            </div>
          </div>
        )}

        {/* 5. State: Sesión Expirada (Session expired) */}
        {activeError === 'sesion_expirada' && (
          <div className="text-center max-w-md space-y-4 animate-fadeIn">
            <div className="bg-amber-50 text-amber-800 p-4 rounded-full inline-block border border-amber-200">
              <Clock className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-amber-950">Sesión de Usuario Expirada</h3>
              <p className="text-xs text-amber-800 leading-relaxed mt-1">
                Por motivos de seguridad y de acuerdo con el protocolo de protección de datos estatales, su sesión ha expirado tras 30 minutos de inactividad detectada.
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => { showToast("Simulando redirección a pantalla de autenticación..."); }}
                className="bg-[#E3A134] hover:bg-[#c98e2b] text-primary-brand px-5 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Iniciar Sesión de Nuevo
              </button>
            </div>
          </div>
        )}

        {/* 6. State: Acceso No Autorizado (Permission denied / login required) */}
        {activeError === 'acceso_no_autorizado' && (
          <div className="text-center max-w-md space-y-4 animate-fadeIn">
            <div className="bg-purple-50 text-purple-800 p-4 rounded-full inline-block border border-purple-200">
              <Lock className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-purple-950">Acceso No Autorizado</h3>
              <p className="text-xs text-purple-800 leading-relaxed mt-1">
                Su cuenta de proponente no posee los permisos lógicos o el certificado digital validado para acceder a los datos estructurados de este proceso específico.
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => { showToast("Solicitud de elevación de perfil enviada a revisión."); }}
                className="bg-purple-800 hover:bg-purple-950 text-white px-5 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Elevar Permisos de Proponente
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Double Shimmer Demonstration of skeletons */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-2xs space-y-6">
        <div>
          <h3 className="font-display font-bold text-sm text-primary-brand">Esqueleto de Carga (Skeletons Shimmer)</h3>
          <p className="text-xs text-on-surface-variant">
            Ejemplo de animación de marcador de posición utilizado para prevenir saltos de maquetación (Layout shifts) durante la carga asíncrona de convocatorias públicas:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/60 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-3 w-10 rounded-md bg-slate-200 animate-pulse" />
            </div>
            <div className="h-5 w-4/5 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded-md bg-slate-200 animate-pulse" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-6 w-20 rounded-md bg-slate-200 animate-pulse" />
            </div>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-outline-variant/60 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-3 w-10 rounded-md bg-slate-200 animate-pulse" />
            </div>
            <div className="h-5 w-4/5 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded-md bg-slate-200 animate-pulse" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-6 w-20 rounded-md bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
