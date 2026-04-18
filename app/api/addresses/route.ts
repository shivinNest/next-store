import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { validateAddress } from "@/lib/validations";

export async function GET() {
  try {
    const user = await requireAuth();
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: addresses });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { isValid, errors } = validateAddress(body);

    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    // If setting as default, unset current default
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const count = await prisma.address.count({ where: { userId: user.id } });
    const isDefault = body.isDefault || count === 0;

    const address = await prisma.address.create({
      data: { ...body, userId: user.id, isDefault },
    });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
