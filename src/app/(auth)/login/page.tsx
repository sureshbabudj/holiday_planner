"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInEmail, signInGoogle, loading } = useAuthStore();
  const router = useRouter();

  return (
    <div className="max-w-sm mx-auto m-2">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signInEmail(email, password);
          router.push("/");
        }}
        className="space-y-4"
      >
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="flex">
            <Label className="flex-1">Password</Label>
            <Link href="/forgot-password" className="text-sm underline">
              Forgot password?
            </Link>
          </div>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            await signInGoogle();
            router.push("/");
          }}
        >
          Sign in with Google
        </Button>
      </div>
      <div className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
