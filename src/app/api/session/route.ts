import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
    (await cookies()).set("__session", token, {
      maxAge: 60 * 60 * 24 * 5,
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
    });
    return new Response(null, { status: 200 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(token, {
    expiresIn,
  });

  (await cookies()).set("__session", sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return new Response(null, { status: 200 });
}

export async function DELETE() {
  (await cookies()).delete("__session");
  return new Response(null, { status: 200 });
}
