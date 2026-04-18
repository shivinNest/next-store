export default function ShippingPolicyPage() {
  return (
    <div className="bg-light py-5">
      <style>{`
        .policy-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .policy-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(159, 82, 58, 0.1);
        }
        .policy-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 0.5rem;
        }
        .policy-header p {
          color: #666;
          font-size: 0.95rem;
        }
        .shipping-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }
        .shipping-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border-color: #9f523a;
          transform: translateY(-2px);
        }
        .shipping-card .card-icon {
          color: #9f523a;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .shipping-card h6 {
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .shipping-card .card-desc {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .shipping-badge {
          background-color: rgba(159, 82, 58, 0.1) !important;
          color: #9f523a !important;
          font-weight: 600;
          border: 1px solid rgba(159, 82, 58, 0.2);
          display: inline-block;
        }
        .policy-section {
          background: white;
          padding: 2rem;
          margin-bottom: 1.5rem;
          border-radius: 0.375rem;
          border-left: 4px solid #9f523a;
          transition: all 0.3s ease;
        }
        .policy-section:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }
        .policy-section h5 {
          color: #9f523a;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .policy-section p {
          color: #555;
          line-height: 1.7;
          margin: 0;
        }
      `}</style>

      <div className="container policy-container">
        {/* Header */}
        <div className="policy-header">
          <h1>Shipping Policy</h1>
          <p><i className="bi bi-calendar3 me-1"></i>Last updated: April 2026</p>
        </div>

        {/* Intro */}
        <p className="lead text-center mb-5" style={{ color: "#555" }}>
          We ship across India. Here is everything you need to know about shipping and delivery at <strong>Saavia</strong>.
        </p>

        {/* Shipping Options */}
        <div className="row g-3 mb-5">
          {[
            { icon: "bi-truck", title: "Standard Delivery", desc: "5–7 business days", price: "₹79 (Free above ₹999)" },
            { icon: "bi-lightning-charge", title: "Express Delivery", desc: "2–3 business days", price: "₹149" },
            { icon: "bi-gift", title: "Same-Day Delivery", desc: "Delhi NCR only", price: "₹199" },
          ].map((s) => (
            <div key={s.title} className="col-md-4">
              <div className="shipping-card p-4">
                <i className={`bi ${s.icon} card-icon`} />
                <h6>{s.title}</h6>
                <p className="card-desc">{s.desc}</p>
                <span className="badge shipping-badge">{s.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Sections */}
        <div className="mb-4">
          {[
            {
              title: "Order Processing Time",
              body: "Orders are processed within 24–48 hours on business days (Monday to Saturday). Orders placed on Sundays or public holidays will be processed the next business day.",
            },
            {
              title: "Tracking Your Order",
              body: "Once your order is shipped, you will receive an email with a tracking link. You can also track your order by logging into your account and visiting Order History.",
            },
            {
              title: "Delivery Attempts",
              body: "Our courier partners will attempt delivery up to 3 times. If the delivery fails, the package will be returned to our warehouse and a re-delivery fee may apply.",
            },
            {
              title: "Remote Areas",
              body: "Delivery to remote or hilly areas may take an additional 2–3 days. We currently ship to all states and union territories in India.",
            },
            {
              title: "Shipping Delays",
              body: "During peak seasons (festivals, sale events) or due to unforeseen circumstances (weather, strikes), delivery times may be slightly longer. We appreciate your patience.",
            },
          ].map((s) => (
            <div key={s.title} className="policy-section">
              <h5>
                <i className="bi bi-check-circle me-2"></i>
                {s.title}
              </h5>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card border-0 mt-5" style={{
          background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
          color: "white"
        }}>
          <div className="card-body text-center p-4">
            <h5 className="card-title fw-bold mb-2">Questions about shipping?</h5>
            <p className="card-text mb-3">Our support team is here to help</p>
            <a href="/contact" className="btn btn-light">
              <i className="bi bi-question-circle me-1"></i>Get Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
