import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserOut } from "../types/api";

interface AuthState {
  token: string | null;
  user: UserOut | null;
  setAuth: (token: string, user: UserOut) => void;
  clearAuth: () => void;
  updateUser: (user: UserOut) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      clearAuth: () => set({ token: null, user: null }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: "pathfind-auth",
    },
  ),
);
