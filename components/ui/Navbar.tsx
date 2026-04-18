"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CartCount {
  count: number;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.data?.length || 0);
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, pathname]);

  useEffect(() => {
    if (user) fetchCartCount();
  }, [user, fetchCartCount, pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCartCount(0);
    router.push("/");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", borderBottom: "1px solid rgba(159, 82, 58, 0.1)", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", transition: "all 0.3s ease" }}>
      <style>{`
        .navbar-brand img {
          transition: all 0.3s ease;
        }
        .navbar-brand:hover img {
          transform: scale(1.05);
        }
        .nav-link {
          position: relative;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333 !important;
          padding: 0.5rem 1rem !important;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #9f523a, transparent);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        .nav-link:hover {
          color: #9f523a !important;
        }
        .nav-link:hover::after {
          width: 80%;
        }
        .search-box {
          border: 1px solid rgba(159, 82, 58, 0.2) !important;
          border-radius: 6px !important;
          transition: all 0.3s ease;
          background: #fff;
        }
        .search-box:focus {
          border-color: #9f523a !important;
          box-shadow: 0 0 0 3px rgba(159, 82, 58, 0.1) !important;
        }
        .search-btn {
          background: #9f523a !important;
          border-color: #9f523a !important;
          color: white !important;
          transition: all 0.3s ease;
        }
        .search-btn:hover {
          background: #7a3f2c !important;
          border-color: #7a3f2c !important;
          transform: scale(1.05);
        }
        .cart-link {
          position: relative;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        .cart-link:hover {
          color: #9f523a !important;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #9f523a;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 2px 4px rgba(159, 82, 58, 0.3);
        }
        .user-btn {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%) !important;
          border: none !important;
          color: white !important;
          font-weight: 600;
          padding: 0.5rem 1rem !important;
          border-radius: 6px !important;
          transition: all 0.3s ease !important;
        }
        .user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.3) !important;
        }
        .dropdown-menu {
          border: 1px solid rgba(159, 82, 58, 0.15) !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          padding: 8px 0 !important;
        }
        .dropdown-item {
          padding: 0.7rem 1rem !important;
          transition: all 0.2s ease;
          color: #333 !important;
          font-size: 0.9rem;
        }
        .dropdown-item:hover {
          background: rgba(159, 82, 58, 0.08) !important;
          color: #9f523a !important;
          padding-left: 1.2rem !important;
        }
        .dropdown-item.text-danger:hover {
          background: rgba(220, 53, 69, 0.1) !important;
          color: #dc3545 !important;
        }
        .navbar-toggler {
          border-color: rgba(159, 82, 58, 0.2) !important;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 3px rgba(159, 82, 58, 0.1) !important;
        }
      `}</style>
      
      <div className="container">
        <Link className="navbar-brand me-4" href="/">
          <Image
            src="/assets/saaviya_logo_2026.png"
            alt="Saaviya Logo"
            width={130}
            height={50}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* Search */}
          <form className="d-flex mx-auto my-2 my-lg-0 me-lg-3" style={{ maxWidth: 380, width: "100%" }} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className="form-control search-box"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "0.9rem", paddingRight: "0" }}
              />
              <button className="btn search-btn" type="submit" style={{ border: "none" }}>
                <i className="bi bi-search" style={{ fontSize: "1rem" }} />
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link" href="/products/all">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/stories">
                Stories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/testimonials">
                Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/faq">
                FAQ
              </Link>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link href="/cart" className="cart-link nav-link px-2">
                <i className="bi bi-bag" />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            {/* User menu */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn user-btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ fontSize: "0.9rem" }}
                >
                  <i className="bi bi-person-circle me-2" />
                  {user.name.split(" ")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/account/profile">
                      <i className="bi bi-person me-2" style={{ color: "#9f523a" }} />My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/orders">
                      <i className="bi bi-box me-2" style={{ color: "#9f523a" }} />My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/wishlist">
                      <i className="bi bi-heart me-2" style={{ color: "#9f523a" }} />Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/addresses">
                      <i className="bi bi-geo-alt me-2" style={{ color: "#9f523a" }} />Addresses
                    </Link>
                  </li>
                  {user.role === "ADMIN" && (
                    <>
                      <li><hr className="dropdown-divider" style={{ margin: "8px 0", borderColor: "rgba(159, 82, 58, 0.1)" }} /></li>
                      <li>
                        <Link className="dropdown-item" href="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2" style={{ color: "#9f523a" }} />Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" style={{ margin: "8px 0", borderColor: "rgba(159, 82, 58, 0.1)" }} /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout} style={{ width: "100%", textAlign: "left", border: "none", background: "none", padding: "0.7rem 1rem", transition: "all 0.2s ease" }}>
                      <i className="bi bi-box-arrow-right me-2" />Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link href="/login" className="btn user-btn px-4" style={{ fontSize: "0.9rem" }}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
