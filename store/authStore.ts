import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  role: User["role"] | null;
  /** true = persisted to localStorage (survives browser close) */
  rememberMe: boolean;
  setAuth: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
}

/**
 * Storage that switches between localStorage and sessionStorage at runtime.
 *
 * - rememberMe = true  → localStorage  (survives browser close)
 * - rememberMe = false → sessionStorage (cleared when tab/browser closes)
 *
 * We read the preference from localStorage itself so we know which store to
 * hydrate from on the next page load.
 */
const adaptiveStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    // Check localStorage first (remember-me sessions), then sessionStorage
    return localStorage.getItem(name) ?? sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    // Determine which store to write to based on the rememberMe flag in the
    // value being written. Default to sessionStorage if flag is absent/false.
    try {
      const parsed = JSON.parse(value) as { state?: { rememberMe?: boolean } };
      if (parsed?.state?.rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name); // clean up the other store
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name); // clean up the other store
      }
    } catch {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      rememberMe: false,
      setAuth: (user, token, rememberMe = false) =>
        set({ user, token, role: user.role, rememberMe }),
      logout: () => set({ user: null, token: null, role: null, rememberMe: false }),
    }),
    {
      name: "veltro-auth",
      storage: createJSONStorage(() => adaptiveStorage),
    }
  )
);
