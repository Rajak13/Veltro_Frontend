import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const { user, token, role, setAuth, logout } = useAuthStore();
  return { user, token, role, setAuth, logout, isAuthenticated: !!token };
};
