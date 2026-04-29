"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  isOffer?: boolean;
  sizes?: { size: string; stock: number }[];
  category?: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

// Module-level cache: fetched once per browser session, survives navigation
let _categoriesCache: Category[] | null = null;

async function getCategories(): Promise<Category[]> {
  if (_categoriesCache) return _categoriesCache;
  const res = await fetch("/api/categories");
  const data = await res.json();
  if (data.success) _categoriesCache = data.data;
  return _categoriesCache || [];
}

function ProductCard({ product }: { product: Product }) {
  const discount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          ((Number(product.comparePrice) - Number(product.price)) /
            Number(product.comparePrice)) *
            100
        )
      : null;

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <Link href={`/product/${product.slug}`} className="text-decoration-none text-dark">
        <div className="product-card card h-100" style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          border: "1px solid rgba(159, 82, 58, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 2px 8px rgba(159, 82, 58, 0.08)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(159, 82, 58, 0.2)";
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(159, 82, 58, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(159, 82, 58, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(159, 82, 58, 0.1)";
        }}>
          <div className="product-img-wrap" style={{
            position: "relative",
            height: "300px",
            overflow: "hidden",
            borderRadius: "12px 12px 0 0"
          }}>
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-fit-cover"
                style={{
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLImageElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLImageElement).style.transform = "scale(1)";
                }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{
                background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)"
              }}>
                <i className="bi bi-image text-white fs-1" />
              </div>
            )}
            {discount && (
              <span style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}>
                -{discount}%
              </span>
            )}
          </div>
          <div className="card-body p-3" style={{ display: "flex", flexDirection: "column" }}>
            <p className="mb-2" style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: "1.3",
              minHeight: "2.6rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>{product.name}</p>
            <div style={{ marginTop: "auto" }}>
              <div className="d-flex align-items-center gap-2">
                <span style={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#9f523a"
                }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                  <s style={{
                    color: "#999",
                    fontSize: "0.9rem"
                  }}>
                    ₹{Number(product.comparePrice).toLocaleString("en-IN")}
                  </s>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = (Array.isArray(params.category) ? params.category[0] : params.category as string) || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (categorySlug && categorySlug !== "all") sp.set("category", categorySlug);
      if (search) sp.set("search", search);
      if (searchParams.get("trending")) sp.set("trending", "true");
      if (searchParams.get("offer")) sp.set("offer", "true");
      sp.set("sort", sort);
      sp.set("page", String(page));

      const res = await fetch(`/api/products?${sp}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, search, sort, page, searchParams]);

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label || "Sort by";

  const updateSort = (s: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("sort", s);
    sp.delete("page");
    router.push(`?${sp}`);
  };

  return (
    <div className="container py-5">
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sidebar-card {
          animation: slideInLeft 0.5s ease-out;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          box-shadow: 0 2px 12px rgba(159, 82, 58, 0.08) !important;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-card:hover {
          box-shadow: 0 6px 20px rgba(159, 82, 58, 0.12) !important;
          border-color: rgba(159, 82, 58, 0.2) !important;
        }
        .sidebar-title {
          position: relative;
          padding-bottom: 12px;
          margin-bottom: 20px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #9f523a;
        }
        .sidebar-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 35px;
          height: 3px;
          background: linear-gradient(90deg, #9f523a, transparent);
          border-radius: 2px;
        }
        .category-link {
          position: relative;
          display: block;
          padding: 10px 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
          text-decoration: none !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 3px solid transparent;
          padding-left: 12px;
          margin-left: -12px;
        }
        .category-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-link:hover {
          color: #9f523a;
          border-left-color: #9f523a;
          transform: translateX(4px);
        }
        .category-link.active {
          color: #9f523a;
          font-weight: 700;
          border-left-color: #9f523a;
          background: linear-gradient(90deg, rgba(159, 82, 58, 0.05), transparent);
        }
        .category-link.active::before {
          content: '';
          opacity: 0;
        }
        .pg-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1.5px solid #ede8e3;
        }
        .pg-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
          height: 38px;
          padding: 0 10px;
          border: 1.5px solid #e5dfd9;
          border-radius: 8px;
          background: #fff;
          color: #555;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.01em;
          white-space: nowrap;
          user-select: none;
        }
        .pg-btn:hover:not(:disabled) {
          border-color: #9f523a;
          color: #9f523a;
          background: rgba(159, 82, 58, 0.04);
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(159, 82, 58, 0.12);
        }
        .pg-btn.active {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          border-color: #9f523a;
          color: #fff;
          box-shadow: 0 4px 14px rgba(159, 82, 58, 0.35);
          transform: translateY(-1px);
        }
        .pg-btn:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }
        .pg-nav {
          gap: 6px;
          padding: 0 6px;
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .pg-ellipsis {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          color: #bbb;
          font-size: 0.95rem;
          letter-spacing: 0.1em;
          pointer-events: none;
        }
        .pg-info {
          font-size: 0.73rem;
          color: #aaa;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sort-dropdown-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: #fff;
          border: 1.5px solid #e5dfd9;
          border-radius: 8px;
          color: #333;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .sort-dropdown-btn:hover, .sort-dropdown-btn.open {
          border-color: #9f523a;
          box-shadow: 0 0 0 3px rgba(159,82,58,0.08);
          color: #9f523a;
        }
        .sort-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 190px;
          background: #fff;
          border: 1.5px solid #e5dfd9;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          z-index: 200;
          overflow: hidden;
          animation: fadeInDown 0.12s ease;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sort-dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 0.83rem;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
        }
        .sort-dropdown-item:hover {
          background: rgba(159,82,58,0.06);
          color: #9f523a;
        }
        .sort-dropdown-item.active {
          background: rgba(159,82,58,0.08);
          color: #9f523a;
          font-weight: 700;
        }
        .page-title {
          font-size: 1.55rem;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin-bottom: 0;
          line-height: 1.2;
        }
        .page-count {
          font-size: 0.75rem;
          color: #aaa;
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-top: 4px;
        }
        .products-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1.5px solid #ede8e3;
          margin-bottom: 28px;
        }
      `}</style>

      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-2">
          <div className="card border-0 sidebar-card">
            <div className="card-body p-4">
              <h6 className="sidebar-title">Categories</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <Link
                    href="/products"
                    className={`category-link ${categorySlug === "all" ? "active" : ""}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products/${c.slug}`}
                      className={`category-link ${categorySlug === c.slug ? "active" : ""}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-lg-10">
          {/* Header */}
          <div className="products-header">
            <div>
              <h1 className="page-title">
                {categorySlug === "all"
                  ? search
                    ? `"${search}"`
                    : "All Products"
                  : categories.find((c) => c.slug === categorySlug)?.name || "Products"}
              </h1>
              {!loading && (
                <p className="page-count mb-0">
                  {pagination.total} {pagination.total === 1 ? "result" : "results"}
                </p>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className={`sort-dropdown-btn ${sortOpen ? "open" : ""}`}
                onClick={() => setSortOpen((v) => !v)}
                onBlur={() => setTimeout(() => setSortOpen(false), 150)}
              >
                <i className="bi bi-sort-down" style={{ fontSize: "0.9rem" }} />
                {currentSortLabel}
                <i className="bi bi-chevron-down" style={{ fontSize: "0.65rem", transition: "transform 0.15s", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {sortOpen && (
                <div className="sort-dropdown-menu">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`sort-dropdown-item ${sort === opt.value ? "active" : ""}`}
                      onClick={() => { updateSort(opt.value); setSortOpen(false); }}
                    >
                      {sort === opt.value && <i className="bi bi-check2 me-2" style={{ color: "#9f523a" }} />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="row g-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
                  <div className="skeleton mt-3" style={{ height: 16, width: "70%" }} />
                  <div className="skeleton mt-2" style={{ height: 16, width: "40%" }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5" style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "12px",
              border: "1px solid rgba(159, 82, 58, 0.1)",
              padding: "60px 20px"
            }}>
              <i className="bi bi-bag-x" style={{ fontSize: "3rem", color: "#9f523a" }} />
              <h5 className="mt-3" style={{ color: "#666", fontWeight: 600 }}>No products found</h5>
              <p style={{ color: "#999", fontSize: "0.95rem" }}>Try adjusting your filters or search terms</p>
              <Link href="/products" className="btn btn-primary mt-3" style={{
                background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                border: "none",
                padding: "10px 24px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (() => {
                const goTo = (p: number) => {
                  const sp = new URLSearchParams(searchParams.toString());
                  sp.set("page", String(p));
                  router.push(`?${sp}`);
                };
                // Build page numbers with ellipsis
                const range: (number | "...")[] = [];
                const total = pagination.pages;
                if (total <= 7) {
                  for (let i = 1; i <= total; i++) range.push(i);
                } else {
                  range.push(1);
                  if (page > 3) range.push("...");
                  for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) range.push(i);
                  if (page < total - 2) range.push("...");
                  range.push(total);
                }
                return (
                <div className="pg-wrap">
                  <div className="pg-row">
                    <button className="pg-btn pg-nav" disabled={page <= 1} onClick={() => goTo(page - 1)}>
                      <i className="bi bi-chevron-left" style={{ fontSize: "0.7rem" }} />&nbsp;Prev
                    </button>
                    {range.map((r, i) =>
                      r === "..." ? (
                        <span key={`e${i}`} className="pg-ellipsis">···</span>
                      ) : (
                        <button
                          key={r}
                          className={`pg-btn${page === r ? " active" : ""}`}
                          onClick={() => goTo(r as number)}
                        >{r}</button>
                      )
                    )}
                    <button className="pg-btn pg-nav" disabled={page >= pagination.pages} onClick={() => goTo(page + 1)}>
                      Next&nbsp;<i className="bi bi-chevron-right" style={{ fontSize: "0.7rem" }} />
                    </button>
                  </div>
                  <span className="pg-info">Page {page} of {pagination.pages} &nbsp;·&nbsp; {pagination.total} items</span>
                </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
