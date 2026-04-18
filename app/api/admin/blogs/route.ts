import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/upload";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: blogs });
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

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author = (formData.get("author") as string) || "Admin";
    const isPublished = formData.get("isPublished") === "true";
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const imageFile = formData.get("image") as File | null;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "blogs");
    }

    let slug = slugify(title);
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        image: imageUrl,
        tags,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
