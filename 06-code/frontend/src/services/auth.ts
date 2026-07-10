import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types/api';
import { apiPost } from './http';

export function registerUser(payload: RegisterRequest): Promise<UserResponse> {
  return apiPost<UserResponse, RegisterRequest>('/api/v1/auth/register', payload);
}

export function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse, LoginRequest>('/api/v1/auth/login', payload);
}

export const register = registerUser;
export const login = loginUser;
