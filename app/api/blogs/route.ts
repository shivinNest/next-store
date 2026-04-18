import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(sp);

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          author: true,
          tags: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where: { isPublished: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
