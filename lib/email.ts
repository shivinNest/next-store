import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  authMethod: "PLAIN",
} as Parameters<typeof nodemailer.createTransport>[0]);

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

// ─── Shared layout wrapper ────────────────────────────────────────────────────
function emailLayout(logoUrl: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Saaviya</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Logo header -->
        <tr>
          <td style="background:linear-gradient(135deg,#9f523a,#7a3f2c);border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <img src="${logoUrl}" alt="Saaviya" style="height:48px;max-width:180px;object-fit:contain;display:block;margin:0 auto;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 48px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf9f7;border-top:1px solid #ece9e4;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 12px;font-size:12px;color:#999;line-height:1.6;">Fashion that speaks for you</p>
            <p style="margin:0;font-size:11px;color:#bbb;">
              © ${new Date().getFullYear()} Saaviya. All rights reserved.<br />
              You received this email because you have an account with us.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Verification ─────────────────────────────────────────────────────────────
export function verificationEmailTemplate(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assets/saaviya_logo_2026.png`;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1a1a1a;letter-spacing:-0.3px;">Verify your email address</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#999;">One last step to complete your registration</p>
    <hr style="border:none;border-top:1px solid #f0ebe6;margin:0 0 28px;" />
    <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Hi <strong style="color:#1a1a1a;">${name}</strong>,</p>
    <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.75;">
      Thank you for creating an account with Saaviya! To start exploring our collection, please verify your email address by clicking the button below.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:8px 0 32px;">
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#9f523a,#7a3f2c);color:#ffffff;text-decoration:none;padding:15px 44px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.04em;">
          Verify Email Address
        </a>
      </td></tr>
    </table>
    <div style="background:#faf9f7;border:1px solid #ece9e4;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#777;line-height:1.6;">
        Or copy and paste this link into your browser:<br />
        <a href="${url}" style="color:#9f523a;word-break:break-all;font-size:12px;">${url}</a>
      </p>
    </div>
    <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">
      This link expires in <strong>24 hours</strong>. If you didn&apos;t create a Saaviya account, you can safely ignore this email.
    </p>
  `;

  return emailLayout(logoUrl, content);
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export function passwordResetEmailTemplate(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assets/saaviya_logo_2026.png`;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1a1a1a;letter-spacing:-0.3px;">Reset your password</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#999;">We received a request to reset your password</p>
    <hr style="border:none;border-top:1px solid #f0ebe6;margin:0 0 28px;" />
    <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Hi <strong style="color:#1a1a1a;">${name}</strong>,</p>
    <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.75;">
      We received a request to reset the password for your Saaviya account. Click the button below to choose a new password.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:8px 0 32px;">
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#9f523a,#7a3f2c);color:#ffffff;text-decoration:none;padding:15px 44px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.04em;">
          Reset Password
        </a>
      </td></tr>
    </table>
    <div style="background:#faf9f7;border:1px solid #ece9e4;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#777;line-height:1.6;">
        Or copy and paste this link into your browser:<br />
        <a href="${url}" style="color:#9f523a;word-break:break-all;font-size:12px;">${url}</a>
      </p>
    </div>
    <div style="background:#fff8f6;border-left:3px solid #9f523a;padding:14px 18px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#777;line-height:1.6;">
        ⚠️ If you did not request a password reset, please ignore this email or contact us at
        <a href="mailto:support@saaviya.in" style="color:#9f523a;">support@saaviya.in</a> if you have concerns.
      </p>
    </div>
    <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">This link expires in <strong>1 hour</strong>.</p>
  `;

  return emailLayout(logoUrl, content);
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
export function orderConfirmationTemplate(
  name: string,
  orderNumber: string,
  total: string
) {
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assets/saaviya_logo_2026.png`;
  const ordersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders`;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1a1a1a;letter-spacing:-0.3px;">Order received! 🎉</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#999;">We&apos;ve got your order and it&apos;s being reviewed</p>
    <hr style="border:none;border-top:1px solid #f0ebe6;margin:0 0 28px;" />
    <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">Hi <strong style="color:#1a1a1a;">${name}</strong>,</p>

    <!-- Order summary card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #ece9e4;border-radius:10px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#999;padding-bottom:12px;">Order Summary</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#555;padding:6px 0;">Order Number</td>
              <td align="right" style="font-size:14px;font-weight:700;color:#1a1a1a;">#${orderNumber}</td>
            </tr>
            <tr>
              <td colspan="2"><hr style="border:none;border-top:1px solid #ece9e4;margin:10px 0;" /></td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#555;padding:6px 0;">Order Total</td>
              <td align="right" style="font-size:16px;font-weight:800;color:#9f523a;">₹${total}</td>
            </tr>
            <tr>
              <td colspan="2"><hr style="border:none;border-top:1px solid #ece9e4;margin:10px 0;" /></td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#555;padding:6px 0;">Payment Status</td>
              <td align="right">
                <span style="background:#fff8e1;color:#e65100;font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;">Under Review</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.75;">
      Your payment screenshot is under review. Once verified by our team, we will process your order and send you a dispatch confirmation.
    </p>

    <!-- Delivery info -->
    <div style="background:#f0faf5;border:1px solid #c3e6d1;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#2d6a4f;line-height:1.65;">
        🚚 <strong>Estimated Delivery:</strong> 5–7 business days after payment verification.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0 32px;">
        <a href="${ordersUrl}" style="display:inline-block;background:linear-gradient(135deg,#9f523a,#7a3f2c);color:#ffffff;text-decoration:none;padding:13px 36px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.04em;">
          Track My Order
        </a>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#aaa;line-height:1.7;">
      Questions? Reply to this email or reach us at
      <a href="mailto:support@saaviya.in" style="color:#9f523a;">support@saaviya.in</a>
    </p>
  `;

  return emailLayout(logoUrl, content);
}

