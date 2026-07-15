import React, { useState } from 'react';
import { Building2, KeyRound, Mail, User, ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface LoginRegisterViewProps {
  initialMode?: 'login' | 'register';
  onNavigate: (view: string) => void;
  onLoginSuccess: () => void;
}

export const LoginRegisterView: React.FC<LoginRegisterViewProps> = ({ 
  initialMode = 'login', 
  onNavigate, 
  onLoginSuccess 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('demo@convocatoriaspublicas.gov.co');
  const [password, setPassword] = useState('*********');
  // fullName → se envía como full_name en POST /api/v1/auth/register
  const [fullName, setFullName] = useState('Carlos Restrepo');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.includes('@') || password.length < 4) {
        setErrorMsg("Las credenciales son inválidas o la cuenta se encuentra inactiva. Verifique el formato del correo.");
      } else {
        setErrorMsg(null);
        onLoginSuccess();
      }
    } else {
      if (!fullName || !email) {
        setErrorMsg("Por favor complete todos los campos obligatorios del registro.");
      } else {
        setErrorMsg(null);
        setMode('login');
      }
    }
  };

  const triggerMockError = () => {
    setErrorMsg("Error del Servidor: Credenciales inválidas. Por favor compruebe su contraseña de acceso o cree una cuenta si no lo ha hecho.");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
      
      {/* Absolute top return button */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-on-surface-variant hover:text-primary-brand transition-colors bg-white px-3 py-2 rounded-lg shadow-2xs border border-outline-variant"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Inicio</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="bg-primary-brand text-white p-3 rounded-xl shadow-md inline-block">
            <Building2 className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-primary-brand tracking-tight">
          {mode === 'login' ? 'Acceso al Portal' : 'Registro de Contratistas'}
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta registrada?{' '}
              <button 
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className="font-semibold text-link-action hover:underline"
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya posees una cuenta de acceso?{' '}
              <button 
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className="font-semibold text-link-action hover:underline"
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-6 shadow-md rounded-2xl border border-outline-variant/60">
          
          {/* Simulated Error Alert Widget */}
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 animate-fadeIn" id="auth-error-alert">
              <div className="flex">
                <ShieldAlert className="h-5 w-5 text-error-alert shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">Mensaje del Portal</h3>
                  <div className="mt-1 text-xs text-red-700 leading-relaxed">
                    {errorMsg}
                  </div>
                  <div className="mt-2">
                    <button 
                      type="button" 
                      onClick={() => setErrorMsg(null)}
                      className="text-xs font-semibold text-red-800 underline hover:text-red-950"
                    >
                      Descartar mensaje
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nombre Completo / Razón Social
                </label>
                <div className="relative rounded-lg border border-outline-variant px-3 py-2.5 flex items-center bg-surface-container-low input-focus-ring transition-all">
                  <User className="h-5 w-5 text-outline mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Restrepo / Soluciones Bogotá S.A.S."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Correo Electrónico Comercial / Oficial
              </label>
              <div className="relative rounded-lg border border-outline-variant px-3 py-2.5 flex items-center bg-surface-container-low input-focus-ring transition-all">
                <Mail className="h-5 w-5 text-outline mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Ej: carlos@empresa.com.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-on-surface focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Contraseña de acceso
                </label>
                {mode === 'login' && (
                  <a href="#recuperar" className="text-xs font-medium text-link-action hover:underline">
                    ¿La olvidó?
                  </a>
                )}
              </div>
              <div className="relative rounded-lg border border-outline-variant px-3 py-2.5 flex items-center bg-surface-container-low input-focus-ring transition-all">
                <KeyRound className="h-5 w-5 text-outline mr-2 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Contraseña de seguridad"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-on-surface focus:outline-hidden"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-outline hover:text-on-surface transition-colors shrink-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative rounded-lg border border-outline-variant px-3 py-2.5 flex items-center bg-surface-container-low input-focus-ring transition-all">
                  <KeyRound className="h-5 w-5 text-outline mr-2 shrink-0" />
                  <input
                    type="password"
                    required
                    placeholder="Repita la contraseña"
                    defaultValue="*********"
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-primary-brand hover:bg-primary-container text-white py-3 px-4 rounded-lg font-semibold text-sm shadow-xs hover:shadow-md transition-all flex justify-center items-center"
              >
                {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse en el Portal'}
              </button>

              {/* Dev helper to trigger error validation state screen */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={triggerMockError}
                  className="w-full border border-dashed border-red-300 text-red-700 hover:bg-red-50/50 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex justify-center items-center"
                >
                  Simular Error de Validación
                </button>
              )}
            </div>
          </form>

          {/* Single Sign On warning statement */}
          <div className="mt-6 pt-6 border-t border-outline-variant/50 text-center">
            <span className="text-[10px] text-outline font-medium tracking-wider uppercase flex items-center justify-center gap-1">
              🔐 Servidor institucional seguro • Encriptación SSL/TLS de 256 bits
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
