import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/cart
export async function GET() {
  try {
    const user = await requireAuth();
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            images: true,
            isActive: true,
            sizes: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/cart
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, size, quantity = 1 } = await req.json();

    if (!productId || !size) {
      return NextResponse.json(
        { success: false, error: "productId and size are required" },
        { status: 400 }
      );
    }

    // Verify product & size stock
    const productSize = await prisma.productSize.findUnique({
      where: { productId_size: { productId, size } },
    });

    if (!productSize || productSize.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    const item = await prisma.cartItem.upsert({
      where: { userId_productId_size: { userId: user.id, productId, size } },
      update: { quantity: { increment: quantity } },
      create: { userId: user.id, productId, size, quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/cart (clear all)
export async function DELETE() {
  try {
    const user = await requireAuth();
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
