"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  sizes: ProductSize[];
  category?: { name: string; slug: string };
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isOffer?: boolean;
  createdAt?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProduct(d.data);
        } else {
          router.replace("/products/all");
        }
      })
      .catch(() => router.replace("/products/all"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product!.id, size: selectedSize, quantity }),
      });
      if (res.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      } else {
        setError(data.error || "Failed to add to cart");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        setInWishlist(false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product!.id }),
        });
        if (res.ok) setInWishlist(true);
        if (res.status === 401) router.push("/login");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="skeleton" style={{ height: 500, borderRadius: 8 }} />
          </div>
          <div className="col-md-7">
            <div className="skeleton mb-3" style={{ height: 32, width: "70%" }} />
            <div className="skeleton mb-2" style={{ height: 24, width: "30%" }} />
            <div className="skeleton" style={{ height: 100 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          ((Number(product.comparePrice) - Number(product.price)) /
            Number(product.comparePrice)) *
            100
        )
      : null;

  const isOutOfStock =
    product.sizes.length > 0 && product.sizes.every((s) => s.stock === 0);

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919400146232";
    const text = encodeURIComponent(
      `Hi! I'm interested in buying: ${product!.name}\nPrice: ₹${Number(product!.price).toLocaleString("en-IN")}\nSize: ${selectedSize || "(please help me select)"}\nLink: ${window.location.href}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="container py-4 py-md-5">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .breadcrumb {
          background: rgba(159, 82, 58, 0.03);
          border: 1px solid rgba(159, 82, 58, 0.08);
          padding: 12px 16px;
          border-radius: 8px;
        }
        .breadcrumb-item a {
          color: #9f523a;
          text-decoration: none;
          transition: color 0.3s;
        }
        .breadcrumb-item a:hover {
          color: #7a3f2c;
        }
        .product-img-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(159, 82, 58, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }
        .product-img-container:hover {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.15);
          border-color: rgba(159, 82, 58, 0.2);
        }
        .thumbnail-btn {
          border-radius: 8px;
          border: 2px solid #e0e0e0;
          background: #f8f9fa;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s;
          padding: 0;
        }
        .thumbnail-btn:hover {
          border-color: #9f523a;
          transform: scale(1.05);
        }
        .thumbnail-btn.active {
          border-color: #9f523a;
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.2);
        }
        .product-price-main {
          font-size: 2rem;
          font-weight: 800;
          color: #9f523a;
        }
        .product-compare-price {
          color: #999;
          font-size: 1.1rem;
        }
        .size-btn {
          padding: 10px 16px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.9rem;
          min-width: 48px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .size-btn:hover:not(:disabled) {
          border-color: #9f523a;
          color: #9f523a;
          background: rgba(159, 82, 58, 0.05);
        }
        .size-btn.selected {
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          color: white;
          border-color: #9f523a;
          box-shadow: 0 4px 12px rgba(159, 82, 58, 0.3);
        }
        .size-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .qty-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          color: #9f523a;
        }
        .qty-btn:hover:not(:disabled) {
          background: #9f523a;
          color: white;
          border-color: #9f523a;
        }
        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .qty-display {
          font-weight: 700;
          font-size: 1.1rem;
          min-width: 40px;
          text-align: center;
        }
        .shipping-box {
          background: rgba(32, 201, 151, 0.05);
          border: 1px solid rgba(32, 201, 151, 0.2);
          border-left: 4px solid #20c997;
          padding: 1rem;
          border-radius: 8px;
          color: #333;
        }
        .shipping-box i {
          color: #20c997;
        }
        .btn-add-to-cart {
          background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
          color: white;
          border: none;
          padding: 0 28px;
          height: 54px;
          width: 100%;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(159, 82, 58, 0.25);
        }
        .btn-add-to-cart:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(159, 82, 58, 0.45);
          transform: translateY(-1px);
          background: linear-gradient(135deg, #b05e44 0%, #8b4832 100%);
        }
        .btn-add-to-cart:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(159, 82, 58, 0.25);
        }
        .btn-add-to-cart:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-whatsapp {
          background: #25D366;
          color: #fff;
          border: none;
          padding: 0 28px;
          height: 54px;
          width: 100%;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);
        }
        .btn-whatsapp:hover {
          background: #20bd5a;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
          transform: translateY(-1px);
        }
        .btn-whatsapp:active {
          transform: translateY(0);
        }
        .btn-wishlist-action {
          height: 48px;
          width: 100%;
          background: transparent;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-wishlist-action:hover:not(:disabled) {
          border-color: #9f523a;
          color: #9f523a;
          background: rgba(159, 82, 58, 0.04);
        }
        .btn-wishlist-action.active {
          border-color: #dc3545;
          color: #dc3545;
          background: rgba(220, 53, 69, 0.04);
        }
        .btn-wishlist-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .cta-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
          color: #ccc;
          font-size: 0.75rem;
        }
        .cta-divider::before, .cta-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e8e8;
        }
        .product-tags {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(159, 82, 58, 0.1);
        }
        .tag-badge {
          background: rgba(159, 82, 58, 0.08);
          color: #9f523a;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          border: 1px solid rgba(159, 82, 58, 0.15);
          transition: all 0.3s;
          display: inline-block;
          margin-right: 8px;
          margin-bottom: 8px;
        }
        .tag-badge:hover {
          background: rgba(159, 82, 58, 0.15);
          border-color: rgba(159, 82, 58, 0.3);
        }
      `}</style>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><Link href="/">Home</Link></li>
          {product.category && (
            <li className="breadcrumb-item">
              <Link href={`/products/${product.category.slug}`}>{product.category.name}</Link>
            </li>
          )}
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Images */}
        <div className="col-lg-5">
          <div
            className="product-img-container mb-3 position-relative"
            style={{ aspectRatio: "3/4" }}
          >
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-fit-cover"
                priority
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <i className="bi bi-image text-muted" style={{ fontSize: "3rem" }} />
              </div>
            )}
            {discount && (
              <span 
                className="position-absolute top-0 start-0 m-3"
                style={{
                  background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`thumbnail-btn ${selectedImage === i ? "active" : ""}`}
                  style={{ width: 70, height: 90 }}
                >
                  <Image
                    src={img}
                    alt=""
                    width={70}
                    height={90}
                    className="object-fit-cover w-100 h-100"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="col-lg-7">
          {product.category && (
            <Link
              href={`/products/${product.category.slug}`}
              className="text-decoration-none small text-uppercase"
              style={{ color: "#9f523a", fontSize: "0.8rem", letterSpacing: "1px" }}
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="h2 fw-bold mt-2 mb-1" style={{ lineHeight: 1.2 }}>{product.name}</h1>

          {/* Short description / tagline */}
          {product.shortDescription && (
            <p className="mb-3" style={{ color: "#666", fontSize: "1rem", lineHeight: 1.6, fontStyle: "italic" }}>
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <span className="product-price-main">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <s className="product-compare-price">
                ₹{Number(product.comparePrice).toLocaleString("en-IN")}
              </s>
            )}
            {discount && (
              <span 
                style={{
                  background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Out of stock banner */}
          {isOutOfStock && (
            <div className="mb-3" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(220,53,69,0.08)",
              border: "1px solid rgba(220,53,69,0.25)",
              color: "#dc3545",
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}>
              <i className="bi bi-x-circle-fill" /> Out of Stock
            </div>
          )}

          {/* Badges */}
          {(product.isFeatured || product.isTrending || product.isOffer) && (
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {product.isFeatured && (
                <span style={{
                  background: "linear-gradient(135deg, #ffc107, #ff9800)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}>Featured</span>
              )}
              {product.isTrending && (
                <span style={{
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}>Trending</span>
              )}
              {product.isOffer && (
                <span style={{
                  background: "linear-gradient(135deg, #dc3545, #e74c3c)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}>Sale</span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div
              className="mb-4"
              style={{
                color: "#444",
                lineHeight: "1.8",
                padding: "1rem",
                background: "rgba(159, 82, 58, 0.02)",
                borderLeft: "4px solid #9f523a",
                borderRadius: "6px",
                fontSize: "0.92rem",
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Size selector */}
          <div className="mb-4">
            <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#1a1a1a" }}>
              Select Size
            </h6>
            <div className="d-flex gap-2 flex-wrap mb-2">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  className={`size-btn ${selectedSize === s.size ? "selected" : ""}`}
                  disabled={s.stock === 0}
                  onClick={() => {
                    setSelectedSize(s.size);
                    setError("");
                  }}
                  title={s.stock === 0 ? "Out of stock" : `${s.stock} in stock`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {!selectedSize && error && (
              <p className="text-danger small mb-0">{error}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#1a1a1a" }}>Quantity</h6>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "fit-content", padding: "8px 12px", background: "rgba(159, 82, 58, 0.02)", borderRadius: "8px", border: "1px solid rgba(159, 82, 58, 0.1)" }}>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Shipping note */}
          <div className="shipping-box mb-4">
            <i className="bi bi-truck me-2" />
            <span>Free delivery on orders above ₹999</span>
          </div>

          {/* Actions */}
          <div className="d-flex flex-column gap-2 mb-3" style={{ maxWidth: "520px" }}>
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
            >
              {isOutOfStock ? (
                <><i className="bi bi-slash-circle" />Out of Stock</>
              ) : adding ? (
                <><span className="spinner-border spinner-border-sm" style={{ borderWidth: "2px" }} />Adding to Cart...</>
              ) : addedToCart ? (
                <><i className="bi bi-check2-circle" />Added to Cart!</>
              ) : (
                <><i className="bi bi-bag-plus" />Add to Cart</>
              )}
            </button>

            <div className="cta-divider">or</div>

            <button className="btn-whatsapp" onClick={handleWhatsApp}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Buy via WhatsApp
            </button>

            <button
              className={`btn-wishlist-action${inWishlist ? " active" : ""}`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
            >
              <i className={`bi ${inWishlist ? "bi-heart-fill" : "bi-heart"}`} />
              {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            {addedToCart && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(32, 201, 151, 0.08)",
                border: "1px solid rgba(32, 201, 151, 0.25)",
                borderRadius: "10px",
                animation: "fadeInUp 0.3s ease",
              }}>
                <i className="bi bi-check-circle-fill" style={{ color: "#20c997", fontSize: "1.1rem" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a" }}>Added to cart!</span>
                <Link href="/cart" className="ms-auto text-decoration-none fw-semibold" style={{ fontSize: "0.85rem", color: "#20c997", whiteSpace: "nowrap" }}>
                  View Cart →
                </Link>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              <span className="text-muted small me-3" style={{ fontWeight: 600 }}>Tags:</span>
              {product.tags.map((t) => (
                <span key={t} className="tag-badge">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
