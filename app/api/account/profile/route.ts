import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { saveFile } from "@/lib/upload";

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const avatarFile = formData.get("avatar") as File | null;

    const data: Record<string, unknown> = {};
    if (name?.trim()) data.name = name.trim();
    if (phone) data.phone = phone;

    if (avatarFile && avatarFile.size > 0) {
      data.avatar = await saveFile(avatarFile, "avatars");
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
