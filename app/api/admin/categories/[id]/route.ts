import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { slugify } from "@/lib/utils";

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
    const isActive = formData.get("isActive") !== "false";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "categories");
    }

    const current = await prisma.category.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    let slug = current.slug;
    if (name !== current.name) {
      slug = slugify(name);
      const conflict = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    const data: Record<string, unknown> = { name, slug, description, isActive, sortOrder };
    if (imageUrl) data.image = imageUrl;

    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: category });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
