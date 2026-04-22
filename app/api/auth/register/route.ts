import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { validateRegister } from "@/lib/validations";
import { sendEmail, verificationEmailTemplate } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { isValid, errors } = validateRegister(body);

    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const { name, email, password } = body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verifyToken = uuidv4();
    const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExp,
      },
    });

    // Send verification email (non-blocking)
    sendEmail({
      to: email,
      subject: "Verify your saaviya.in account",
      html: verificationEmailTemplate(name, verifyToken),
    }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
