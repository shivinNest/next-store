"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const links = [
  { href: "/account/profile", icon: "bi-person", label: "My Profile" },
  { href: "/account/orders", icon: "bi-box", label: "My Orders" },
  { href: "/account/wishlist", icon: "bi-heart", label: "Wishlist" },
  { href: "/account/addresses", icon: "bi-geo-alt", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: "40px", paddingBottom: "60px" }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ color: "#9f523a", fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px" }}>My Account</h1>
            <p style={{ color: "#999", fontSize: "1rem", marginBottom: "0" }}>Manage your profile and preferences</p>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(159, 82, 58, 0.1)",
                position: "sticky",
                top: "80px"
              }}>
                <div style={{ background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)", padding: "25px", color: "white" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "5px" }}>My Account</h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "0" }}>Manage everything</p>
                </div>
                <nav style={{ padding: "0" }}>
                  {links.map((l) => {
                    const isActive = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "15px 20px",
                          textDecoration: "none",
                          color: isActive ? "white" : "#333",
                          background: isActive ? "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)" : "transparent",
                          borderLeft: isActive ? "4px solid #20c997" : "4px solid transparent",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          fontWeight: isActive ? "600" : "500"
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(159, 82, 58, 0.05)";
                            (e.currentTarget as HTMLElement).style.color = "#9f523a";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "#333";
                          }
                        }}
                      >
                        <i className={`bi ${l.icon}`} style={{ fontSize: "1.1rem" }} />
                        {l.label}
                      </Link>
                    );
                  })}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "15px 20px",
                      textDecoration: "none",
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      color: "#dc3545",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      borderLeft: "4px solid transparent",
                      transition: "all 0.3s ease",
                      marginTop: "10px",
                      borderTop: "1px solid #f0f0f0"
                    }}
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/";
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(220, 53, 69, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <i className="bi bi-box-arrow-right" style={{ fontSize: "1.1rem" }} />
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
