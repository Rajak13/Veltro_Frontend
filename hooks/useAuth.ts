import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { user, token, role, setAuth, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const logout = () => {
    storeLogout();
    router.push("/login");
  };

  return { user, token, role, setAuth, logout, isAuthenticated: !!token };
};
