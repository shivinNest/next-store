import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /api/orders/razorpay/create
// Creates a Razorpay order and returns the order id + amount for client-side checkout
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { addressId, couponCode } = body as { addressId: string; couponCode?: string };

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "Delivery address is required" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });
    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      );
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingFee = parseInt(process.env.SHIPPING_CHARGE || "50", 10);
    const freeThreshold = parseInt(process.env.FREE_SHIPPING_THRESHOLD || "999", 10);
    const shippingCharge = subtotal >= freeThreshold ? 0 : shippingFee;

    // Validate coupon if provided
    let couponDiscount = 0;
    let appliedCoupon = null;
    const normalizedCode = couponCode?.trim().toUpperCase() || null;
    if (normalizedCode) {
      appliedCoupon = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
        include: { usages: { where: { userId: user.id } } },
      });

      if (
        appliedCoupon &&
        appliedCoupon.isActive &&
        (!appliedCoupon.expiresAt || appliedCoupon.expiresAt >= new Date()) &&
        (appliedCoupon.maxUses === null || appliedCoupon.usedCount < appliedCoupon.maxUses) &&
        appliedCoupon.usages.length < appliedCoupon.maxUsesPerUser &&
        (!appliedCoupon.minOrderAmount || subtotal >= Number(appliedCoupon.minOrderAmount))
      ) {
        couponDiscount =
          appliedCoupon.discountType === "PERCENTAGE"
            ? Math.round((subtotal * Number(appliedCoupon.discountValue)) / 100)
            : Math.min(Number(appliedCoupon.discountValue), subtotal);
      } else {
        appliedCoupon = null;
      }
    }

    const total = subtotal + shippingCharge - couponDiscount;
    // Razorpay amount is in paise (smallest currency unit)
    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        addressId,
        couponCode: appliedCoupon?.code ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        subtotal,
        shippingCharge,
        couponDiscount,
        total,
        couponCode: appliedCoupon?.code ?? null,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Razorpay create order error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
