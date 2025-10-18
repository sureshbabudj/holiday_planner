import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;
  if (!token) return null;
  try {
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
      const decoded = await adminAuth.verifyIdToken(token, false);
      return decoded;
    }
    const decoded = await adminAuth.verifySessionCookie(token, true);
    return decoded;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  if (!user.email_verified) redirect("/verify-email");
  return user;
}
