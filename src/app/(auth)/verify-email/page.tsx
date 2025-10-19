"use client";
import { reload } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { sendVerifyEmail } from "@/lib/auth/client";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/stores/useAuthStore";

import { NotVerifiedEmailDialog } from "../_components/NotVerifiedEmailDialog";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { loading } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const checkNow = async () => {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      const user = auth.currentUser;
      await reload(user);
      const freshToken = await user.getIdToken(true); // force refresh
      await fetch("/api/session", {
        // overwrite cookie
        method: "POST",
        body: JSON.stringify({ token: freshToken }),
      });
      router.replace("/");
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <NotVerifiedEmailDialog
        open={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
      />
      <div className="max-w-sm mx-auto m-2 space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p>We sent a link to your inbox. Click it, then press:</p>
        <Button onClick={checkNow} disabled={loading} className="w-full">
          I’ve verified → continue
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await sendVerifyEmail();
            alert("Email resent — check spam too!");
          }}
          className="w-full"
        >
          Resend email
        </Button>
      </div>
    </>
  );
}
