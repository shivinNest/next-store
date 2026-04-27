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
          height: clamp(480px, 70vh, 680px);
          overflow: hidden;
        }
        .hero-slide-content {
          padding-left: 80px;
          padding-right: 80px;
        }
        @media (max-width: 768px) {
          .hero-slide-content { padding-left: 24px; padding-right: 24px; }
        }
        .hero-slide::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(105deg,
            rgba(0,0,0,0.62) 0%,
            rgba(0,0,0,0.38) 45%,
            rgba(0,0,0,0.08) 100%);
          z-index: 1;
        }
        .hero-slide-inner {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.06);
          transition: transform 6s ease;
        }
        .carousel-item.active .hero-slide-inner {
          transform: scale(1);
        }
        .carousel-indicators {
          bottom: 24px;
          gap: 8px;
          margin: 0;
        }
        .carousel-indicators [data-bs-target] {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 0.4);
          border: none;
          margin: 0;
          transition: all 0.3s;
        }
        .carousel-indicators .active {
          background-color: white;
          width: 44px;
        }
        .carousel-control-prev,
        .carousel-control-next {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          backdrop-filter: blur(6px);
          opacity: 0;
          transition: opacity 0.3s, background 0.2s;
        }
        .carousel:hover .carousel-control-prev,
        .carousel:hover .carousel-control-next { opacity: 1; }
        .carousel-control-prev:hover,
        .carousel-control-next:hover { background: rgba(255,255,255,0.28); }
        .carousel-control-prev { left: 20px; }
        .carousel-control-next { right: 20px; }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          width: 18px;
          height: 18px;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          margin-bottom: 20px;
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
          position: relative;
          overflow: hidden;
          background-color: #7a3f2c;
        }
        .promo-banner-bg {
          position: absolute;
          inset: 0;
          background-image: url('/assets/mahimayadav0-ethnic-4762352_1920.jpg');
          background-size: cover;
          background-position: center 20%;
          transform: scale(1.04);
          transition: transform 8s ease;
        }
        .promo-banner:hover .promo-banner-bg {
          transform: scale(1);
        }
        .promo-banner::before {
          content: 'SALE';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(120px, 18vw, 220px);
          font-weight: 900;
          color: rgba(255, 255, 255, 0.06);
          letter-spacing: -8px;
          pointer-events: none;
          line-height: 1;
          user-select: none;
          z-index: 2;
        }
        .promo-banner::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            linear-gradient(100deg, rgba(122,63,44,0.92) 0%, rgba(122,63,44,0.75) 55%, rgba(80,30,15,0.55) 100%);
          z-index: 1;
          pointer-events: none;
        }
        .promo-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }
        .promo-discount-badge {
          background: rgba(255,255,255,0.12);
          border: 2px solid rgba(255,255,255,0.25);
          border-radius: 20px;
          padding: 28px 36px;
          text-align: center;
          backdrop-filter: blur(4px);
        }
        @keyframes promo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .promo-discount-badge {
          animation: promo-pulse 3s ease-in-out infinite;
        }
        .promo-content {
          position: relative;
          z-index: 1;
        }
        .trust-strip {
          background: #fff;
          border-top: 1px solid rgba(159,82,58,0.08);
          border-bottom: 1px solid rgba(159,82,58,0.08);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 20px;
          position: relative;
          transition: background 0.2s;
        }
        .trust-item:hover {
          background: rgba(159,82,58,0.03);
        }
        .trust-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(159,82,58,0.1);
        }
        .trust-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(159,82,58,0.1), rgba(159,82,58,0.06));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #9f523a;
          font-size: 1.2rem;
          transition: all 0.25s;
        }
        .trust-item:hover .trust-icon-wrap {
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          color: #fff;
          box-shadow: 0 4px 12px rgba(159,82,58,0.3);
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
        .about-section {
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .about-section::before {
          content: 'SAAVIYA';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(80px, 12vw, 160px);
          font-weight: 900;
          color: rgba(159, 82, 58, 0.04);
          letter-spacing: -4px;
          pointer-events: none;
          line-height: 1;
          user-select: none;
        }
        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(159, 82, 58, 0.08);
          border: 1px solid rgba(159, 82, 58, 0.15);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9f523a;
        }
        .about-pillar {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fdf9f7 0%, #f9f2ee 100%);
          border: 1px solid rgba(159, 82, 58, 0.08);
          transition: all 0.3s;
        }
        .about-pillar:hover {
          border-color: rgba(159, 82, 58, 0.2);
          box-shadow: 0 6px 20px rgba(159, 82, 58, 0.1);
          transform: translateY(-2px);
        }
        .about-pillar-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
          font-size: 1.1rem;
        }
        .about-img-stack {
          position: relative;
        }
        .about-img-main {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }
        .about-img-accent {
          position: absolute;
          bottom: -24px;
          right: -24px;
          width: 160px;
          height: 160px;
          border-radius: 12px;
          overflow: hidden;
          border: 4px solid white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .about-years-badge {
          position: absolute;
          top: 24px;
          left: -20px;
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(159, 82, 58, 0.35);
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
                    <div className="hero-slide d-flex align-items-center">
                      {/* Ken-Burns background */}
                      <div
                        className="hero-slide-inner"
                        style={{ backgroundImage: `url(${slide.image})` }}
                      />
                      <div className="container hero-slide-content" style={{ position: "relative", zIndex: 2 }}>
                        <div className="col-lg-6 col-md-8 text-white">
                          <div className="hero-badge">
                            <i className="bi bi-stars" />
                            New Collection
                          </div>
                          <h1 style={{
                            fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)",
                            fontWeight: 900,
                            lineHeight: 1.12,
                            letterSpacing: "-0.03em",
                            marginBottom: 16,
                            textShadow: "0 2px 16px rgba(0,0,0,0.3)",
                          }}>
                            {slide.title}
                          </h1>
                          {slide.subtitle && (
                            <p style={{
                              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                              lineHeight: 1.7,
                              marginBottom: 32,
                              opacity: 0.88,
                              maxWidth: 420,
                              textShadow: "0 1px 6px rgba(0,0,0,0.25)",
                            }}>
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.link && (
                            <Link
                              href={slide.link}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "#fff",
                                color: "#9f523a",
                                padding: "14px 36px",
                                borderRadius: 10,
                                fontWeight: 800,
                                fontSize: "0.9rem",
                                textDecoration: "none",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                              }}
                            >
                              Explore
                              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
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

      {/* About Saaviya */}
      <section className="about-section py-5 py-lg-6">
        <div className="container py-2">
          <div className="row align-items-center g-5">
            {/* Text side */}
            <div className="col-lg-6 order-2 order-lg-1">
              <span className="about-badge mb-4 d-inline-flex">
                <i className="bi bi-stars" />
                Our Story
              </span>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
                Crafted for the
                <span style={{ color: "#9f523a", display: "block" }}>modern Indian woman.</span>
              </h2>
              <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 480 }}>
                Saaviya was born from a simple belief — every woman deserves to feel beautiful, confident, and effortlessly stylish. We curate ethnic and contemporary fashion that blends tradition with modern sensibility, delivered straight to your doorstep.
              </p>
              <div className="row g-3 mb-4">
                {[
                  { icon: "bi-gem", title: "Premium Quality", desc: "Handpicked fabrics & finishes that stand the test of time" },
                  { icon: "bi-palette", title: "Thoughtful Design", desc: "Every piece is designed with the Indian woman in mind" },
                  { icon: "bi-heart", title: "Made with Love", desc: "Small-batch collections crafted with care & attention" },
                  { icon: "bi-truck", title: "Pan-India Delivery", desc: "Fast, reliable shipping to every corner of India" },
                ].map((p) => (
                  <div key={p.title} className="col-12 col-sm-6">
                    <div className="about-pillar">
                      <div className="about-pillar-icon">
                        <i className={`bi ${p.icon}`} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", marginBottom: 3 }}>{p.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "#888", lineHeight: 1.5 }}>{p.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                  color: "#fff",
                  padding: "13px 32px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  boxShadow: "0 4px 16px rgba(159,82,58,0.3)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(159,82,58,0.45)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(159,82,58,0.3)";
                }}
              >
                Discover Our Story
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>

            {/* Visual side */}
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="about-img-stack" style={{ paddingBottom: 48, paddingRight: 24 }}>
                <div className="about-img-main" style={{ aspectRatio: "4/5", position: "relative" }}>
                  <Image
                    src="/assets/mahimayadav0-ethnic-4762352_1920.jpg"
                    alt="Saaviya — Fashion that speaks for you"
                    fill
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                  {/* Subtle gradient overlay at bottom for badge readability */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%)",
                    borderRadius: "inherit",
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    color: "white",
                  }}>
                    <p style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>Saaviya</p>
                    <p style={{ fontSize: "0.78rem", letterSpacing: "0.06em", margin: 0, opacity: 0.85, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Fashion that speaks for you</p>
                  </div>
                </div>

                {/* Accent box — brand value */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                  color: "white",
                  padding: "18px 22px",
                  borderRadius: 14,
                  boxShadow: "0 8px 28px rgba(159,82,58,0.4)",
                  minWidth: 140,
                  border: "3px solid white",
                }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-1px" }}>500+</div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: 4, lineHeight: 1.4 }}>Styles curated<br />every season</div>
                </div>

                {/* Floating badge */}
                <div className="about-years-badge">
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>10K+</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.85, marginTop: 4, lineHeight: 1.3 }}>Happy<br />Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <ProductSection
        title="New Arrivals"
        products={newProducts}
        loading={loading}
        viewAllLink="/products/all"
      />

      {/* Promo Banner Divider */}
      <div className="promo-banner text-white" style={{ padding: "72px 0" }}>
        <div className="promo-banner-bg" />
        <div className="container promo-content" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center g-4">
            {/* Left: text */}
            <div className="col-lg-8">
              <span className="promo-tag mb-4 d-inline-flex">
                <i className="bi bi-lightning-charge-fill" style={{ color: "#ffd700" }} />
                Limited Time Offer
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
                Summer Sale
                <span style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "60%", fontWeight: 700, letterSpacing: "0.02em", marginTop: 6 }}>Up to 50% off on selected styles</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", marginBottom: 32, lineHeight: 1.7, maxWidth: 480 }}>
                Refresh your wardrobe this season with our biggest sale yet — handpicked kurtas, lehengas, and ethnic sets at unbeatable prices.
              </p>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Link
                  href="/products/all?offer=true"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#fff", color: "#9f523a",
                    padding: "14px 36px", borderRadius: 10,
                    fontWeight: 800, fontSize: "0.95rem",
                    textDecoration: "none", letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"; }}
                >
                  Shop the Sale
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </Link>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
                  No code needed · Auto-applied at checkout
                </span>
              </div>
            </div>
            {/* Right: badge */}
            <div className="col-lg-4 text-center">
              <div className="promo-discount-badge d-inline-block">
                <div style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-3px" }}>50%</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>OFF</div>
                <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 2, margin: "12px auto" }} />
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Selected Styles</div>
              </div>
            </div>
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

      {/* Trust Strip */}
      <div className="trust-strip">
        <div className="container">
          <div className="row g-0">
            {[
              { icon: "bi-truck",        title: "Free Shipping",    desc: "Orders above ₹999" },
              { icon: "bi-shield-check", title: "Secure Payments",  desc: "100% safe & encrypted" },
              { icon: "bi-arrow-repeat", title: "Easy Returns",     desc: "7-day hassle-free" },
              { icon: "bi-headset",      title: "Customer Support", desc: "Mon–Sat, 9 AM – 6 PM" },
            ].map((f) => (
              <div key={f.title} className="col-6 col-md-3">
                <div className="trust-item">
                  <div className="trust-icon-wrap">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", lineHeight: 1.3 }}>{f.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#999", marginTop: 2 }}>{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      {/* Instagram CTA */}
      <section className="d-none" style={{
        background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
        padding: "72px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 15% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container position-relative text-center text-white" style={{ maxWidth: 600 }}>
          {/* Instagram icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            backdropFilter: "blur(4px)",
            fontSize: "2rem",
          }}>
            <i className="bi bi-instagram" />
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            marginBottom: 20,
          }}>
            @saaviya.in
          </span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Follow us on Instagram
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: 36, maxWidth: 460, margin: "0 auto 36px" }}>
            Get daily style inspiration, new arrivals, behind-the-scenes peeks, and exclusive offers — straight to your feed.
          </p>
          <a
            href="https://www.instagram.com/saa.viya"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#fff",
              color: "#c13584",
              padding: "14px 36px", borderRadius: 10,
              fontWeight: 800, fontSize: "0.95rem",
              textDecoration: "none", letterSpacing: "0.02em",
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)"; }}
          >
            <i className="bi bi-instagram" style={{ fontSize: "1.1rem" }} />
            Follow @saa.viya
          </a>
        </div>
      </section>

            <section style={{ background: "#0d0d0d", padding: "80px 20px", textAlign: "center" }}>
              <div className="container" style={{ maxWidth: 560 }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 16 }}>Join Us</p>
                <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
                  Follow us on Instagram.
                </h2>
                <p style={{ fontSize: "1rem", color: "#777", marginBottom: 36, lineHeight: 1.7 }}>
                  Thousands of women across India trust Saaviya for their most important moments. We&apos;d love to be part of yours.
                </p>
                <a href="https://www.instagram.com/saa.viya" target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex",
                  alignItems: "center", gap: 10,
                  background: "#9f523a",
                  color: "#fff",
                  padding: "14px 44px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                }}>
                  <i className="bi bi-instagram" style={{ fontSize: "1.1rem" }} />
                  Follow @saa.viya
                </a>
              </div>
            </section>
    </>
  );
}
