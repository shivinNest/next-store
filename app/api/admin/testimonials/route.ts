import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
    return successResponse(testimonials);
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
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const review = formData.get("review") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const avatarFile = formData.get("avatar") as File | null;

    if (!name || !review) {
      return NextResponse.json(errorResponse("Name and review are required"), { status: 400 });
    }

    let avatar: string | null = null;
    if (avatarFile && avatarFile.size > 0) {
      avatar = await saveFile(avatarFile, "avatars");
    }

    const t = await prisma.testimonial.create({
      data: { name, location, review, rating, sortOrder, isActive, avatar },
    });
    return successResponse(t, 201);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return errorResponse(err.message, 403);
    }
    return errorResponse("Internal server error", 500);
  }
}
