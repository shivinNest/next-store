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
    <div className="bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-5 fw-bold mb-3">Frequently Asked Questions</h1>
            <p className="lead text-muted">Everything you need to know about our products, orders, and services</p>
          </div>
        </div>

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
            <div className="card border-0 bg-primary text-white">
              <div className="card-body text-center p-5">
                <h4 className="card-title fw-bold mb-2">Still can't find the answer?</h4>
                <p className="card-text mb-4">Our support team is ready to help you</p>
                <a href="mailto:support@saaviya.in" className="btn btn-light">
                  <i className="bi bi-envelope me-2"></i>Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-primary {
          background-color: #9f523a;
          border-color: #9f523a;
        }
        .btn-primary:hover {
          background-color: #7a3f2c;
          border-color: #7a3f2c;
        }
        .btn-outline-primary {
          color: #9f523a;
          border-color: #9f523a;
        }
        .btn-outline-primary:hover {
          background-color: #9f523a;
          border-color: #9f523a;
          color: white;
        }
        .accordion-button:not(.collapsed) {
          background-color: #f8f9fa;
          color: #9f523a;
          box-shadow: none;
        }
        .accordion-button:focus {
          border-color: #9f523a;
          box-shadow: 0 0 0 0.25rem rgba(159, 82, 58, 0.25);
        }
        .bg-primary {
          background-color: #9f523a !important;
        }
      `}</style>
    </div>
  );
}
