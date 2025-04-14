"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User } from "next-auth";
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionState {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  expires: string | null;
  setSession: (expires: string, userData: User | undefined) => void;
  checkToken: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // State fields
      user: null,
      expires: null, // store expiration timestamp string
      status: "loading", // e.g., "idle" (logged out/unknown), "authenticated"
      isAuthenticated: false,

      // Action: setSession with expiration and user data
      setSession: (expires: string, userData: User | undefined) => {
        const expiryTime = new Date(expires);
        if (Number.isNaN(expiryTime.getTime()) || expiryTime <= new Date()) {
          console.error("Invalid or expired session expiration date");
          // Clean up any stored data since this session is not valid
          localStorage.removeItem("user");
          localStorage.removeItem("expires");
          set({
            user: null,
            expires: null,
            status: "unauthenticated",
            isAuthenticated: false,
          });
          return;
        }
        try {
          // Store session data in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("expires", expires);
        } catch (e) {
          console.error("Failed to access localStorage:", e);
          // If storing fails, ensure state remains clean
          set({
            user: null,
            expires: null,
            status: "unauthenticated",
            isAuthenticated: false,
          });
          return;
        }
        // Update Zustand state to reflect the logged-in user
        set({
          user: userData,
          expires: expires,
          status: "authenticated",
          isAuthenticated: true,
        });
      },

      // Action: checkToken (validate existing session)
      checkToken: () => {
        try {
          set({ status: "loading" });
          const expires = localStorage.getItem("expires");
          const userData = localStorage.getItem("user");
          if (!expires || !userData) {
            // No session in storage
            set({
              user: null,
              expires: null,
              status: "unauthenticated",
              isAuthenticated: false,
            });
            return false;
          }
          const expiryTime = new Date(expires);
          if (expiryTime <= new Date()) {
            try {
              localStorage.removeItem("user");
              localStorage.removeItem("expires");
            } catch (e) {
              console.error("Failed to clear localStorage:", e);
            }
            set({
              user: null,
              expires: null,
              status: "unauthenticated",
              isAuthenticated: false,
            });
          }
          // Session is valid, restore user into state if not already
          const parsedUser = JSON.parse(userData) as User;
          set({
            user: parsedUser,
            expires: expires,
            status: "authenticated",
            isAuthenticated: true,
          });
          return true;
        } catch (e) {
          console.error("Error checking token:", e);
          try {
            localStorage.removeItem("user");
            localStorage.removeItem("expires");
          } catch (e) {
            console.error("Failed to clear localStorage:", e);
          }
          set({
            user: null,
            expires: null,
            status: "unauthenticated",
            isAuthenticated: false,
          });
          return false;
        }
      },

      // Action: logout (clear session)
      logout: () => {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("expires");
        } catch (e) {
          console.error("Failed to clear localStorage:", e);
        }
        set({
          user: null,
          expires: null,
          status: "unauthenticated",
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "session-storage", // Name of the storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    },
  ),
);
