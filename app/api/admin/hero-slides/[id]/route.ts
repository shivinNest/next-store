import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { successResponse, errorResponse } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subtitle = (formData.get("subtitle") as string) || null;
    const link = (formData.get("link") as string) || null;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const imageFile = formData.get("image") as File | null;

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) return errorResponse("Not found", 404);

    let image = existing.image;
    if (imageFile && imageFile.size > 0) {
      image = await saveFile(imageFile, "banners");
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: { title, subtitle, link, sortOrder, isActive, image },
    });
    return successResponse(slide);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return errorResponse(err.message, 403);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.heroSlide.delete({ where: { id } });
    return successResponse(null);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return errorResponse(err.message, 403);
    }
    return errorResponse("Internal server error", 500);
  }
}
