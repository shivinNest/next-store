"use client";
import { useEffect, useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  all:      { icon: "bi-grid-fill",          label: "All Topics" },
  orders:   { icon: "bi-bag-check-fill",     label: "Orders" },
  shipping: { icon: "bi-truck",              label: "Shipping" },
  returns:  { icon: "bi-arrow-return-left",  label: "Returns" },
  payment:  { icon: "bi-credit-card-fill",   label: "Payment" },
  account:  { icon: "bi-person-circle",      label: "Account" },
};

function catMeta(cat: string) {
  return CATEGORY_META[cat] ?? { icon: "bi-chat-dots-fill", label: cat.charAt(0).toUpperCase() + cat.slice(1) };
}

const DEMO_FAQS: FaqItem[] = [
  { id: "1", question: "How do I track my order?", answer: "Once your order is shipped, you'll receive an email with a tracking link. You can also visit My Account → Orders and click on your order to see the current status and tracking details.", category: "orders" },
  { id: "2", question: "Can I cancel my order?", answer: "Orders can be cancelled before they are verified by our team. Please contact support immediately if you wish to cancel. Once dispatched, cancellations are not possible.", category: "orders" },
  { id: "3", question: "How long does delivery take?", answer: "Standard delivery takes 5–7 business days after payment verification. Express delivery options may be available at checkout depending on your location.", category: "shipping" },
  { id: "4", question: "Do you offer free shipping?", answer: "Yes! Orders above ₹999 qualify for free shipping. For orders below that, a flat shipping fee of ₹50 applies.", category: "shipping" },
  { id: "5", question: "What is your return policy?", answer: "We offer a 7-day return window from the date of delivery. Items must be unused, unwashed, and in original packaging with tags intact. Customised or sale items are not eligible for return.", category: "returns" },
  { id: "6", question: "How do I initiate a return?", answer: "Please contact our support team at support@saaviya.in with your order number and reason for return. We'll arrange a pickup within 2 business days.", category: "returns" },
  { id: "7", question: "What payment methods are accepted?", answer: "We currently accept UPI payments. At checkout, scan the QR code or use your preferred UPI app (GPay, PhonePe, Paytm, etc.) to complete the payment.", category: "payment" },
  { id: "8", question: "Is my payment information secure?", answer: "Yes. We do not store any payment credentials. All transactions are processed via secure UPI infrastructure.", category: "payment" },
  { id: "9", question: "How do I update my delivery address?", answer: "Go to My Account → Addresses to add, edit, or remove your saved delivery addresses at any time.", category: "account" },
  { id: "10", question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page and enter your registered email address. You'll receive a reset link within a few minutes.", category: "account" },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFaqs(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const allFaqs = !loading && faqs.length === 0 ? DEMO_FAQS : faqs;

  const allCategories = ["all", ...Array.from(new Set(allFaqs.map((f) => f.category)))];

  const displayed = allFaqs.filter((f) => {
    const matchCat = activeCategory === "all" || f.category === activeCategory;
    const q = search.toLowerCase().trim();
    const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const countFor = (cat: string) =>
    cat === "all" ? allFaqs.length : allFaqs.filter((f) => f.category === cat).length;

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div style={{ background: "#faf9f7", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #2d1510 0%, #7a3f2c 50%, #9f523a 100%)",
        padding: "80px 0 70px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative radial glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 70% at 80% 50%, rgba(200,122,90,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Ghost watermark */}
        <div style={{ position: "absolute", right: "-2%", top: "50%", transform: "translateY(-50%)", fontSize: "clamp(5rem,15vw,12rem)", fontWeight: 900, color: "rgba(255,255,255,0.04)", letterSpacing: "-0.05em", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
          FAQ
        </div>

        <div className="container position-relative text-center">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.88)", marginBottom: 18,
          }}>
            <i className="bi bi-question-circle-fill" style={{ fontSize: "0.75rem" }} />
            Help Centre
          </span>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.9rem, 4.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 14px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.98rem", lineHeight: 1.75, maxWidth: 460, margin: "0 auto 36px" }}>
            Quick answers to the questions we hear most often.
          </p>
          {/* Search bar */}
          <div style={{ maxWidth: 500, margin: "0 auto", position: "relative" }}>
            <i className="bi bi-search" style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#9f523a", fontSize: "1rem", zIndex: 2 }} />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
              style={{
                width: "100%", padding: "14px 18px 14px 46px",
                borderRadius: 50, border: "none", outline: "none",
                fontSize: "0.95rem", background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                color: "#1a1a1a",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0 }}
              >
                <i className="bi bi-x-circle-fill" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="row g-5">

          {/* Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div style={{ position: "sticky", top: 24 }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 16 }}>
                Browse by Topic
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {allCategories.map((cat) => {
                  const meta = catMeta(cat);
                  const active = activeCategory === cat && !search;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setSearch(""); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 10, padding: "11px 14px",
                        border: active ? "1.5px solid #9f523a" : "1.5px solid transparent",
                        borderRadius: 10,
                        background: active ? "linear-gradient(135deg, rgba(159,82,58,0.08), rgba(122,63,44,0.06))" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.18s",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(159,82,58,0.05)"; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                          background: active ? "linear-gradient(135deg, #9f523a, #7a3f2c)" : "#f0ede9",
                          transition: "all 0.18s",
                        }}>
                          <i className={`bi ${meta.icon}`} style={{ fontSize: "0.85rem", color: active ? "#fff" : "#9f523a" }} />
                        </span>
                        <span style={{ fontSize: "0.88rem", fontWeight: active ? 700 : 500, color: active ? "#9f523a" : "#444", transition: "color 0.18s" }}>
                          {meta.label}
                        </span>
                      </span>
                      <span style={{
                        minWidth: 22, height: 22, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.68rem", fontWeight: 700,
                        background: active ? "#9f523a" : "#ede8e3",
                        color: active ? "#fff" : "#888",
                        transition: "all 0.18s",
                      }}>
                        {countFor(cat)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "#ede8e3", margin: "28px 0" }} />

              {/* Support card */}
              <div style={{ background: "linear-gradient(135deg, #2d1510, #7a3f2c)", borderRadius: 14, padding: "22px 18px", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <i className="bi bi-headset" style={{ color: "#fff", fontSize: "1.2rem" }} />
                </div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.88rem", marginBottom: 4 }}>Still need help?</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", marginBottom: 16, lineHeight: 1.5 }}>Mon–Sat, 9 AM – 6 PM</p>
                <a href="mailto:support@saaviya.in" style={{ display: "block", padding: "9px 0", borderRadius: 8, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                  <i className="bi bi-envelope me-1" /> Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-12 col-lg-9">

            {/* Mobile category pills */}
            <div className="d-flex d-lg-none flex-nowrap gap-2 pb-2 mb-4" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
              {allCategories.map((cat) => {
                const meta = catMeta(cat);
                const active = activeCategory === cat && !search;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearch(""); }}
                    style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 50,
                      border: active ? "1.5px solid #9f523a" : "1.5px solid #e0d9d3",
                      background: active ? "#9f523a" : "#fff",
                      color: active ? "#fff" : "#555",
                      fontWeight: active ? 700 : 500, fontSize: "0.82rem",
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    <i className={`bi ${meta.icon}`} style={{ fontSize: "0.8rem" }} />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Results header */}
            {!loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>
                  {search
                    ? <><strong style={{ color: "#333" }}>{displayed.length}</strong> result{displayed.length !== 1 ? "s" : ""} for &ldquo;<em>{search}</em>&rdquo;</>
                    : <><strong style={{ color: "#333" }}>{displayed.length}</strong> question{displayed.length !== 1 ? "s" : ""} in <strong style={{ color: "#9f523a" }}>{catMeta(activeCategory).label}</strong></>
                  }
                </p>
                {search && (
                  <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9f523a", fontSize: "0.8rem", fontWeight: 600, padding: 0 }}>
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4,5].map((i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #f0ede9" }}>
                    <div style={{ height: 14, width: `${55 + i * 7}%`, background: "#f0ede9", borderRadius: 6, marginBottom: 10, animation: "pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ height: 10, width: "40%", background: "#f7f4f1", borderRadius: 6 }} />
                  </div>
                ))}
              </div>
            )}

            {/* FAQ accordion */}
            {!loading && displayed.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {displayed.map((faq, idx) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        border: isOpen ? "1.5px solid rgba(159,82,58,0.3)" : "1.5px solid #f0ede9",
                        boxShadow: isOpen ? "0 6px 28px rgba(159,82,58,0.08)" : "none",
                        overflow: "hidden",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                    >
                      <button
                        onClick={() => toggle(faq.id)}
                        style={{
                          width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                          padding: "20px 22px",
                          background: "none", border: "none", cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
                          {/* Index badge */}
                          <span style={{
                            minWidth: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                            background: isOpen ? "linear-gradient(135deg, #9f523a, #7a3f2c)" : "#f7f4f1",
                            fontSize: "0.72rem", fontWeight: 800,
                            color: isOpen ? "#fff" : "#bbb",
                            transition: "all 0.2s",
                          }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: "0.97rem", fontWeight: 600, color: isOpen ? "#9f523a" : "#1a1a1a", lineHeight: 1.45, transition: "color 0.2s" }}>
                            {faq.question}
                          </span>
                        </div>
                        <span style={{
                          minWidth: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                          background: isOpen ? "#9f523a" : "#f0ede9",
                          transition: "all 0.25s",
                        }}>
                          <i className={`bi ${isOpen ? "bi-dash" : "bi-plus"}`} style={{ fontSize: "1rem", color: isOpen ? "#fff" : "#9f523a" }} />
                        </span>
                      </button>

                      {/* Answer panel */}
                      <div style={{
                        maxHeight: isOpen ? 400 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}>
                        <div style={{ padding: "0 22px 22px 64px" }}>
                          <div style={{ height: 1, background: "#f0ede9", marginBottom: 16 }} />
                          <p style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
                            {faq.answer}
                          </p>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && displayed.length === 0 && (
              <div style={{ textAlign: "center", padding: "72px 24px" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0ede9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <i className="bi bi-search" style={{ fontSize: "1.8rem", color: "#c87a5a" }} />
                </div>
                <h5 style={{ fontWeight: 700, color: "#333", marginBottom: 8 }}>No results found</h5>
                <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: 24 }}>
                  We couldn&apos;t find anything matching &ldquo;<strong>{search}</strong>&rdquo;. Try different keywords.
                </p>
                <button onClick={() => { setSearch(""); setActiveCategory("all"); }} style={{ padding: "10px 24px", borderRadius: 8, background: "#9f523a", color: "#fff", border: "none", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Contact CTA strip ── */}
        <div style={{ marginTop: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 8 }}>
              Still need help?
            </p>
            <h3 style={{ fontWeight: 800, color: "#111", letterSpacing: "-0.02em", fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", margin: 0 }}>
              Our support team is here for you
            </h3>
          </div>
          <div className="row g-4 justify-content-center">
            {/* Email */}
            <div className="col-sm-6 col-lg-4">
              <a href="mailto:support@saaviya.in" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1.5px solid #f0ede9", textAlign: "center", transition: "all 0.22s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(159,82,58,0.25)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "#f0ede9"; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #9f523a, #7a3f2c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <i className="bi bi-envelope-fill" style={{ fontSize: "1.4rem", color: "#fff" }} />
                  </div>
                  <h6 style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>Email Support</h6>
                  <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 14, lineHeight: 1.55 }}>
                    We typically respond within<br />4–8 business hours.
                  </p>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#9f523a" }}>
                    support@saaviya.in
                  </span>
                </div>
              </a>
            </div>
            {/* WhatsApp */}
            <div className="col-sm-6 col-lg-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1.5px solid #f0ede9", textAlign: "center", transition: "all 0.22s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(37,211,102,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "#f0ede9"; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #25d366, #128c7e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <i className="bi bi-whatsapp" style={{ fontSize: "1.4rem", color: "#fff" }} />
                  </div>
                  <h6 style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>WhatsApp Us</h6>
                  <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 14, lineHeight: 1.55 }}>
                    Chat with us directly.<br />Mon–Sat, 9 AM – 6 PM.
                  </p>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#128c7e" }}>
                    Start a conversation →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
