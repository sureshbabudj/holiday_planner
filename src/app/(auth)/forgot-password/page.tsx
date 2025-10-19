"use client";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email);
    setSent(true);
  };

  if (sent) return <p>Check your inbox for the reset link.</p>;

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto m-2 space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <Label>Email</Label>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button className="w-full">Send reset email</Button>
    </form>
  );
}
