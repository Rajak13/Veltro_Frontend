import api from "./api";
import type { ApiResponse } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

// Shape returned by the backend AuthResponseDto
export interface AuthData {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

// Backend returns { token, fullName, email, role } — normalise it
interface BackendAuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

const normalise = (raw: BackendAuthResponse): AuthData => ({
  token: raw.token,
  user: { name: raw.fullName, email: raw.email, role: raw.role },
});

export const login = async (payload: LoginPayload): Promise<AuthData> => {
  const res = await api.post<ApiResponse<BackendAuthResponse>>("/auth/login", payload);
  return normalise(res.data.data);
};

export const register = async (payload: RegisterPayload): Promise<AuthData> => {
  const res = await api.post<ApiResponse<BackendAuthResponse>>("/auth/register", payload);
  return normalise(res.data.data);
};

export const logout = () => {
  // Handled by Zustand store + api interceptor
};
