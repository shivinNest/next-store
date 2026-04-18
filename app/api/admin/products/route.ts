import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveMultipleFiles } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { validateProduct } from "@/lib/validations";
import { getPaginationParams } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const sp = req.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(sp);
    const search = sp.get("search");

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          sizes: true,
          _count: { select: { orderItems: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const comparePrice = formData.get("comparePrice")
      ? parseFloat(formData.get("comparePrice") as string)
      : undefined;
    const categoryId = formData.get("categoryId") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const isTrending = formData.get("isTrending") === "true";
    const isOffer = formData.get("isOffer") === "true";
    const isActive = formData.get("isActive") !== "false";
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const sizesRaw = formData.get("sizes") as string;
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

    const { isValid, errors } = validateProduct({ name, price, categoryId });
    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    let imageUrls: string[] = [];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      imageUrls = await saveMultipleFiles(imageFiles, "products");
    }

    // Generate unique slug
    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        categoryId,
        images: imageUrls,
        isFeatured,
        isTrending,
        isOffer,
        isActive,
        tags,
        sizes: {
          create: sizes.map((s: { size: string; stock: number }) => ({
            size: s.size,
            stock: s.stock,
          })),
        },
      },
      include: { category: true, sizes: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    console.error("Admin product POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
