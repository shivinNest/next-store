"use client";
import { useEffect, useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFaqs(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filtered =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  // Default FAQs for demo when no data
  const demoFaqs: FaqItem[] = loading
    ? []
    : faqs.length === 0
    ? [
        { id: "1", question: "How do I track my order?", answer: "You can track your order from the My Orders section in your account.", category: "orders" },
        { id: "2", question: "What is the return policy?", answer: "We offer a 7-day return policy on all products. Items must be unused and in original packaging.", category: "returns" },
        { id: "3", question: "How long does delivery take?", answer: "Orders typically take 5-7 business days after payment verification.", category: "shipping" },
        { id: "4", question: "What payment methods are accepted?", answer: "We currently accept UPI payments. Pay by scanning the QR code at checkout.", category: "payment" },
        { id: "5", question: "How do I change my address?", answer: "Go to My Account → Addresses to add or edit your delivery addresses.", category: "account" },
        { id: "6", question: "Can I cancel my order?", answer: "Orders can be cancelled before they are verified. Contact support for assistance.", category: "orders" },
      ]
    : faqs;

  const displayFaqs =
    activeCategory === "all"
      ? demoFaqs
      : demoFaqs.filter((f) => f.category === activeCategory);

  const allCategories = [
    "all",
    ...Array.from(new Set(demoFaqs.map((f) => f.category))),
  ];

  return (
    <div style={{ background: "#faf9f7", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
        padding: "72px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container text-center position-relative">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 100, padding: "6px 18px",
            fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)", marginBottom: 20,
          }}>
            <i className="bi bi-question-circle" />
            Help Centre
          </span>
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 16, margin: "0 0 14px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Everything you need to know about our products, orders, and services.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>

        {/* Category Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`btn ${
                    activeCategory === cat
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="row">
            <div className="col-lg-8 mx-auto text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : displayFaqs.length > 0 ? (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                {displayFaqs.map((faq, idx) => (
                  <div key={faq.id} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${faq.id}`}
                        aria-expanded="false"
                        aria-controls={`faq-${faq.id}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`faq-${faq.id}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mx-auto text-center py-5">
              <h5 className="text-muted">No FAQs found in this category</h5>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="row mt-5">
          <div className="col-lg-8 mx-auto">
            <div style={{
              background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
              borderRadius: 16,
              padding: "48px 40px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💬</div>
              <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 8 }}>Still can&apos;t find the answer?</h4>
              <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: 24, fontSize: "0.95rem" }}>Our support team is ready to help you Mon–Sat, 9 AM – 6 PM.</p>
              <a href="mailto:support@saaviya.in" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)",
                color: "#fff", padding: "12px 28px", borderRadius: 8,
                fontWeight: 600, fontSize: "0.95rem", textDecoration: "none",
                transition: "background 0.2s",
              }}>
                <i className="bi bi-envelope" /> Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-primary { background-color: #9f523a; border-color: #9f523a; }
        .btn-primary:hover { background-color: #7a3f2c; border-color: #7a3f2c; }
        .btn-outline-primary { color: #9f523a; border-color: #9f523a; }
        .btn-outline-primary:hover { background-color: #9f523a; border-color: #9f523a; color: white; }
        .accordion-button:not(.collapsed) { background-color: #faf9f7; color: #9f523a; box-shadow: none; }
        .accordion-button:focus { border-color: #9f523a; box-shadow: 0 0 0 0.25rem rgba(159,82,58,0.2); }
      `}</style>
    </div>
  );
}
