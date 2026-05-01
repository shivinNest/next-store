import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { saveFile } from "@/lib/upload";
import { sendEmail, orderConfirmationTemplate } from "@/lib/email";

// GET /api/orders
export async function GET() {
  try {
    const user = await requireAuth();
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/orders - Create order with payment screenshot
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await req.formData();

    const addressId = formData.get("addressId") as string;
    const screenshotFile = formData.get("paymentScreenshot") as File | null;
    const couponCode = (formData.get("couponCode") as string | null)?.trim().toUpperCase() || null;

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

    // Upload payment screenshot
    let screenshotUrl: string | undefined;
    if (screenshotFile) {
      screenshotUrl = await saveFile(screenshotFile, "payments");
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
    if (couponCode) {
      appliedCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
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
        appliedCoupon = null; // invalid — ignore silently, order proceeds without discount
      }
    }

    const total = subtotal + shippingCharge - couponDiscount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        addressId,
        subtotal,
        shippingCharge,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount,
        total,
        paymentScreenshot: screenshotUrl,
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
      include: { items: true, address: true },
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
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          }
        ),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Order POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
