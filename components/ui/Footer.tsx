"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid #1e1e1e", color: "#999", fontFamily: "inherit" }}>
      <div className="container" style={{ padding: "64px 16px 0" }}>
        <div className="row g-5 mb-5">

          {/* Brand */}
          <div className="col-lg-4 col-md-12">
            <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#777", letterSpacing: "0.04em", marginBottom: "16px" }}>
              Saaviya
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.75", color: "#777", maxWidth: "320px", marginBottom: "28px" }}>
              A curated destination for women&apos;s fashion — ethnic wear, contemporary silhouettes, and timeless pieces crafted for the modern woman.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "#555" }}>
              <span>support@saaviya.in</span>
              <span>+91 94001 46232</span>
              <span>Mon – Sat &nbsp;·&nbsp; 9 AM – 6 PM IST</span>
            </div>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-6">
            <p style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f523a", marginBottom: "20px" }}>
              Categories
            </p>
            <ul className="list-unstyled" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Kurtas", "/products/categories/kurtas"],
                ["Dresses", "/products/categories/dresses"],
                ["Tops", "/products/categories/tops"],
                ["Lehengas", "/products/categories/lehengas"],
                ["Sarees", "/products/categories/sarees"],
                ["Ethnic Sets", "/products/categories/ethnic-sets"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} style={{ fontSize: "0.875rem", color: "#777", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div className="col-lg-2 col-6">
            <p style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f523a", marginBottom: "20px" }}>
              Shop
            </p>
            <ul className="list-unstyled" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["New Arrivals", "/products?sort=newest"],
                ["Trending", "/products?trending=true"],
                ["On Sale", "/products?offer=true"],
                ["All Products", "/products"],
                ["Stories", "/stories"],
                ["FAQ", "/faq"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} style={{ fontSize: "0.875rem", color: "#777", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-2 col-6">
            <p style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f523a", marginBottom: "20px" }}>
              Account
            </p>
            <ul className="list-unstyled" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Login / Register", "/login"],
                ["My Orders", "/account/orders"],
                ["Wishlist", "/account/wishlist"],
                ["Addresses", "/account/addresses"],
                ["Profile", "/account/profile"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} style={{ fontSize: "0.875rem", color: "#777", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="col-lg-2 col-6">
            <p style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f523a", marginBottom: "20px" }}>
              Help
            </p>
            <ul className="list-unstyled" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Contact Us", "/contact"],
                ["Shipping Policy", "/shipping-policy"],
                ["Refund Policy", "/refund-policy"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Service", "/terms-of-service"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href!} style={{ fontSize: "0.875rem", color: "#777", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #1a1a1a", padding: "20px 0", marginTop: "32px" }}>
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ gap: "12px" }}>
          <p style={{ fontSize: "0.88rem", color: "#444", margin: 0 }}>
            &copy; {year} Saaviya. All rights reserved. Crafted with care in India.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.55rem", color: "#3a3a3a", textTransform: "uppercase", letterSpacing: "0.12em", marginRight: "2px" }}>We accept</span>

            {/* Visa */}
            <span title="Visa" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "4px", padding: "2px 6px", height: "20px" }}>
              <svg viewBox="0 0 50 16" width="28" height="9">
                <text x="0" y="13" fill="#888" fontSize="14" fontWeight="800" fontStyle="italic" fontFamily="serif">VISA</text>
              </svg>
            </span>

            {/* Mastercard */}
            <span title="Mastercard" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "4px", padding: "2px 6px", height: "20px" }}>
              <svg viewBox="0 0 34 22" width="24" height="16">
                <circle cx="13" cy="11" r="9" fill="#555" />
                <circle cx="21" cy="11" r="9" fill="#777" />
                <path d="M17 4.5a9 9 0 0 1 0 13A9 9 0 0 1 17 4.5z" fill="#666" />
              </svg>
            </span>

            {/* UPI */}
            <span title="UPI" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "4px", padding: "2px 6px", height: "20px" }}>
              <svg viewBox="0 0 36 14" width="28" height="10">
                <text x="18" y="11.5" textAnchor="middle" fill="#888" fontSize="10.5" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="0.5">UPI</text>
              </svg>
            </span>

            {/* RuPay */}
            <span title="RuPay" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "4px", padding: "2px 6px", height: "20px" }}>
              <svg viewBox="0 0 42 14" width="32" height="10">
                <text x="21" y="11.5" textAnchor="middle" fill="#888" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.3">RuPay</text>
              </svg>
            </span>

            {/* Net Banking */}
            <span title="Net Banking" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "3px", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: "4px", padding: "2px 6px", height: "20px" }}>
              <i className="bi bi-bank" style={{ fontSize: "9px", color: "#888" }} />
              <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#888", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>Net Banking</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
