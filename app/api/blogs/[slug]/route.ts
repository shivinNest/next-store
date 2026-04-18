import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug, isPublished: true },
  });

  if (!blog) {
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: blog });
}
