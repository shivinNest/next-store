import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(sp);
    const category = sp.get("category");
    const search = sp.get("search");
    const featured = sp.get("featured");
    const trending = sp.get("trending");
    const offer = sp.get("offer");
    const sort = sp.get("sort") || "newest";

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (featured === "true") where.isFeatured = true;
    if (trending === "true") where.isTrending = true;
    if (offer === "true") where.isOffer = true;

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "oldest"
        ? { createdAt: "asc" as const }
        : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          sizes: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
