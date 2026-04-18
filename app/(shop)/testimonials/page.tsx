"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string | null;
  rating: number;
  review: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="d-flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bi ${s <= rating ? "bi-star-fill" : "bi-star"}`}
          style={{ color: "#9f523a", fontSize: 16 }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="col-md-6 col-lg-4">
      <style>{`
        .testimonial-card-item {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .testimonial-card-item:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.15) !important;
          border-color: rgba(159, 82, 58, 0.2) !important;
          transform: translateY(-4px);
        }
        .testimonial-review {
          color: #555;
          line-height: 1.8;
          font-size: 0.95rem;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }
        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2px solid #9f523a;
        }
        .testimonial-avatar-initial {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          font-size: 18px;
          flex-shrink: 0;
          border: 2px solid rgba(159, 82, 58, 0.3);
        }
        .testimonial-name {
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 2px;
        }
        .testimonial-location {
          color: #9f523a;
          font-size: 0.85rem;
          font-weight: 500;
        }
      `}</style>
      <div className="testimonial-card-item">
        <StarRating rating={t.rating} />
        <p className="testimonial-review">
          &ldquo;{t.review}&rdquo;
        </p>
        <div className="testimonial-author">
          {t.avatar ? (
            <Image
              src={t.avatar}
              alt={t.name}
              width={50}
              height={50}
              className="testimonial-avatar object-fit-cover"
            />
          ) : (
            <div className="testimonial-avatar-initial">
              {t.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="testimonial-name mb-0">{t.name}</p>
            <p className="testimonial-location mb-0">
              <i className="bi bi-geo-alt-fill me-1" />
              {t.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTestimonials(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const avg =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

  return (
    <>
      <style>{`
        .hero-testimonials {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-testimonials::before {
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
        .hero-content {
          position: relative;
          z-index: 1;
        }
        .stats-bar {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-top: 1px solid rgba(159, 82, 58, 0.1);
          border-bottom: 1px solid rgba(159, 82, 58, 0.1);
        }
        .stat-item {
          text-align: center;
          padding: 1.5rem 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-item:hover {
          transform: translateY(-4px);
        }
        .stat-icon {
          color: #9f523a;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          transition: transform 0.3s;
        }
        .stat-item:hover .stat-icon {
          transform: scale(1.1);
        }
        .stat-value {
          font-weight: 800;
          font-size: 1.5rem;
          color: #9f523a;
          margin-bottom: 0.25rem;
        }
        .stat-label {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .testimonials-section {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          padding: 5rem 0;
        }
        .cta-section {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .cta-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
        }
        .cta-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }
        .cta-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .btn-cta {
          background: white;
          color: #9f523a;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .rating-badge {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 8px 16px;
          backdrop-filter: blur(10px);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.6s ease-out 0.3s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Hero */}
      <div className="hero-testimonials py-5 text-white">
        <div className="container hero-content">
          <div className="text-center">
            <i className="bi bi-chat-quote-fill" style={{ fontSize: "3.5rem", opacity: 0.9, marginBottom: "1rem", display: "block" }} />
            <h1 className="fw-bold" style={{ fontSize: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.5px" }}>
              Customer Testimonials
            </h1>
            <p className="lead" style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
              Real stories from our happy customers across India
            </p>
            {testimonials.length > 0 && (
              <div className="rating-badge">
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i key={s} className="bi bi-star-fill" style={{ color: "#fcd34d", fontSize: 16 }} />
                  ))}
                </div>
                <span className="fw-bold">{avg}</span>
                <span style={{ opacity: 0.8 }}>from {testimonials.length} reviews</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar py-4">
        <div className="container">
          <div className="row g-0">
            {[
              { icon: "bi-people-fill", value: "10,000+", label: "Happy Customers" },
              { icon: "bi-star-fill", value: avg, label: "Average Rating" },
              { icon: "bi-bag-check-fill", value: "50,000+", label: "Orders Delivered" },
              { icon: "bi-heart-fill", value: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="stat-item">
                  <i className={`bi ${s.icon} stat-icon d-block`} />
                  <p className="stat-value mb-0">{s.value}</p>
                  <p className="stat-label mb-0">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials grid */}
      <section className="testimonials-section">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm p-4" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", borderRadius: "12px" }}>
                    <div className="skeleton mb-3" style={{ height: 16, width: "40%" }} />
                    <div className="skeleton mb-2" style={{ height: 14 }} />
                    <div className="skeleton mb-2" style={{ height: 14 }} />
                    <div className="skeleton mb-4" style={{ height: 14, width: "70%" }} />
                    <div className="d-flex gap-3 align-items-center">
                      <div className="skeleton rounded-circle" style={{ width: 50, height: 50 }} />
                      <div className="flex-grow-1">
                        <div className="skeleton mb-1" style={{ height: 14, width: "60%" }} />
                        <div className="skeleton" style={{ height: 12, width: "40%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text fs-1 text-muted d-block mb-3" />
              <p className="text-muted">No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="row g-4">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section py-5">
        <div className="container cta-content">
          <h3 className="cta-title">Shop Now &amp; Experience the Difference</h3>
          <p className="cta-subtitle">Join thousands of happy customers across India</p>
          <a href="/products/all" className="btn btn-cta">
            <i className="bi bi-bag me-2" />Explore Collection
          </a>
        </div>
      </div>
    </>
  );
}
