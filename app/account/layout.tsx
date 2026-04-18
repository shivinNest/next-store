"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const links = [
  { href: "/account/profile", icon: "bi-person", label: "Profile" },
  { href: "/account/orders", icon: "bi-box", label: "My Orders" },
  { href: "/account/wishlist", icon: "bi-heart", label: "Wishlist" },
  { href: "/account/addresses", icon: "bi-geo-alt", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <div className="container py-4 py-md-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="p-3 border-bottom">
                  <h6 className="fw-bold mb-0">My Account</h6>
                </div>
                <nav className="p-2">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none mb-1 ${
                        pathname === l.href
                          ? "bg-primary text-white"
                          : "text-dark"
                      }`}
                    >
                      <i className={`bi ${l.icon}`} />
                      {l.label}
                    </Link>
                  ))}
                  <button
                    className="d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none w-100 border-0 bg-transparent text-danger mt-1"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/";
                    }}
                  >
                    <i className="bi bi-box-arrow-right" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-md-9">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
