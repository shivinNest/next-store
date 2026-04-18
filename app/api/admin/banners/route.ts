import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(successResponse(banners));
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json(errorResponse(err.message), { status: 403 });
    }
    return NextResponse.json(errorResponse("Internal server error"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const position = (formData.get("position") as string) || "home";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title) return NextResponse.json(errorResponse("Title is required"), { status: 400 });

    let image = "/placeholder-banner.jpg";
    if (imageFile && imageFile.size > 0) {
      image = await saveFile(imageFile, "banners");
    }

    const banner = await prisma.banner.create({
      data: { title, image, link, position, sortOrder, isActive },
    });
    return NextResponse.json(successResponse(banner), { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return NextResponse.json(errorResponse(err.message), { status: 403 });
    }
    return NextResponse.json(errorResponse("Internal server error"), { status: 500 });
  }
}
