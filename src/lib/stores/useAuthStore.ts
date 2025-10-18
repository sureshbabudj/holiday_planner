import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  signInEmail,
  signUpEmail,
  signInGoogle,
  signOut,
} from "@/lib/auth/client";
import { User } from "firebase/auth";
import { toast } from "sonner";

type AuthState = {
  loading: boolean;
  token: string | null;
  user: User | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  signInEmail: (e: string, p: string) => Promise<void>;
  signUpEmail: (e: string, p: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const handleError = (e: unknown) => {
  toast.error((e as Error).message || "An error occurred");
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    loading: false,
    token: null,
    setToken: (token) => set({ token }),
    signInEmail: async (email, password) => {
      set({ loading: true });
      try {
        const token = await signInEmail(email, password);
        await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        set({ token, loading: false });
      } catch (e) {
        handleError(e);
      } finally {
        set({ loading: false });
      }
    },
    signUpEmail: async (email, password) => {
      set({ loading: true });
      try {
        const token = await signUpEmail(email, password);
        await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        set({ token });
      } catch (e) {
        handleError(e);
      } finally {
        set({ loading: false });
      }
    },
    signInGoogle: async () => {
      set({ loading: true });
      try {
        const token = await signInGoogle();
        await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
      } catch (e) {
        handleError(e);
      } finally {
        set({ loading: false });
      }
    },
    signOut: async () => {
      set({ loading: true });
      try {
        await signOut();
        await fetch("/api/session", { method: "DELETE" });
      } catch (e) {
        handleError(e);
      } finally {
        set({ token: null, loading: false });
      }
    },
    setUser: (user) => set({ user }),
  }))
);
