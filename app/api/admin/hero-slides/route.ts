import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
    return successResponse(slides);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return errorResponse(err.message, 403);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subtitle = (formData.get("subtitle") as string) || null;
    const link = (formData.get("link") as string) || null;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title) return errorResponse("Title is required", 400);

    let image = "";
    if (imageFile && imageFile.size > 0) {
      image = await saveFile(imageFile, "banners");
    }

    if (!image) return errorResponse("Slide image is required", 400);

    const slide = await prisma.heroSlide.create({
      data: { title, subtitle, link, sortOrder, isActive, image },
    });
    return successResponse(slide, 201);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return errorResponse(err.message, 403);
    }
    return errorResponse("Internal server error", 500);
  }
}
