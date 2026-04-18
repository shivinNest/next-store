import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author = (formData.get("author") as string) || "Admin";
    const isPublished = formData.get("isPublished") === "true";
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const imageFile = formData.get("image") as File | null;

    const current = await prisma.blog.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    let imageUrl = current.image;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "blogs");
    }

    let slug = current.slug;
    if (title !== current.title) {
      slug = slugify(title);
      const conflict = await prisma.blog.findFirst({ where: { slug, NOT: { id } } });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        image: imageUrl,
        tags,
        isPublished,
        publishedAt: isPublished && !current.publishedAt ? new Date() : current.publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: blog });
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
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
