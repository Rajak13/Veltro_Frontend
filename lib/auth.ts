import api from "./api";
import type { ApiResponse, User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export const login = async (payload: LoginPayload): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/login", payload);
  return res.data.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/register", payload);
  return res.data.data;
};

export const logout = () => {
  // Handled by Zustand store + api interceptor
};
