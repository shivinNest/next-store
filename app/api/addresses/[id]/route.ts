import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { validateAddress } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { isValid, errors } = validateAddress(body);

    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: address });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
