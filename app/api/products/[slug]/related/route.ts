import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find the current product to get its category
    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      select: { id: true, categoryId: true },
    });

    if (!product) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch up to 8 products from same category, excluding current
    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        category: { select: { name: true, slug: true } },
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // If fewer than 4 from same category, pad with other recent products
    if (related.length < 4) {
      const extra = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: [product.id, ...related.map((p) => p.id)] },
        },
        include: {
          category: { select: { name: true, slug: true } },
          sizes: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8 - related.length,
      });
      return NextResponse.json({ success: true, data: [...related, ...extra] });
    }

    return NextResponse.json({ success: true, data: related });
  } catch (err) {
    console.error("Related products error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
