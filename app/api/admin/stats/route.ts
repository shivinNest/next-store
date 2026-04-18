import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { quantity: true, price: true } },
        },
      }),
    ]);

    const revenue = await prisma.order.aggregate({
      where: { status: { in: ["VERIFIED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        pendingOrders,
        totalRevenue: revenue._sum.total || 0,
        recentOrders,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
