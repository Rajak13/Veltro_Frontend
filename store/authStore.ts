import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  role: User["role"] | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      setAuth: (user, token) => set({ user, token, role: user.role }),
      logout: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: "veltro-auth",
    }
  )
);
