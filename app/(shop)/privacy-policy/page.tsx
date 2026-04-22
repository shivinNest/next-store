export default function PrivacyPolicyPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      <h1 className="fw-bold mb-1">Privacy Policy</h1>
      <p className="text-muted small mb-4">Last updated: April 2025</p>

      <p>At <strong>saaviya.in</strong>, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.</p>

      {[
        {
          title: "1. Information We Collect",
          body: "We collect information you provide when registering an account, placing an order, or contacting us — including your name, email address, phone number, and delivery address. We also collect usage data such as pages visited, products viewed, and device/browser type.",
        },
        {
          title: "2. How We Use Your Information",
          body: "We use your information to process orders, send order confirmations and shipping updates, provide customer support, improve our services, and send promotional emails (only with your consent).",
        },
        {
          title: "3. Data Sharing",
          body: "We do not sell or rent your personal data to third parties. We may share data with trusted service providers (e.g. payment processors, courier partners) solely to fulfil your order.",
        },
        {
          title: "4. Cookies",
          body: "We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, though some features may not work as expected.",
        },
        {
          title: "5. Data Security",
          body: "We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls to protect your personal information.",
        },
        {
          title: "6. Your Rights",
          body: "You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at support@saaviya.in.",
        },
        {
          title: "7. Contact",
          body: "For privacy-related queries, email us at support@saaviya.in or write to us at 12, Fashion Street, Lajpat Nagar, New Delhi – 110024.",
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
