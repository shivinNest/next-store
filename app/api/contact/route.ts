import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return errorResponse("Name, email and message are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Invalid email address", 400);
    }

    if (message.length < 10) {
      return errorResponse("Message must be at least 10 characters", 400);
    }

    // In production, send email via nodemailer here
    console.log("📬 Contact form submission:", { name, email, phone, subject, message });

    return successResponse({ message: "Your message has been received. We'll get back to you within 24 hours." });
  } catch {
    return errorResponse("Failed to send message", 500);
  }
}
