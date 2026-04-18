"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-5" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)", borderTop: "1px solid rgba(159, 82, 58, 0.3)" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .footer-section { animation: fadeInUp 0.6s ease-out forwards; }
        .footer-link-item { position: relative; padding-left: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .footer-link-item::before { content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 2px; background: linear-gradient(90deg, #9f523a 0%, transparent 100%); transition: width 0.3s ease; }
        .footer-link-item:hover::before { width: 100%; }
        .footer-link-item:hover { color: #9f523a !important; opacity: 1 !important; transform: translateX(6px); }
        .social-icon { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid rgba(159, 82, 58, 0.4); }
        .social-icon:hover { background: #9f523a !important; border-color: #9f523a !important; transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 16px rgba(159, 82, 58, 0.25); }
        .section-title { position: relative; padding-bottom: 12px; margin-bottom: 20px; font-size: 0.95rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #9f523a; }
        .section-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 35px; height: 3px; background: linear-gradient(90deg, #9f523a, transparent); border-radius: 2px; }
      `}</style>

      <div className="container">
        <div className="row g-5 mb-5">

          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 footer-section" style={{ animationDelay: "0.1s" }}>
            <div className="mb-4">
              <h5 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "12px", color: "#ffffff", letterSpacing: "0.5px" }}>
                Saaviya
              </h5>
              <div style={{ width: "45px", height: "3px", background: "linear-gradient(90deg, #9f523a, #c9704a)", borderRadius: "3px", marginBottom: "16px" }} />
            </div>
            
            <p className="text-light opacity-75" style={{ fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "24px", fontWeight: "400" }}>
              Your premier destination for women's fashion. Discover curated collections of ethnic wear, contemporary designs, and timeless pieces crafted for the modern woman.
            </p>

            <div>
              <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "#9f523a", fontWeight: "700", marginBottom: "12px" }}>Follow Our Journey</p>
              <div className="d-flex gap-3">
                {[
                  { icon: "bi-instagram", label: "Instagram" },
                  { icon: "bi-facebook", label: "Facebook" },
                  { icon: "bi-twitter-x", label: "Twitter" },
                  { icon: "bi-youtube", label: "YouTube" },
                  { icon: "bi-pinterest", label: "Pinterest" },
                ].map((s) => (
                  <a key={s.label} href="#" className="text-light text-decoration-none social-icon d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 42, height: 42 }} aria-label={s.label} title={s.label}>
                    <i className={`bi ${s.icon}`} style={{ fontSize: "0.95rem" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Sections */}
          <div className="col-lg-2 col-md-6 footer-section" style={{ animationDelay: "0.2s" }}>
            <h6 className="section-title">Categories</h6>
            <ul className="list-unstyled">
              {[
                { label: "Kurtas", href: "/products/kurtas" },
                { label: "Dresses", href: "/products/dresses" },
                { label: "Tops", href: "/products/tops" },
                { label: "Lehengas", href: "/products/lehengas" },
                { label: "Sarees", href: "/products/sarees" },
                { label: "Ethnic Sets", href: "/products/ethnic-sets" },
              ].map((l) => (
                <li key={l.label} className="mb-2">
                  <Link href={l.href} className="text-light opacity-75 footer-link-item small text-decoration-none" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 footer-section" style={{ animationDelay: "0.3s" }}>
            <h6 className="section-title">Shop</h6>
            <ul className="list-unstyled">
              {[
                { label: "New Arrivals", href: "/products/all?sort=newest" },
                { label: "Trending", href: "/products/all?trending=true" },
                { label: "On Sale", href: "/products/all?offer=true" },
                { label: "All Products", href: "/products/all" },
                { label: "Stories", href: "/stories" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <li key={l.label} className="mb-2">
                  <Link href={l.href} className="text-light opacity-75 footer-link-item small text-decoration-none" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 footer-section" style={{ animationDelay: "0.4s" }}>
            <h6 className="section-title">Account</h6>
            <ul className="list-unstyled">
              {[
                { label: "Login / Register", href: "/login" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Wishlist", href: "/account/wishlist" },
                { label: "Addresses", href: "/account/addresses" },
                { label: "Profile", href: "/account/profile" },
              ].map((l) => (
                <li key={l.label} className="mb-2">
                  <Link href={l.href} className="text-light opacity-75 footer-link-item small text-decoration-none" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-lg-2 col-md-6 footer-section" style={{ animationDelay: "0.5s" }}>
            <h6 className="section-title">Contact</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.9rem" }}>
              <li className="mb-3 d-flex gap-3">
                <i className="bi bi-geo-alt-fill flex-shrink-0" style={{ color: "#9f523a", fontSize: "1rem", marginTop: "2px" }} />
                <span className="opacity-75" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>12, Fashion Street, Lajpat Nagar, New Delhi - 110024</span>
              </li>
              <li className="mb-3 d-flex gap-3">
                <i className="bi bi-envelope-fill flex-shrink-0" style={{ color: "#9f523a", fontSize: "1rem", marginTop: "2px" }} />
                <a href="mailto:support@saaviya.in" className="text-light opacity-75 text-decoration-none footer-link-item" style={{ fontSize: "0.85rem" }}>
                  support@saaviya.in
                </a>
              </li>
              <li className="mb-3 d-flex gap-3">
                <i className="bi bi-telephone-fill flex-shrink-0" style={{ color: "#9f523a", fontSize: "1rem", marginTop: "2px" }} />
                <a href="tel:+919876543210" className="text-light opacity-75 text-decoration-none footer-link-item" style={{ fontSize: "0.85rem" }}>
                  +91 98765 43210
                </a>
              </li>
              <li className="d-flex gap-3">
                <i className="bi bi-clock-fill flex-shrink-0" style={{ color: "#9f523a", fontSize: "1rem" }} />
                <span className="opacity-75" style={{ fontSize: "0.85rem" }}>Mon-Sat: 9AM-6PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ borderColor: "rgba(159, 82, 58, 0.2)", margin: "40px 0" }} />

        {/* Bottom Section */}
        <div className="row align-items-center g-3" style={{ marginBottom: "30px" }}>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-3" style={{ fontSize: "0.85rem" }}>
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Shipping Policy", href: "/shipping-policy" },
              ].map((l, idx) => (
                <span key={l.label}>
                  <Link href={l.href} className="text-light opacity-75 text-decoration-none footer-link-item" style={{ transition: "all 0.3s ease" }}>
                    {l.label}
                  </Link>
                  {idx < 3 && <span className="opacity-25 mx-2">•</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex flex-wrap gap-3 justify-content-md-end" style={{ fontSize: "0.85rem" }}>
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="text-light opacity-75 text-decoration-none footer-link-item">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-top" style={{ borderTopColor: "rgba(159, 82, 58, 0.2)", paddingTop: "24px" }}>
          <p className="text-light opacity-75 mb-0" style={{ fontSize: "0.85rem", fontWeight: "500", letterSpacing: "0.3px" }}>
            &copy; {year} <span style={{ color: "#9f523a", fontWeight: "700" }}>Saaviya</span>. All rights reserved. 
            <br className="d-md-none" />
            {" "}Made with <i className="bi bi-heart-fill text-danger" style={{ fontSize: "0.75rem", animation: "pulse 1.5s infinite", display: "inline-block" }} /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
