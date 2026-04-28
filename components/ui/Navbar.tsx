"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface CartCount {
  count: number;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const RECENT_SEARCHES_KEY = "saaviya_recent_searches";
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
    const stored = localStorage.getItem("saaviya_recent_searches");
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const saveSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      saveSearch(query);
      setShowRecent(false);
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
    saveSearch(term);
    setShowRecent(false);
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          color: #333;
          transition: color 0.2s, background 0.2s;
          text-decoration: none;
        }
        .cart-link:hover {
          color: #9f523a;
          background: rgba(159, 82, 58, 0.07);
        }
        .cart-link .cart-icon {
          font-size: 1.2rem;
          line-height: 1;
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #e53935;
          color: #fff;
          border-radius: 50%;
          min-width: 16px;
          height: 16px;
          padding: 0 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1;
          box-shadow: 0 1px 4px rgba(229,57,53,0.5);
          border: 1.5px solid #fff;
          pointer-events: none;
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
          border: 1px solid rgba(159, 82, 58, 0.12) !important;
          border-radius: 10px !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.10) !important;
          padding: 6px !important;
          min-width: 200px !important;
        }
        .dropdown-item {
          padding: 0.6rem 0.9rem !important;
          border-radius: 6px !important;
          transition: background 0.15s ease;
          color: #333 !important;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background: rgba(159, 82, 58, 0.07) !important;
          color: #9f523a !important;
          padding-left: 0.9rem !important;
        }
        .dropdown-item.text-danger:hover {
          background: rgba(220, 53, 69, 0.07) !important;
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
          <div ref={searchWrapperRef} className="mx-auto my-2 my-lg-0 me-lg-3" style={{ maxWidth: 380, width: "100%", position: "relative" }}>
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control search-box"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
                  style={{ fontSize: "0.9rem", paddingRight: "0" }}
                  autoComplete="off"
                />
                <button className="btn search-btn" type="submit" style={{ border: "none" }}>
                  <i className="bi bi-search" style={{ fontSize: "1rem" }} />
                </button>
              </div>
            </form>
            {showRecent && recentSearches.length > 0 && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid rgba(159, 82, 58, 0.15)",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                zIndex: 9999,
                overflow: "hidden",
              }}>
                <div style={{ padding: "8px 12px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9f523a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recent Searches</span>
                  <button
                    type="button"
                    onClick={() => { setRecentSearches([]); localStorage.removeItem(RECENT_SEARCHES_KEY); setShowRecent(false); }}
                    style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#999", cursor: "pointer", padding: 0 }}
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#333",
                      transition: "background 0.15s",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(159,82,58,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                      <i className="bi bi-clock-history" style={{ color: "#bbb", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{term}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(e, term)}
                      style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0 }}
                    >
                      <i className="bi bi-x" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link" href="/products">
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
              <Link href="/cart" className="cart-link">
                <i className="bi bi-bag cart-icon" />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                )}
              </Link>
            </li>

            {/* User menu */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn user-btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8, padding: "4px 12px 4px 4px" }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.4)" }} />
                  ) : (
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.78rem", fontWeight: 800, flexShrink: 0,
                    }}>
                      {user.name[0].toUpperCase()}
                    </span>
                  )}
                  {user.name.split(" ")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li style={{ padding: "10px 12px 12px", borderBottom: "1px solid rgba(159,82,58,0.08)", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(159,82,58,0.15)" }} />
                    ) : (
                      <span style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                      }}>
                        {user.name[0].toUpperCase()}
                      </span>
                    )}
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#111", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 148 }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 148 }}>{user.email}</p>
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/orders">My Orders</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/wishlist">Wishlist</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/account/addresses">Addresses</Link>
                  </li>
                  {user.role === "ADMIN" && (
                    <>
                      <li><hr className="dropdown-divider" style={{ margin: "6px 4px", borderColor: "rgba(159, 82, 58, 0.1)" }} /></li>
                      <li>
                        <Link className="dropdown-item" href="/admin/dashboard">Admin Panel</Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" style={{ margin: "6px 4px", borderColor: "rgba(159, 82, 58, 0.1)" }} /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout} style={{ width: "100%", textAlign: "left", border: "none", background: "none" }}>
                      Sign Out
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
