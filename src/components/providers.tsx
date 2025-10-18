"use client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { auth } from "@/lib/firebase/client";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const loading = useAuthStore((s) => s.loading);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setToken(null);
        return; // middleware handles redirect to /login
      }

      setUser(user);

      // keep session cookie in sync after client-side changes
      const token = await user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      setToken(token);
    });

    return () => unsub();
  }, [setToken, setUser]);

  if (loading) return <div className="p-4">Loading...</div>;

  return children;
}
