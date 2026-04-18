import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveMultipleFiles } from "@/lib/upload";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, sizes: true },
    });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const comparePrice = formData.get("comparePrice")
      ? parseFloat(formData.get("comparePrice") as string)
      : null;
    const categoryId = formData.get("categoryId") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const isTrending = formData.get("isTrending") === "true";
    const isOffer = formData.get("isOffer") === "true";
    const isActive = formData.get("isActive") !== "false";
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const sizesRaw = formData.get("sizes") as string;
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];
    const existingImages = formData.get("existingImages")
      ? JSON.parse(formData.get("existingImages") as string)
      : [];

    const imageFiles = formData.getAll("images") as File[];
    let newImageUrls: string[] = [];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      newImageUrls = await saveMultipleFiles(imageFiles, "products");
    }

    const imageUrls = [...existingImages, ...newImageUrls];

    // Regenerate slug only if name changed
    const current = await prisma.product.findUnique({ where: { id }, select: { name: true, slug: true } });
    let slug = current?.slug || slugify(name);
    if (current && current.name !== name) {
      slug = slugify(name);
      const conflict = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    // Update sizes: delete all and recreate
    await prisma.productSize.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    console.error("Admin product PUT error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
