"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import styles from "./account.module.css";

const links = [
  { href: "/account/profile",   label: "Profile" },
  { href: "/account/orders",    label: "My Orders" },
  { href: "/account/wishlist",  label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => d.success && setUser({ name: d.data.name, email: d.data.email }));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ background: "#faf9f7", minHeight: "calc(100vh - 60px)", padding: "48px 0 80px" }}>
        <div className="container">
          <div className="row g-4 g-lg-5">
            {/* Sidebar */}
            <div className="col-md-3">
              <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: "#9f523a", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "1rem", flexShrink: 0,
                    }}>
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user?.name ?? "My Account"}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#999", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
                <nav style={{ padding: "10px 0 4px" }}>
                  {links.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`${styles.navItem}${pathname === l.href ? " " + styles.navItemActive : ""}`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <button
                    className={styles.logoutBtn}
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/";
                    }}
                  >
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="col-md-9">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
