import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendEmail, orderConfirmationTemplate } from "@/lib/email";

// POST /api/orders/razorpay/verify
// Verifies Razorpay payment signature and creates the order in the database
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      couponCode,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      addressId: string;
      couponCode?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !addressId) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });
    if (!address) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
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

    // Create order with PLACED status since payment is confirmed by Razorpay
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        addressId,
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingLine1: address.line1,
        shippingLine2: address.line2,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pincode,
        status: "PLACED",
        subtotal,
        shippingCharge,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount,
        total,
        paymentMethod: "RAZORPAY",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            image: item.product.images[0] || null,
            size: item.size,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Record coupon usage and increment counter
    if (appliedCoupon) {
      await prisma.$transaction([
        prisma.couponUsage.create({
          data: { couponId: appliedCoupon.id, userId: user.id, orderId: order.id },
        }),
        prisma.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        }),
      ]);
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    // Send confirmation email
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (fullUser) {
      sendEmail({
        to: fullUser.email,
        subject: `Order #${order.orderNumber} confirmed - Saaviya`,
        bcc: process.env.ADMIN_EMAIL,
        html: orderConfirmationTemplate(
          fullUser.name,
          order.orderNumber,
          subtotal.toFixed(2),
          shippingCharge.toFixed(2),
          appliedCoupon ? appliedCoupon.code : null,
          couponDiscount.toFixed(2),
          total.toFixed(2),
          order.items.map((i) => ({
            name: i.name,
            image: i.image,
            size: i.size,
            quantity: i.quantity,
            price: Number(i.price),
          })),
          {
            name: order.shippingName ?? "",
            phone: order.shippingPhone ?? "",
            line1: order.shippingLine1 ?? "",
            line2: order.shippingLine2 ?? undefined,
            city: order.shippingCity ?? "",
            state: order.shippingState ?? "",
            pincode: order.shippingPincode ?? "",
          }
        ),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Razorpay verify order error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
