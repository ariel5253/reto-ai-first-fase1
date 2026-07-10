import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '../services/auth';
import { ApiError } from '../services/http';
import { useAuthStore } from '../store/authStore';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface LocationState {
  message?: string;
}

function validate(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!email.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!email.includes('@')) {
    errors.email = 'Ingresa un email válido';
  }
  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener mínimo 8 caracteres';
  }
  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAuthStore((state) => state.setToken);
  const successMessage = (location.state as LocationState | null)?.message;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(email, password);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      setToken(response.access_token);
      setIsSuccess(true);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setSubmitError('Credenciales incorrectas');
      } else if (error instanceof ApiError && error.status === 422) {
        setSubmitError('Datos inválidos, revisa el formulario');
      } else {
        setSubmitError('No fue posible iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Acceso privado</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Inicia sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Entra para gestionar convocatorias seguidas y búsquedas guardadas.</p>
      </div>

      {successMessage && <div className="alert-success">{successMessage}</div>}
      {isSuccess && <div className="alert-success">Sesión iniciada correctamente.</div>}
      {submitError && <div className="alert-error">{submitError}</div>}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@empresa.com"
            autoComplete="email"
          />
          {errors.email && <small>{errors.email}</small>}
        </label>

        <label className="form-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="current-password"
          />
          {errors.password && <small>{errors.password}</small>}
        </label>

        <button type="submit" className="button-primary w-full" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        ¿No tienes cuenta? <Link className="font-semibold text-blue-700" to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
