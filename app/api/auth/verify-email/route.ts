import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }

  if (user.verifyTokenExp && user.verifyTokenExp < new Date()) {
    return NextResponse.json(
      { success: false, error: "Token expired. Please request a new one." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verifyToken: null, verifyTokenExp: null },
  });

  return NextResponse.json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
}
