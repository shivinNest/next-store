import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const info = await transporter.sendMail({
    from: `"Saaviya" <${process.env.EMAIL_FROM || "noreply@saaviya.in"}>`,
    to,
    subject,
    html,
  });
  return info;
}

export function verificationEmailTemplate(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#9f523a;font-size:28px;margin:0;">saaviya.in</h1>
        <p style="color:#666;font-size:14px;">Your Fashion Destination</p>
      </div>
      <h2 style="color:#333;">Hi ${name},</h2>
      <p style="color:#555;line-height:1.6;">
        Thank you for registering with Saaviya! Please verify your email address to get started.
      </p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${url}" 
           style="background-color:#9f523a;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;">
          Verify Email Address
        </a>
      </div>
      <p style="color:#888;font-size:13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;
}

export function passwordResetEmailTemplate(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#9f523a;font-size:28px;margin:0;">Saaviya</h1>
        <p style="color:#666;font-size:14px;">Your Fashion Destination</p>
      </div>
      <h2 style="color:#333;">Hi ${name},</h2>
      <p style="color:#555;line-height:1.6;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${url}"
           style="background-color:#9f523a;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;">
          Reset Password
        </a>
      </div>
      <p style="color:#888;font-size:13px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;
}

export function orderConfirmationTemplate(
  name: string,
  orderNumber: string,
  total: string
) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#9f523a;font-size:28px;margin:0;">Saaviya</h1>
      </div>
      <h2 style="color:#333;">Order Received!</h2>
      <p style="color:#555;">Hi ${name}, your order <strong>#${orderNumber}</strong> has been received.</p>
      <p style="color:#555;">Total: <strong>₹${total}</strong></p>
      <p style="color:#555;">Your payment screenshot is under review. We'll update you once it's verified.</p>
      <div style="background:#f8f9fa;padding:15px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#666;font-size:14px;">
          Estimated delivery: 5-7 business days after verification.
        </p>
      </div>
    </div>
  `;
}
