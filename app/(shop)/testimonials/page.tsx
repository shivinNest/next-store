"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string | null;
  rating: number;
  review: string;
}

function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bi ${s <= rating ? "bi-star-fill" : "bi-star"}`}
          style={{ color: s <= rating ? "#f59e0b" : "#d1d5db", fontSize: size }}
        />
      ))}
    </div>
  );
}

function Avatar({ name, avatar, size = 48 }: { name: string; avatar?: string | null; size?: number }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #f0ece8" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800, fontSize: size * 0.38,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function TestimonialCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  return (
    <div
      className="t-card"
      style={{
        animationDelay: `${delay}s`,
        background: "#fff",
        borderRadius: 18,
        padding: "1.75rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: "1px solid #f0ece8",
        overflow: "hidden",
      }}
    >
      {/* watermark quote */}
      <span style={{
        position: "absolute", top: 8, right: 16,
        fontSize: "7rem", lineHeight: 1,
        color: "rgba(159,82,58,0.055)",
        fontFamily: "Georgia,serif", fontWeight: 900,
        userSelect: "none", pointerEvents: "none",
      }}>
        &ldquo;
      </span>

      <div style={{ marginBottom: "0.9rem" }}>
        <StarRating rating={t.rating} />
      </div>

      <p style={{
        flex: 1, color: "#4b5563", lineHeight: 1.78,
        fontSize: "0.925rem", margin: "0 0 1.4rem",
        fontStyle: "italic", position: "relative", zIndex: 1,
      }}>
        &ldquo;{t.review}&rdquo;
      </p>

      <div style={{ height: 1, background: "linear-gradient(90deg,#f0ece8,transparent)", marginBottom: "1.1rem" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={t.name} avatar={t.avatar} size={42} />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "#111", lineHeight: 1.3 }}>{t.name}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#9f523a", fontWeight: 500, display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
            <i className="bi bi-geo-alt-fill" style={{ fontSize: 10 }} />{t.location}
          </p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "1.75rem", border: "1px solid #f0ece8" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, i) => <div key={i} style={{ width: 15, height: 15, borderRadius: 3, background: "#f0ece8" }} />)}
      </div>
      {[100, 92, 78, 60].map((w, i) => (
        <div key={i} style={{ height: 12, borderRadius: 6, background: "#f0ece8", width: `${w}%`, marginBottom: 9 }} />
      ))}
      <div style={{ height: 1, background: "#f0ece8", margin: "1.1rem 0" }} />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0ece8", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, borderRadius: 6, background: "#f0ece8", width: "50%", marginBottom: 7 }} />
          <div style={{ height: 10, borderRadius: 6, background: "#f0ece8", width: "32%" }} />
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
      .then((d) => { if (d.success) setTestimonials(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const avg =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

  const [featured, ...rest] = testimonials;

  const stats = [
    { icon: "bi-people-fill",    value: "10,000+", label: "Happy Customers"   },
    { icon: "bi-star-fill",      value: avg,        label: "Average Rating"    },
    { icon: "bi-bag-check-fill", value: "50,000+", label: "Orders Delivered"  },
    { icon: "bi-heart-fill",     value: "98%",      label: "Satisfaction Rate" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity:1; }
          50%      { transform: scale(0.6); opacity:0.4; }
        }
        @keyframes shimmer {
          0%,100% { opacity:1; }
          50%      { opacity:0.45; }
        }
        .t-card {
          animation: fadeUp 0.5s ease-out both;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .t-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(159,82,58,0.13), 0 2px 8px rgba(0,0,0,0.05);
        }
        .skeleton-pulse > div { animation: shimmer 1.5s ease-in-out infinite; }
        @media(max-width:575px) {
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div style={{ background: "#faf8f6" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{
          background: "#fff",
          borderBottom: "1px solid #f0ece8",
          padding: "5.5rem 0 4.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* dot-grid decoration */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "radial-gradient(circle, rgba(159,82,58,0.13) 1.2px, transparent 1.2px)",
            backgroundSize: "26px 26px", opacity: 0.5,
          }} />
          {/* warm blob */}
          <div style={{
            position: "absolute", top: -120, right: -100, width: 480, height: 480,
            borderRadius: "50%", background: "rgba(159,82,58,0.05)",
            filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
          }} />

          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            {/* overline badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(159,82,58,0.08)", color: "#9f523a",
              fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1.5px",
              textTransform: "uppercase", padding: "5px 15px", borderRadius: 100,
              marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9f523a", animation: "pulse-dot 1.8s infinite" }} />
              Verified Customer Reviews
            </div>

            <h1 style={{
              fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 800, color: "#111",
              letterSpacing: "-0.6px", lineHeight: 1.15, marginBottom: "1rem",
            }}>
              What Our Customers<br />
              <span style={{ color: "#9f523a" }}>Say About Us</span>
            </h1>

            <p style={{
              color: "#6b7280", fontSize: "1.05rem", lineHeight: 1.75,
              maxWidth: 500, margin: "0 auto 2.5rem",
            }}>
              Real experiences from real people across India — unfiltered, honest, and straight from the heart.
            </p>

            {/* star pill */}
            {!loading && testimonials.length > 0 && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                background: "#fff", border: "1px solid #f0ece8",
                borderRadius: 100, padding: "10px 22px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>
                {[1,2,3,4,5].map(s => (
                  <i key={s} className="bi bi-star-fill" style={{ color: "#f59e0b", fontSize: 15 }} />
                ))}
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#111" }}>{avg} / 5</span>
                <span style={{ color: "#aaa", fontSize: "0.82rem" }}>· {testimonials.length} reviews</span>
              </div>
            )}
          </div>
        </section>

        {/* ─── STATS STRIP ──────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)" }}>
          <div className="container">
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{
                  textAlign: "center", padding: "1.8rem 1rem",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none",
                }}>
                  <i className={`bi ${s.icon}`} style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.25rem", display: "block", marginBottom: 6 }} />
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1.55rem", color: "#fff", lineHeight: 1.1 }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: "rgba(255,255,255,0.65)", fontWeight: 500, marginTop: 5, letterSpacing: "0.3px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─────────────────────────────────── */}
        <section style={{ padding: "5rem 0 5.5rem" }}>
          <div className="container">

            {loading ? (
              <div className="skeleton-pulse">
                {/* featured skeleton */}
                <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", marginBottom: "2.5rem", border: "1px solid #f0ece8", display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0ece8", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: "#f0ece8", borderRadius: 6, width: "30%", marginBottom: 12 }} />
                    {[100, 90, 70].map((w, i) => (
                      <div key={i} style={{ height: 12, background: "#f0ece8", borderRadius: 6, width: `${w}%`, marginBottom: 8 }} />
                    ))}
                  </div>
                </div>
                <div className="row g-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="col-md-6 col-lg-4"><SkeletonCard /></div>
                  ))}
                </div>
              </div>
            ) : testimonials.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(159,82,58,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}>
                  <i className="bi bi-chat-square-heart" style={{ fontSize: "2rem", color: "#9f523a" }} />
                </div>
                <p style={{ color: "#aaa", fontSize: "1rem" }}>No testimonials yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <>
                {/* ── FEATURED ── */}
                {featured && (
                  <div style={{ marginBottom: "3rem" }}>
                    <div style={{
                      background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
                      borderRadius: 22, padding: "3rem 3.5rem",
                      position: "relative", overflow: "hidden",
                      display: "flex", gap: "3rem", alignItems: "flex-start",
                      boxShadow: "0 16px 48px rgba(159,82,58,0.25)",
                    }}>
                      {/* giant quote */}
                      <span style={{
                        position: "absolute", bottom: -30, right: 30,
                        fontSize: "16rem", lineHeight: 1,
                        color: "rgba(255,255,255,0.06)",
                        fontFamily: "Georgia,serif", fontWeight: 900,
                        userSelect: "none", pointerEvents: "none",
                      }}>&ldquo;</span>

                      {/* avatar col */}
                      <div style={{ flexShrink: 0, textAlign: "center", minWidth: 80 }}>
                        <Avatar name={featured.name} avatar={featured.avatar} size={76} />
                        <div style={{ marginTop: 10 }}>
                          <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{featured.name}</p>
                          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 3 }}>
                            <i className="bi bi-geo-alt-fill" style={{ fontSize: 10 }} />{featured.location}
                          </p>
                        </div>
                      </div>

                      {/* review col */}
                      <div style={{ flex: 1, zIndex: 1 }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <StarRating rating={featured.rating} size={17} />
                        </div>
                        <p style={{
                          color: "#fff", fontSize: "1.2rem", lineHeight: 1.8,
                          fontStyle: "italic", margin: 0, opacity: 0.95,
                          fontWeight: 300,
                        }}>
                          &ldquo;{featured.review}&rdquo;
                        </p>
                        <div style={{
                          marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: 6,
                          background: "rgba(255,255,255,0.12)", borderRadius: 100,
                          padding: "4px 14px", fontSize: "0.74rem", color: "rgba(255,255,255,0.8)",
                          fontWeight: 600, letterSpacing: "0.5px",
                        }}>
                          <i className="bi bi-patch-check-fill" style={{ color: "#fcd34d" }} />
                          Featured Review
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── GRID ── */}
                {rest.length > 0 && (
                  <>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 14,
                      marginBottom: "2rem",
                    }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "#111" }}>
                        All Reviews
                        <span style={{ fontWeight: 400, color: "#aaa", fontSize: "0.9rem", marginLeft: 8 }}>({rest.length})</span>
                      </p>
                      <div style={{ flex: 1, height: 1, background: "#f0ece8" }} />
                    </div>

                    <div className="row g-4">
                      {rest.map((t, i) => (
                        <div key={t.id} className="col-md-6 col-lg-4">
                          <TestimonialCard t={t} delay={i * 0.055} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────── */}
        <section style={{
          background: "#fff",
          borderTop: "1px solid #f0ece8",
          padding: "5.5rem 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, rgba(159,82,58,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px", opacity: 0.5,
          }} />
          <div className="container" style={{ maxWidth: 560, position: "relative", zIndex: 1 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(159,82,58,0.12), rgba(159,82,58,0.06))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 0 0 8px rgba(159,82,58,0.05)",
            }}>
              <i className="bi bi-bag-heart-fill" style={{ color: "#9f523a", fontSize: "1.5rem" }} />
            </div>

            <h2 style={{ fontWeight: 800, fontSize: "1.9rem", color: "#111", marginBottom: "0.75rem", letterSpacing: "-0.3px" }}>
              Ready to Join Them?
            </h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              Thousands of happy customers across India choose Saaviya for quality, care, and a seamless shopping experience.
            </p>

            <Link
              href="/products/all"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                color: "#fff", padding: "14px 34px", borderRadius: 12,
                fontWeight: 700, fontSize: "0.95rem",
                textDecoration: "none", letterSpacing: "0.2px",
                boxShadow: "0 6px 20px rgba(159,82,58,0.32)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <i className="bi bi-bag" />
              Explore Collection
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
