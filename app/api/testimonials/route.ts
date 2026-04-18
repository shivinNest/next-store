import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/utils";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return successResponse(testimonials);
}
