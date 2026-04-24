import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, signToken } from "@/lib/auth";
import { validateLogin } from "@/lib/validations";

// ── In-memory rate limiter (resets on server restart / per instance) ──────────
// For production at scale, replace with Redis-backed limiter.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  // Use forwarded IP (Vercel/proxied) or fallback
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count++;
  if (entry.count > maxAttempts) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  return { allowed: true, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ipKey = getRateLimitKey(req);
    const { allowed, retryAfter } = checkRateLimit(ipKey);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Try again in ${retryAfter} seconds.` },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const body = await req.json();
    const { isValid, errors } = validateLogin(body);

    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Use a constant-time compare even when user doesn't exist to prevent timing attacks
    const dummyHash = "$2b$12$invalidhashfortimingprotectiononly000000000000000000000";
    const valid = user
      ? await comparePasswords(password, user.password)
      : await comparePasswords(password, dummyHash).then(() => false);

    // Generic error — prevents user enumeration
    if (!user || !valid) {
      return NextResponse.json(
        { success: false, error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

