// Authentication domain models

export type UserRole = 'customer' | 'provider';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
}