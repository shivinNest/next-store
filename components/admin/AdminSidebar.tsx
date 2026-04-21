"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/admin/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { href: "/admin/products", icon: "bi-bag", label: "Products" },
  { href: "/admin/categories", icon: "bi-tag", label: "Categories" },
  { href: "/admin/hero-slides", icon: "bi-play-circle", label: "Hero Slides" },
  { href: "/admin/banners", icon: "bi-image", label: "Banners" },
  { href: "/admin/testimonials", icon: "bi-chat-quote", label: "Testimonials" },
  { href: "/admin/orders", icon: "bi-clipboard-check", label: "Orders" },
  { href: "/admin/users", icon: "bi-people", label: "Users" },
  { href: "/admin/blogs", icon: "bi-journal-text", label: "Stories" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="admin-sidebar d-flex flex-column" style={{ minWidth: 240 }}>
      {/* Brand */}
      <div className="px-4 py-4 border-bottom border-secondary">
        <h5 className="fw-bold text-white mb-0">Saaviya</h5>
        <p className="text-secondary small mb-0">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 py-3">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link d-flex align-items-center gap-3 ${
              pathname.startsWith(l.href) ? "active" : ""
            }`}
          >
            <i className={`bi ${l.icon}`} />
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-top border-secondary">
        <Link
          href="/"
          className="nav-link d-flex align-items-center gap-3 mb-2"
          target="_blank"
        >
          <i className="bi bi-box-arrow-up-right" />
          View Store
        </Link>
        <button
          className="nav-link d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right" style={{ color: "#9f523a" }} />
          <span style={{ color: "#9f523a" }}>Logout</span>
        </button>
      </div>
    </div>
  );
}
