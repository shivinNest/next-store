import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-compatible JWT verification using Web Crypto API
async function verifyJwt(token: string): Promise<{ role?: string } | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const sig = Uint8Array.from(
      atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify("HMAC", key, sig, data);
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/faq",
  "/blog",
];

const AUTH_ONLY_PATHS = ["/account", "/checkout"];
const ADMIN_PATHS = ["/admin"];
const AUTH_REDIRECT_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, API routes for public data, uploads
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/blogs") ||
    pathname.startsWith("/api/faq") ||
    pathname.startsWith("/api/banners") ||
    pathname.startsWith("/api/hero-slides") ||
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/api/testimonials")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const payload = token ? await verifyJwt(token) : null;
  const isLoggedIn = !!payload;

  // Redirect authenticated users away from login/register
  if (isLoggedIn && AUTH_REDIRECT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }

  // Protect user-only pages
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin pages
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && pathname !== "/admin/login") {
    if (!isLoggedIn || payload?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
