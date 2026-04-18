import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [slides, banners] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.banner.findMany({
      where: { isActive: true, position: "home" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  return NextResponse.json({ success: true, data: { slides, banners } });
}
