"use client";
import { useState } from "react";

const CONTACT_DETAILS = [
  {
    icon: "bi-geo-alt-fill",
    title: "Our Store",
    lines: ["12, Fashion Street", "Lajpat Nagar, New Delhi – 110024", "India"],
  },
  {
    icon: "bi-envelope-fill",
    title: "Email Us",
    lines: ["support@saaviya.in", "orders@saaviya.in"],
  },
  {
    icon: "bi-telephone-fill",
    title: "Call Us",
    lines: ["+91 94001 46232"],
  },
  {
    icon: "bi-clock-fill",
    title: "Working Hours",
    lines: ["Monday – Saturday", "9:00 AM – 6:00 PM IST"],
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid 10-digit phone number.";
    }
    if (!form.message.trim()) {
      errs.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMsg("");
    if (!validate()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResponseMsg(data.data.message);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setResponseMsg("Network error. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        .hero-contact {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-contact::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-contact-content {
          position: relative;
          z-index: 1;
        }
        .contact-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
        }
        .contact-card:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.15) !important;
          border-color: rgba(159, 82, 58, 0.2) !important;
          transform: translateY(-4px);
        }
        .contact-icon {
          color: #9f523a;
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }
        .contact-card h6 {
          color: #1a1a1a;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .contact-card p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .form-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 4px 16px rgba(159, 82, 58, 0.08);
          animation: slideInUp 0.6s ease-out;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-card h2 {
          color: #1a1a1a;
          font-weight: 800;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }
        .form-card > p {
          color: #666;
          font-size: 0.95rem;
        }
        .form-label {
          color: #1a1a1a;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }
        .form-control, .form-select {
          border: 1px solid rgba(159, 82, 58, 0.2) !important;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #333;
          font-size: 0.95rem;
        }
        .form-control:focus, .form-select:focus {
          border-color: #9f523a !important;
          box-shadow: 0 0 0 3px rgba(159, 82, 58, 0.1) !important;
          color: #333;
        }
        .form-control::placeholder {
          color: #999;
        }
        .input-group-text {
          background: white;
          border: 1px solid rgba(159, 82, 58, 0.2) !important;
          color: #666 !important;
          font-weight: 600;
        }
        .btn-submit {
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.4);
          transform: translateY(-2px);
        }
        .btn-submit:disabled {
          opacity: 0.7;
        }
        .alert-success {
          background: rgba(32, 201, 151, 0.1) !important;
          border: 1px solid rgba(32, 201, 151, 0.3) !important;
          border-left: 4px solid #20c997 !important;
          color: #155724 !important;
        }
        .alert-danger {
          background: rgba(220, 53, 69, 0.1) !important;
          border: 1px solid rgba(220, 53, 69, 0.3) !important;
          border-left: 4px solid #dc3545 !important;
          color: #721c24 !important;
        }
        .social-buttons {
          display: flex;
          gap: 12px;
        }
        .social-btn {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          border: 2px solid rgba(159, 82, 58, 0.2);
          background: white;
          color: #9f523a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          font-size: 1.1rem;
        }
        .social-btn:hover {
          border-color: #9f523a;
          background: #9f523a;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.2);
        }
        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(159, 82, 58, 0.1);
          border: 1px solid rgba(159, 82, 58, 0.1);
        }
        .security-notice {
          background: rgba(32, 201, 151, 0.05);
          border: 1px solid rgba(32, 201, 151, 0.2);
          border-left: 4px solid #20c997;
          padding: 1rem;
          border-radius: 8px;
          color: #155724;
          font-size: 0.9rem;
          margin-top: 1.5rem;
        }
        .security-notice i {
          color: #20c997;
        }
        .follow-section h6 {
          color: #1a1a1a;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          position: relative;
          padding-bottom: 0.75rem;
        }
        .follow-section h6::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 25px;
          height: 2px;
          background: #9f523a;
          border-radius: 1px;
        }
      `}</style>

      {/* Hero */}
      <div className="hero-contact py-5 text-white">
        <div className="container hero-contact-content">
          <h1 className="fw-bold" style={{ fontSize: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.5px" }}>
            Contact Us
          </h1>
          <p className="lead" style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: 0, maxWidth: "600px" }}>
            We&apos;d love to hear from you. Let us know how we can help.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">

          {/* Left: Details + Map */}
          <div className="col-lg-5">

            {/* Contact detail cards */}
            <div className="row g-3 mb-4">
              {CONTACT_DETAILS.map((d) => (
                <div key={d.title} className="col-6">
                  <div className="contact-card">
                    <i className={`bi ${d.icon} contact-icon`} />
                    <h6>{d.title}</h6>
                    {d.lines.map((line) => (
                      <p key={line} className="mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="map-container" style={{ height: 280 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.234!2d77.2369!3d28.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3b5bef6de13%3A0x7e4c3b0e7e4e3b0e!2sLajpat+Nagar%2C+New+Delhi%2C+Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="saaviya.in location"
              />
            </div>

            {/* Social media */}
            <div className="follow-section mt-4">
              <h6>Follow Us</h6>
              <div className="social-buttons">
                {[
                  { icon: "bi-instagram", label: "Instagram", href: "https://www.instagram.com/saa.viya" },
                  { icon: "bi-facebook", label: "Facebook" },
                  { icon: "bi-twitter-x", label: "Twitter" },
                  { icon: "bi-youtube", label: "YouTube" },
                  { icon: "bi-pinterest", label: "Pinterest" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href ?? "#"}
                    target={s.href ? "_blank" : undefined}
                    rel={s.href ? "noopener noreferrer" : undefined}
                    className="social-btn"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="col-lg-7">
            <div className="form-card">
              <h2>Send us a Message</h2>
              <p className="mb-4">Fill out the form and our team will get back to you within 24 hours.</p>

              {status === "success" && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-check-circle-fill fs-5" />
                  <div>
                    <strong>Message sent!</strong>
                    <p className="mb-0 small">{responseMsg}</p>
                  </div>
                </div>
              )}
              {status === "error" && (
                <div className="alert alert-danger mb-4">
                  <i className="bi bi-exclamation-circle me-2" />{responseMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">+91</span>
                      <input
                        type="tel"
                        className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
                        placeholder="94001 46232"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        maxLength={10}
                      />
                      {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order Related</option>
                      <option value="return">Return / Refund</option>
                      <option value="shipping">Shipping Query</option>
                      <option value="product">Product Question</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message *</label>
                    <textarea
                      className={`form-control ${fieldErrors.message ? "is-invalid" : ""}`}
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {fieldErrors.message && <div className="invalid-feedback">{fieldErrors.message}</div>}
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <><span className="spinner-border spinner-border-sm me-2" style={{ borderWidth: "2px" }} />Sending...</>
                      ) : (
                        <><i className="bi bi-send me-2" />Send Message</>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="security-notice">
                <i className="bi bi-shield-check me-2" />
                Your details are safe with us. We never share your data with third parties.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
