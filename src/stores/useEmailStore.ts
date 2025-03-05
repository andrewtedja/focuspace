import { create } from "zustand";

interface EmailVerificationState {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useEmailStore = create<EmailVerificationState>((set) => ({
  email: localStorage.getItem("email") ?? null, // Load from localStorage on init
  setEmail: (email: string) => {
    localStorage.setItem("email", email);
    set({ email });
  },
  clearEmail: () => {
    localStorage.removeItem("email");
    set({ email: null });
  },
}));
