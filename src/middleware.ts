import { NextRequest, NextResponse } from "next/server";
import {
  verifyEmulatorToken,
  verifyProductionToken,
} from "@/lib/firebase/edge-verifier";
import { AUTH_PATHS, PUBLIC_PREFIX } from "./data";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return null;

  try {
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
      return await verifyEmulatorToken(token);
    }
    return await verifyProductionToken(token);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static assets / next internals
  if (PUBLIC_PREFIX.test(pathname)) {
    return NextResponse.next();
  }

  const user = await getUser(req);

  // not authenticated → login
  if (!user) {
    console.log("User not found, redirecting to login");
    if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // not verified → verify-email
  if (user.email_verified || user.emailVerified) {
    if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const response = NextResponse.next();
    response.cookies.set("userid", user.user_id || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } else {
    console.log("User not verified, redirecting to verify-email");
    return NextResponse.redirect(new URL("/verify-email", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
