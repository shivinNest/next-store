"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  isOffer?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  sizes?: { size: string; stock: number }[];
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  author: string;
  tags: string[];
  publishedAt?: string;
}

function formatBlogDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Skeleton ────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="col-6 col-md-3">
      <div className="skeleton" style={{ height: 280, borderRadius: 8 }} />
      <div className="skeleton mt-2" style={{ height: 18, width: "70%" }} />
      <div className="skeleton mt-1" style={{ height: 16, width: "40%" }} />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────
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
    <div className="col-6 col-md-3">
      <Link href={`/product/${product.slug}`} className="text-decoration-none text-dark">
        <div className="product-card card h-100">
          <div className="product-img-wrap">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-fit-cover"
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <i className="bi bi-image text-muted fs-1" />
              </div>
            )}
            {discount && (
              <span className="badge-offer position-absolute top-0 start-0 m-2">
                -{discount}%
              </span>
            )}
          </div>
          <div className="card-body p-2">
            <p className="mb-1 small fw-semibold text-truncate">{product.name}</p>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-primary">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <s className="text-muted small">
                  ₹{Number(product.comparePrice).toLocaleString("en-IN")}
                </s>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Product Section ─────────────────────────────────
function ProductSection({
  title,
  products,
  loading,
  viewAllLink,
}: {
  title: string;
  products: Product[];
  loading: boolean;
  viewAllLink: string;
}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">{title}</h2>
          <Link href={viewAllLink} className="btn btn-outline-primary btn-sm px-4">
            View All
          </Link>
        </div>
        <div className="row g-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ───────────────────────────────────────
export default function HomePage() {
  const [heroData, setHeroData] = useState<{ slides: Slide[]; banners: Banner[] }>({
    slides: [],
    banners: [],
  });
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [heroRes, newRes, trendRes, offerRes, blogRes] = await Promise.all([
          fetch("/api/hero-slides"),
          fetch("/api/products?sort=newest&limit=8"),
          fetch("/api/products?trending=true&limit=8"),
          fetch("/api/products?offer=true&limit=8"),
          fetch("/api/blogs?limit=3"),
        ]);

        const [hero, newP, trend, offer, blog] = await Promise.all([
          heroRes.json(),
          newRes.json(),
          trendRes.json(),
          offerRes.json(),
          blogRes.json(),
        ]);

        if (hero.success) setHeroData(hero.data);
        if (newP.success) setNewProducts(newP.data);
        if (trend.success) setTrendingProducts(trend.data);
        if (offer.success) setOfferProducts(offer.data);
        if (blog.success) setBlogs(blog.data);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <>
      <style>{`
        .section-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          position: relative;
          display: inline-block;
          padding-bottom: 0.75rem;
          letter-spacing: -0.5px;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #9f523a, transparent);
          border-radius: 2px;
        }
        .btn-outline-primary {
          color: #9f523a !important;
          border-color: #9f523a !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-outline-primary:hover {
          background: #9f523a !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.3);
        }
        .hero-slide {
          position: relative;
          height: 520px;
          overflow: hidden;
        }
        .hero-slide-content {
          padding-left: 80px;
          padding-right: 80px;
        }
        .hero-slide::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          z-index: 1;
        }
        .carousel-indicators [data-bs-target] {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
        }
        .carousel-indicators .active {
          background-color: white;
        }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .carousel-control-prev,
        .carousel-control-next {
          width: 50px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          opacity: 1;
        }
        .carousel-control-prev {
          left: 20px;
        }
        .carousel-control-next {
          right: 20px;
        }
        .banner-img-wrap {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.1);
        }
        .banner-img-wrap:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(159, 82, 58, 0.15);
        }
        .banner-overlay {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
          backdrop-filter: blur(4px);
        }
        .promo-banner {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          position: relative;
          overflow: hidden;
        }
        .promo-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .promo-content {
          position: relative;
          z-index: 1;
        }
        .feature-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.12);
          border-color: rgba(159, 82, 58, 0.2);
          transform: translateY(-4px);
        }
        .feature-icon {
          color: #9f523a;
          font-size: 2rem;
          transition: transform 0.3s;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }
        .blog-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-card:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.15) !important;
          border-color: rgba(159, 82, 58, 0.2) !important;
          transform: translateY(-4px);
        }
        .blog-card .card-img-top {
          transition: transform 0.3s;
        }
        .blog-card:hover .card-img-top {
          transform: scale(1.05);
        }
        .blog-card .card-body h6 {
          color: #1a1a1a;
          font-weight: 700;
        }
        .bg-light {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
        }
        .product-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1) !important;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-card:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.12) !important;
          border-color: rgba(159, 82, 58, 0.2) !important;
          transform: translateY(-4px);
        }
        .badge-offer {
          background: linear-gradient(135deg, #9f523a, #7a3f2c) !important;
          color: white !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          font-size: 0.85rem !important;
        }
        .product-card .text-primary {
          color: #9f523a !important;
        }
      `}</style>

      {/* Hero */}
      {loading ? (
        <div className="skeleton" style={{ height: 520 }} />
      ) : (
        <div>
          {heroData.slides.length === 0 ? (
            <div
              className="hero-slide d-flex align-items-center justify-content-center"
              style={{ background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)" }}
            >
              <div className="container text-center text-white" style={{ position: "relative", zIndex: 2 }}>
                <h1 className="display-4 fw-bold" style={{ fontSize: "3rem", marginBottom: "1rem", letterSpacing: "-0.5px" }}>
                  New Season Collection
                </h1>
                <p className="lead" style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
                  Shop the latest trends in women&apos;s fashion
                </p>
                <Link href="/products/all" className="btn btn-light btn-lg mt-3 px-5" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Shop Now
                </Link>
              </div>
            </div>
          ) : (
            <div
              id="heroCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-interval="4000"
            >
              <div className="carousel-indicators">
                {heroData.slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to={i}
                    className={i === 0 ? "active" : ""}
                  />
                ))}
              </div>
              <div className="carousel-inner">
                {heroData.slides.map((slide, i) => (
                  <div key={slide.id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <div
                      className="hero-slide d-flex align-items-center"
                      style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="container hero-slide-content" style={{ position: "relative", zIndex: 2 }}>
                        <div className="col-md-6 text-white">
                          <h1 className="display-5 fw-bold" style={{ fontSize: "2.5rem", marginBottom: "1rem", letterSpacing: "-0.5px" }}>
                            {slide.title}
                          </h1>
                          {slide.subtitle && (
                            <p className="lead" style={{ fontSize: "1.1rem", marginBottom: "1.5rem", opacity: 0.9 }}>
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.link && (
                            <Link href={slide.link} className="btn btn-light btn-lg mt-3 px-5" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                              Explore
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" />
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Banners */}
      {heroData.banners.length > 0 && (
        <section className="py-4 bg-light">
          <div className="container">
            <div className="row g-3">
              {heroData.banners.length >= 2 ? (
                <>
                  {/* First banner spans full width on mobile, half on md */}
                  <div className={heroData.banners.length === 1 ? "col-12" : "col-md-6"}>
                    <Link href={heroData.banners[0].link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                      <Image
                        src={heroData.banners[0].image}
                        alt={heroData.banners[0].title}
                        width={700}
                        height={300}
                        className="img-fluid w-100"
                        style={{ objectFit: "cover", height: 300 }}
                      />
                      <div className="banner-overlay position-absolute bottom-0 start-0 p-3">
                        <span className="fw-bold text-white fs-6">{heroData.banners[0].title}</span>
                      </div>
                    </Link>
                  </div>
                  {/* Remaining banners stacked on the right */}
                  <div className="col-md-6">
                    <div className="row g-3 h-100">
                      {heroData.banners.slice(1).map((banner) => (
                        <div key={banner.id} className={heroData.banners.length <= 3 ? "col-12" : "col-6"}>
                          <Link href={banner.link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                            <Image
                              src={banner.image}
                              alt={banner.title}
                              width={400}
                              height={heroData.banners.length <= 3 ? 138 : 138}
                              className="img-fluid w-100"
                              style={{ objectFit: "cover", height: heroData.banners.length <= 3 ? 138 : 138 }}
                            />
                            <div className="banner-overlay position-absolute bottom-0 start-0 p-2">
                              <span className="fw-semibold text-white small">{banner.title}</span>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-12">
                  <Link href={heroData.banners[0].link || "#"} className="d-block position-relative rounded overflow-hidden banner-img-wrap">
                    <Image
                      src={heroData.banners[0].image}
                      alt={heroData.banners[0].title}
                      width={1200}
                      height={300}
                      className="img-fluid w-100"
                      style={{ objectFit: "cover", height: 300 }}
                    />
                    <div className="banner-overlay position-absolute bottom-0 start-0 p-3">
                      <span className="fw-bold text-white fs-6">{heroData.banners[0].title}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      <ProductSection
        title="New Arrivals"
        products={newProducts}
        loading={loading}
        viewAllLink="/products/all"
      />

      {/* Promo Banner Divider */}
      <div className="promo-banner py-5 text-white">
        <div className="container promo-content">
          <div className="text-center">
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}>
              Summer Sale – Up to 50% Off
            </h2>
            <p className="mb-4" style={{ fontSize: "1.1rem", opacity: 0.9 }}>
              Limited time offer on selected styles
            </p>
            <Link href="/products/all?offer=true" className="btn btn-light btn-lg px-5" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Trending */}
      {(trendingProducts.length > 0 || loading) && (
        <ProductSection
          title="Trending Now"
          products={trendingProducts}
          loading={loading}
          viewAllLink="/products/all?trending=true"
        />
      )}

      {/* Offer Products */}
      {(offerProducts.length > 0 || loading) && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">Special Offers</h2>
              <Link href="/products/all?offer=true" className="btn btn-outline-primary btn-sm px-4">
                View All
              </Link>
            </div>
            <div className="row g-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : offerProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: "bi-truck", title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: "bi-shield-check", title: "Secure Payments", desc: "100% safe transactions" },
              { icon: "bi-arrow-repeat", title: "Easy Returns", desc: "7-day return policy" },
              { icon: "bi-headset", title: "24/7 Support", desc: "Dedicated customer care" },
            ].map((f) => (
              <div key={f.title} className="col-6 col-md-3">
                <div className="feature-card p-4 h-100 text-center">
                  <i className={`bi ${f.icon} feature-icon d-block mb-3`} />
                  <h6 className="fw-bold mb-2" style={{ color: "#1a1a1a" }}>{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {blogs.length > 0 && (
        <section style={{ background: "#faf9f7", padding: "60px 0" }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9f523a", margin: "0 0 6px" }}>Journal</p>
                <h2 className="section-title mb-0">Our Stories</h2>
              </div>
              <Link href="/stories" className="btn btn-outline-primary btn-sm px-4">All Stories</Link>
            </div>
            <div className="row g-4">
              {blogs.map((b) => (
                <div key={b.id} className="col-sm-6 col-lg-4">
                  <Link href={`/stories/${b.slug}`} className="text-decoration-none d-block h-100" style={{ color: "inherit" }}>
                    <article
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ece9e4",
                        transition: "box-shadow 0.25s, transform 0.25s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.10)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
                        {b.image ? (
                          <Image
                            src={b.image}
                            alt={b.title}
                            fill
                            sizes="(max-width:576px) 100vw, 33vw"
                            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                            onMouseEnter={e => ((e.target as HTMLElement).style.transform = "scale(1.04)")}
                            onMouseLeave={e => ((e.target as HTMLElement).style.transform = "scale(1)")}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #e8ddd7, #c9b4a8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "2rem", opacity: 0.4 }}>&#10022;</span>
                          </div>
                        )}
                        {b.tags && b.tags.length > 0 && (
                          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
                            {b.tags.slice(0, 2).map((t) => (
                              <span key={t} style={{
                                background: "rgba(255,255,255,0.92)",
                                color: "#9f523a",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 10px",
                                borderRadius: 4,
                              }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Body */}
                      <div style={{ padding: "20px 22px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                            color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                          }}>
                            {b.author ? b.author[0].toUpperCase() : "S"}
                          </div>
                          <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>{b.author}</span>
                          {b.publishedAt && (
                            <>
                              <span style={{ color: "#ddd", fontSize: "0.75rem" }}>&middot;</span>
                              <span style={{ fontSize: "0.78rem", color: "#aaa" }}>{formatBlogDate(b.publishedAt)}</span>
                            </>
                          )}
                        </div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", lineHeight: 1.35, marginBottom: 10, letterSpacing: "-0.01em" }}>
                          {b.title}
                        </h2>
                        {b.excerpt && (
                          <p style={{
                            fontSize: "0.875rem", color: "#666", lineHeight: 1.65, flex: 1,
                            margin: "0 0 18px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>{b.excerpt}</p>
                        )}
                        <span style={{
                          fontSize: "0.82rem", fontWeight: 700, color: "#9f523a",
                          letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 5,
                        }}>
                          Read Story
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </span>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

            <section style={{ background: "#0d0d0d", padding: "80px 20px", textAlign: "center" }}>
              <div className="container" style={{ maxWidth: 560 }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 16 }}>Join Us</p>
                <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
                  Become part of the Saaviya community.
                </h2>
                <p style={{ fontSize: "1rem", color: "#777", marginBottom: 36, lineHeight: 1.7 }}>
                  Thousands of women across India trust Saaviya for their most important moments. We&apos;d love to be part of yours.
                </p>
                <Link href="/products/all" style={{
                  display: "inline-block",
                  background: "#9f523a",
                  color: "#fff",
                  padding: "14px 44px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  Explore Collection
                </Link>
              </div>
            </section>
    </>
  );
}
