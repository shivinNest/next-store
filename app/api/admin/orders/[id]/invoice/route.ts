import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const itemRows = order.items.map((item, i) => `
      <tr>
        <td class="center">${i + 1}</td>
        <td>${item.name}<br/><span class="muted">Size: ${item.size}</span></td>
        <td class="center">${item.quantity}</td>
        <td class="right">₹${fmt(Number(item.price))}</td>
        <td class="right">₹${fmt(Number(item.price) * item.quantity)}</td>
      </tr>
    `).join("");

    const subtotal = Number(order.subtotal);
    const shipping = Number(order.shippingCharge);
    const couponDiscount = Number(order.couponDiscount);
    const total = Number(order.total);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${order.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; }

    .page { max-width: 800px; margin: 0 auto; padding: 48px 48px 64px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 28px; border-bottom: 2px solid #9f523a; }
    .brand-name { font-size: 26px; font-weight: 900; color: #9f523a; letter-spacing: -0.03em; }
    .brand-tagline { font-size: 11px; color: #aaa; margin-top: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
    .invoice-meta { text-align: right; }
    .invoice-title { font-size: 18px; font-weight: 800; color: #111; letter-spacing: -0.02em; }
    .invoice-number { font-size: 12px; color: #9f523a; font-weight: 700; margin-top: 4px; }
    .invoice-date { font-size: 11px; color: #888; margin-top: 2px; }

    /* Notice */
    .notice { background: #fdf3ef; border: 1px solid #f0d0c4; border-radius: 6px; padding: 10px 16px; margin-bottom: 32px; font-size: 11.5px; color: #7a3f2c; text-align: center; letter-spacing: 0.01em; }

    /* Parties */
    .parties { display: flex; gap: 24px; margin-bottom: 32px; }
    .party { flex: 1; }
    .party-label { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #9f523a; margin-bottom: 8px; }
    .party-name { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 3px; }
    .party-line { font-size: 12px; color: #555; line-height: 1.6; }

    /* Items table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
    thead th { background: #9f523a; color: #fff; padding: 9px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    tbody tr:nth-child(even) { background: #faf9f7; }
    tbody td { padding: 10px 12px; border-bottom: 1px solid #ece9e4; font-size: 12.5px; vertical-align: top; }
    tbody td .muted { font-size: 11px; color: #999; margin-top: 2px; }
    .center { text-align: center; }
    .right { text-align: right; }

    /* Totals */
    .totals { display: flex; justify-content: flex-end; margin-top: 0; }
    .totals-table { width: 280px; border: 1px solid #ece9e4; border-top: none; }
    .totals-table td { padding: 7px 12px; font-size: 12.5px; border-bottom: 1px solid #ece9e4; }
    .totals-table .label { color: #666; }
    .totals-table .value { text-align: right; font-weight: 600; color: #111; }
    .totals-table .total-row td { background: #9f523a; color: #fff; font-weight: 800; font-size: 14px; border: none; }
    .totals-table .free { color: #15803d; font-weight: 700; }
    .totals-table .discount { color: #15803d; font-weight: 700; }

    /* Footer */
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ece9e4; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 11px; color: #aaa; max-width: 340px; line-height: 1.7; }
    .footer-brand { font-size: 11px; color: #ccc; text-align: right; }
    .footer-brand strong { color: #9f523a; font-size: 13px; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 32px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Print button (hidden when printing) -->
    <div class="no-print" style="text-align:right;margin-bottom:20px;">
      <button onclick="window.print()" style="background:#9f523a;color:#fff;border:none;padding:9px 20px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;margin-right:8px;">
        ⬇ Save / Print PDF
      </button>
      <button onclick="window.close()" style="background:#f5f0eb;color:#555;border:1px solid #ddd;padding:9px 20px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;">
        Close
      </button>
    </div>

    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-name">Saaviya</div>
        <div class="brand-tagline">Fashion that speaks for you</div>
        <div style="margin-top:10px;font-size:11px;color:#888;line-height:1.7;">
          Perambra, Kozhikode, Kerala – 673525<br/>
          support@saaviya.in &nbsp;|&nbsp; +91 94001 46232
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-number">#${order.orderNumber}</div>
        <div class="invoice-date">${date}</div>
        <div style="margin-top:10px;font-size:11px;color:#888;">
          Status: <strong style="color:#9f523a;">${order.status.replace(/_/g, " ")}</strong>
        </div>
      </div>
    </div>

    <!-- No-tax notice -->
    <div class="notice">
      This invoice does not include any tax (GST/VAT). All prices are inclusive of applicable taxes.
    </div>

    <!-- Parties -->
    <div class="parties">
      <div class="party">
        <div class="party-label">Sold by</div>
        <div class="party-name">Saaviya</div>
        <div class="party-line">Perambra, Kozhikode<br/>Kerala, India – 673525<br/>support@saaviya.in</div>
      </div>
      <div class="party">
        <div class="party-label">Bill to / Ship to</div>
        <div class="party-name">${order.shippingName ?? order.user.name}</div>
        <div class="party-line">
          ${order.shippingLine1 ?? ""}${order.shippingLine2 ? ", " + order.shippingLine2 : ""}<br/>
          ${order.shippingCity ?? ""}, ${order.shippingState ?? ""} – ${order.shippingPincode ?? ""}<br/>
          ${order.shippingPhone ? order.shippingPhone + "<br/>" : ""}
          ${order.user.email}
        </div>
      </div>
      <div class="party">
        <div class="party-label">Payment</div>
        <div class="party-name">${order.paymentMethod === "RAZORPAY" ? "Razorpay (Online)" : "UPI Transfer"}</div>
        ${order.razorpayPaymentId ? `<div class="party-line">Payment ID:<br/><span style="font-family:monospace;font-size:11px;">${order.razorpayPaymentId}</span></div>` : ""}
      </div>
    </div>

    <!-- Items -->
    <table>
      <thead>
        <tr>
          <th class="center" style="width:40px;">#</th>
          <th>Item Description</th>
          <th class="center" style="width:60px;">Qty</th>
          <th class="right" style="width:100px;">Unit Price</th>
          <th class="right" style="width:110px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <table class="totals-table">
        <tr>
          <td class="label">Subtotal</td>
          <td class="value">₹${fmt(subtotal)}</td>
        </tr>
        <tr>
          <td class="label">Shipping</td>
          <td class="value ${shipping === 0 ? "free" : ""}">${shipping === 0 ? "FREE" : "₹" + fmt(shipping)}</td>
        </tr>
        ${couponDiscount > 0 ? `
        <tr>
          <td class="label">Coupon${order.couponCode ? ` (${order.couponCode})` : ""}</td>
          <td class="value discount">−₹${fmt(couponDiscount)}</td>
        </tr>` : ""}
        <tr class="total-row">
          <td class="label">Total</td>
          <td class="value">₹${fmt(total)}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-note">
        Thank you for shopping with Saaviya! For any queries regarding this order, please contact us at support@saaviya.in or call +91 94001 46232.
      </div>
      <div class="footer-brand">
        <strong>Saaviya</strong><br/>
        saaviya.in
      </div>
    </div>

  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
