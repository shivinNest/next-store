export default function TermsOfServicePage() {
  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      <h1 className="fw-bold mb-1">Terms of Service</h1>
      <p className="text-muted small mb-4">Last updated: April 2025</p>

      <p>By accessing or using <strong>saaviya.in</strong>, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.</p>

      {[
        {
          title: "1. Use of the Website",
          body: "You must be at least 18 years old to use this website. You agree not to misuse the platform, submit false information, or engage in any unlawful activity.",
        },
        {
          title: "2. Product Information",
          body: "We make every effort to display product images and descriptions accurately. However, colours may vary slightly due to monitor settings. We reserve the right to modify or discontinue products at any time.",
        },
        {
          title: "3. Pricing",
          body: "All prices are in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices without prior notice.",
        },
        {
          title: "4. Payment",
          body: "Payments are currently accepted via UPI. Orders are confirmed only after successful payment. In case of payment failure, please try again or contact support.",
        },
        {
          title: "5. Order Cancellation",
          body: "Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible. Please contact support@saaviya.in immediately if you wish to cancel.",
        },
        {
          title: "6. Intellectual Property",
          body: "All content on saaviya.in including text, images, logos, and designs is the intellectual property of saaviya.in and may not be reproduced without written permission.",
        },
        {
          title: "7. Limitation of Liability",
          body: "saaviya.in shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
        },
        {
          title: "8. Governing Law",
          body: "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in New Delhi.",
        },
        {
          title: "9. Contact",
          body: "For questions about these terms, contact us at support@saaviya.in.",
        },
      ].map((s) => (
        <div key={s.title} className="mb-4">
          <h5 className="fw-semibold">{s.title}</h5>
          <p className="text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
