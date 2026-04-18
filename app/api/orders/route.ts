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
    const shippingCharge = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shippingCharge;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        addressId,
        subtotal,
        shippingCharge,
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

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    // Send confirmation email
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (fullUser) {
      sendEmail({
        to: fullUser.email,
        subject: `Order #${order.orderNumber} received - dstore.in`,
        html: orderConfirmationTemplate(
          fullUser.name,
          order.orderNumber,
          total.toFixed(2)
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
