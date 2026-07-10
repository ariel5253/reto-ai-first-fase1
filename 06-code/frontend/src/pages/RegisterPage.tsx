import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../services/auth';
import { ApiError } from '../services/http';

interface RegisterFormErrors {
  full_name?: string;
  email?: string;
  password?: string;
}

function validate(fullName: string, email: string, password: string): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!fullName.trim()) {
    errors.full_name = 'El nombre completo es obligatorio';
  }
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

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(fullName, email, password);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ email, password, full_name: fullName });
      setIsSuccess(true);
      navigate('/login', { state: { message: 'Registro exitoso. Ahora inicia sesión.' } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setSubmitError('Este email ya está registrado');
      } else if (error instanceof ApiError && error.status === 422) {
        setSubmitError('Datos inválidos');
      } else {
        setSubmitError('No fue posible completar el registro. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Nueva cuenta</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Regístrate</h1>
        <p className="mt-2 text-sm text-slate-600">Crea una cuenta para seguir convocatorias y guardar búsquedas.</p>
      </div>

      {isSuccess && <div className="alert-success">Registro exitoso.</div>}
      {submitError && <div className="alert-error">{submitError}</div>}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Nombre completo</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nombre Apellido"
            autoComplete="name"
          />
          {errors.full_name && <small>{errors.full_name}</small>}
        </label>

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
            autoComplete="new-password"
          />
          {errors.password && <small>{errors.password}</small>}
        </label>

        <button type="submit" className="button-primary w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta? <Link className="font-semibold text-blue-700" to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
