"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { usePathname } from "next/navigation";

import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { PUBLIC_PATHS } from "@/middleware";

export function Providers({ children }: { children: React.ReactNode }) {
  const loading = useAuthStore((s) => s.loading);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const pathname = usePathname();

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

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && loading) {
    return (
      <>
        <AuthProgress />
        {children}
      </>
    );
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return children;
}

export function AuthProgress() {
  const loading = useAuthStore((s) => s.loading);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-primary/30 z-50 overflow-hidden">
      <div
        className="h-full w-1/2 bg-primary/85 animate-[slide_1.5s_ease-in-out_infinite]"
        style={{
          animation: "slide 1.5s ease-in-out infinite",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }
        `,
        }}
      />
    </div>
  );
}
