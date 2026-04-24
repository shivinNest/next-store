export default function RefundPolicyPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      <h1 className="fw-bold mb-1">Refund &amp; Return Policy</h1>
      <p className="text-muted small mb-4">Last updated: April 2025</p>

      <p>We want you to love every purchase from <strong>saaviya.in</strong>. If you are not satisfied, here's how our return and refund process works.</p>

      {[
        {
          title: "Return Eligibility",
          items: [
            "Returns are accepted within 7 days of delivery.",
            "Items must be unused, unwashed, and in original packaging with tags intact.",
            "Sale / clearance items are not eligible for return.",
            "Customised or stitched orders cannot be returned.",
          ],
        },
        {
          title: "How to Initiate a Return",
          items: [
            "Email support@saaviya.in with your order number and reason for return.",
            "Our team will review and confirm eligibility within 24 hours.",
            "You will be asked to courier the item to our warehouse address.",
            "Return shipping charges (₹80–₹150) are borne by the customer unless the item is defective.",
          ],
        },
        {
          title: "Refund Process",
          items: [
            "Refunds are processed within 5–7 business days after we receive and inspect the item.",
            "Refunds are issued to the original payment method (UPI / bank account).",
            "You will receive an email confirmation once the refund is processed.",
          ],
        },
        {
          title: "Damaged or Wrong Items",
          items: [
            "If you receive a damaged or wrong item, contact us within 48 hours of delivery.",
            "Share photos of the item and packaging at support@saaviya.in.",
            "We will arrange a free pickup and replacement or full refund.",
          ],
        },
      ].map((s) => (
        <div key={s.title} className="mb-4">
          <h5 className="fw-semibold mb-2">{s.title}</h5>
          <ul className="text-muted ps-3">
            {s.items.map((item) => <li key={item} className="mb-1">{item}</li>)}
          </ul>
        </div>
      ))}

      <div className="alert alert-primary small mt-4">
        <i className="bi bi-info-circle me-2" />
        For any return / refund queries, email <strong>support@saaviya.in</strong> or call <strong>+91 94001 46232</strong> (Mon–Sat, 9AM–6PM).
      </div>
    </div>
  );
}
