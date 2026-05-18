import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token from Zustand store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 — logout and redirect to login, but only if the user had an active session.
// Skipping the redirect when there's no token prevents the login page from
// reloading itself when the user enters wrong credentials.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const hadSession = !!useAuthStore.getState().token;
      useAuthStore.getState().logout();
      if (hadSession && typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
