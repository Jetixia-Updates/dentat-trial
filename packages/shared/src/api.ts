export type Role = "ADMIN" | "DOCTOR" | "RECEPTION" | "PATIENT";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface ApiError {
  code: string;
  message: string;
}
