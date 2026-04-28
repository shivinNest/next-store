"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf9f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background watermark */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}>
        <span style={{
          fontSize: "clamp(160px, 30vw, 320px)",
          fontWeight: 900,
          color: "rgba(159,82,58,0.04)",
          letterSpacing: "-12px",
          lineHeight: 1,
        }}>404</span>
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 520 }}>
        {/* Icon */}
        <div style={{
          width: 88, height: 88, borderRadius: 24,
          background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          boxShadow: "0 12px 36px rgba(159,82,58,0.3)",
          fontSize: "2.2rem",
          color: "#fff",
        }}>
          <i className="bi bi-search" />
        </div>

        {/* Badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(159,82,58,0.08)",
          border: "1px solid rgba(159,82,58,0.15)",
          borderRadius: 100, padding: "5px 16px",
          fontSize: "0.72rem", fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#9f523a", marginBottom: 20,
        }}>
          Page Not Found
        </span>

        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 3rem)",
          fontWeight: 900,
          color: "#1a1a1a",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: 16,
        }}>
          Oops! This page
          <span style={{ color: "#9f523a", display: "block" }}>doesn&apos;t exist.</span>
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "#777",
          lineHeight: 1.75,
          marginBottom: 40,
        }}>
          The page you&apos;re looking for may have been moved, renamed, or is temporarily unavailable.
          Let&apos;s get you back to something beautiful.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
            color: "#fff",
            padding: "13px 32px", borderRadius: 10,
            fontWeight: 700, fontSize: "0.9rem",
            textDecoration: "none", letterSpacing: "0.04em",
            boxShadow: "0 4px 16px rgba(159,82,58,0.3)",
          }}>
            <i className="bi bi-house" />
            Back to Home
          </Link>
          <Link href="/products" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff",
            color: "#9f523a",
            padding: "13px 32px", borderRadius: 10,
            fontWeight: 700, fontSize: "0.9rem",
            textDecoration: "none", letterSpacing: "0.04em",
            border: "1.5px solid rgba(159,82,58,0.25)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <i className="bi bi-bag" />
            Shop Collection
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(159,82,58,0.1)" }}>
          <p style={{ fontSize: "0.78rem", color: "#aaa", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            Quick Links
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "New Arrivals", href: "/products?sort=newest" },
              { label: "About Us",    href: "/about" },
              { label: "Contact",     href: "/contact" },
              { label: "FAQs",        href: "/faq" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontSize: "0.875rem",
                color: "#9f523a",
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1.5px solid transparent",
                paddingBottom: 2,
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "#9f523a")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "transparent")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
