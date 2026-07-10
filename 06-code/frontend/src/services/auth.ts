import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import { apiPost } from './http';

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse, RegisterRequest>('/api/v1/auth/register', payload);
}

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse, LoginRequest>('/api/v1/auth/login', payload);
}
