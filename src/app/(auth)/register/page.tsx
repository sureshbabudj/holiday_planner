"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpEmail, signInGoogle, loading } = useAuthStore();
  const router = useRouter();

  return (
    <div className="max-w-sm mx-auto m-2">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signUpEmail(email, password);
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
          <Label>Password</Label>
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
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Log in
        </Link>
      </p>
    </div>
  );
}
