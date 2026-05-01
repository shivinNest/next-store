import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// POST /api/coupons/validate
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        usages: { where: { userId: user.id } },
      },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: "Invalid or expired coupon code" }, { status: 400 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (coupon.usages.length >= coupon.maxUsesPerUser) {
      return NextResponse.json({ success: false, error: "You have already used this coupon" }, { status: 400 });
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount of ₹${Number(coupon.minOrderAmount).toLocaleString("en-IN")} required`,
      }, { status: 400 });
    }

    const discountAmount =
      coupon.discountType === "PERCENTAGE"
        ? Math.round((subtotal * Number(coupon.discountValue)) / 100)
        : Math.min(Number(coupon.discountValue), subtotal);

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
