import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils";
import { sendEmail } from "@/lib/email";

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

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subjectLabel = subject
        ? `[${subject.charAt(0).toUpperCase() + subject.slice(1)}] `
        : "";

      await sendEmail({
        to: adminEmail,
        subject: `${subjectLabel}New Contact Form Submission — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;background:#fdf8f6;border-radius:12px;">
            <div style="background:linear-gradient(135deg,#9f523a,#7a3f2c);padding:24px 28px;border-radius:10px 10px 0 0;margin-bottom:0;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">New Contact Message</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Submitted via saaviya.in contact form</p>
            </div>
            <div style="background:#fff;padding:28px;border-radius:0 0 10px 10px;border:1px solid #f0ece8;border-top:none;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#888;font-weight:600;width:130px;">Name</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#111;font-weight:700;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#888;font-weight:600;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#9f523a;"><a href="mailto:${email}" style="color:#9f523a;text-decoration:none;">${email}</a></td>
                </tr>
                ${phone ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#888;font-weight:600;">Phone</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#111;">+91 ${phone}</td>
                </tr>` : ""}
                ${subject ? `<tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#888;font-weight:600;">Subject</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0ece8;color:#111;">${subject}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:14px 0 0;color:#888;font-weight:600;vertical-align:top;">Message</td>
                  <td style="padding:14px 0 0;color:#333;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</td>
                </tr>
              </table>
              <div style="margin-top:24px;padding:14px 16px;background:#fdf8f6;border-radius:8px;border-left:4px solid #9f523a;font-size:13px;color:#888;">
                Reply directly to this email to respond to ${name}.
              </div>
            </div>
            <p style="text-align:center;color:#bbb;font-size:12px;margin-top:16px;">saaviya.in · Automated notification</p>
          </div>
        `,
      });
    }

    return successResponse({ message: "Your message has been received. We\u2019ll get back to you within 24 hours." });
  } catch {
    return errorResponse("Failed to send message", 500);
  }
}
