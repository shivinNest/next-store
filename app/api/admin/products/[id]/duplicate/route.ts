import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const original = await prisma.product.findUnique({
      where: { id },
      include: { sizes: true },
    });

    if (!original) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Build a unique slug
    const baseName = `Copy of ${original.name}`;
    let slug = slugify(baseName);
    const existing = await prisma.product.findMany({
      where: { slug: { startsWith: slug } },
      select: { slug: true },
    });
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const duplicate = await prisma.product.create({
      data: {
        name: baseName,
        slug,
        shortDescription: original.shortDescription,
        description: original.description,
        price: original.price,
        comparePrice: original.comparePrice,
        images: original.images,
        categoryId: original.categoryId,
        isFeatured: false,
        isTrending: false,
        isOffer: original.isOffer,
        isActive: false, // start inactive so admin can review before publishing
        tags: original.tags,
        sizes: {
          create: original.sizes.map((s) => ({ size: s.size, stock: s.stock })),
        },
      },
    });

    return NextResponse.json({ success: true, data: { id: duplicate.id } });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
