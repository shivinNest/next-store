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
            <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#fff", letterSpacing: "0.04em", marginBottom: "16px" }}>
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
                ["Kurtas", "/products/kurtas"],
                ["Dresses", "/products/dresses"],
                ["Tops", "/products/tops"],
                ["Lehengas", "/products/lehengas"],
                ["Sarees", "/products/sarees"],
                ["Ethnic Sets", "/products/ethnic-sets"],
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
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ gap: "10px" }}>
          <p style={{ fontSize: "0.78rem", color: "#444", margin: 0 }}>
            &copy; {year} Saaviya. All rights reserved.
          </p>
          <p style={{ fontSize: "0.78rem", color: "#444", margin: 0 }}>
            Crafted in India &hearts;
          </p>
        </div>
      </div>
    </footer>
  );
}
