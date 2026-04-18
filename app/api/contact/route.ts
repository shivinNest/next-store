import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(errorResponse("Name, email and message are required"), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(errorResponse("Invalid email address"), { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json(errorResponse("Message must be at least 10 characters"), { status: 400 });
    }

    // In production, send email via nodemailer here
    console.log("📬 Contact form submission:", { name, email, phone, subject, message });

    return NextResponse.json(successResponse({ message: "Your message has been received. We'll get back to you within 24 hours." }));
  } catch {
    return NextResponse.json(errorResponse("Failed to send message"), { status: 500 });
  }
}
