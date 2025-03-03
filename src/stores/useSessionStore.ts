"use client";

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface Session {
  userId: string;
  email: string;
  exp: number;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionState {
  session: Session | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  setSession: (token: string) => void;
  checkToken: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: "loading",
  isAuthenticated: false,

  setSession: (token: string) => {
    try {
      const decoded = jwtDecode<Session>(token);
      localStorage.setItem("token", token);
      set({ session: decoded, status: "authenticated", isAuthenticated: true });
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      set({ session: null, status: "unauthenticated", isAuthenticated: false });
    }
  },

  checkToken: () => {
    set({ status: "loading" });
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<Session>(token);
        if (decoded.exp * 1000 > Date.now()) {
          set({
            session: decoded,
            status: "authenticated",
            isAuthenticated: true,
          });
        } else {
          localStorage.removeItem("token");
          set({
            session: null,
            status: "unauthenticated",
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        set({
          session: null,
          status: "unauthenticated",
          isAuthenticated: false,
        });
      }
    } else {
      set({ session: null, status: "unauthenticated", isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ session: null, status: "unauthenticated", isAuthenticated: false });
  },
}));
