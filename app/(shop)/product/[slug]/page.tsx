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
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
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
          background: linear-gradient(135deg, #9f523a, #7a3f2c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-add-to-cart:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(159, 82, 58, 0.4);
          transform: translateY(-2px);
        }
        .btn-wishlist-btn {
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .btn-wishlist-btn:hover:not(:disabled) {
          border-color: #9f523a;
          color: #9f523a;
          background: rgba(159, 82, 58, 0.05);
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
          <h1 className="h2 fw-bold mt-2 mb-2" style={{ lineHeight: 1.2 }}>{product.name}</h1>

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
            <p className="mb-4" style={{ 
              color: "#555",
              lineHeight: "1.8",
              padding: "1rem",
              background: "rgba(159, 82, 58, 0.02)",
              borderLeft: "4px solid #9f523a",
              borderRadius: "6px"
            }}>
              {product.description}
            </p>
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
          <div className="d-flex gap-2 flex-wrap mb-3">
            <button
              className="btn-add-to-cart flex-grow-1"
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
              style={{ minWidth: "200px", opacity: isOutOfStock ? 0.5 : 1 }}
            >
              {isOutOfStock ? (
                <><i className="bi bi-slash-circle me-2" />Out of Stock</>
              ) : adding ? (
                <><span className="spinner-border spinner-border-sm me-2" style={{ borderWidth: "2px" }} />Adding...</>
              ) : addedToCart ? (
                <><i className="bi bi-check2 me-2" />Added!</>
              ) : (
                <><i className="bi bi-bag-plus me-2" />Add to Cart</>
              )}
            </button>
            <button
              className="btn btn-lg btn-wishlist-btn"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              title="Add to Wishlist"
              style={{ padding: "12px 24px" }}
            >
              <i className={`bi ${inWishlist ? "bi-heart-fill text-danger" : "bi-heart"}`} />
            </button>
          </div>

          {/* WhatsApp buy button */}
          <button
            onClick={handleWhatsApp}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "#25D366",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              transition: "opacity 0.2s",
              marginBottom: "12px",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Buy via WhatsApp
          </button>

          {addedToCart && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
              <i className="bi bi-bag-check-fill" />
              <span>Added to cart!</span>
              <Link href="/cart" className="ms-auto text-decoration-none small fw-semibold" style={{ color: "#20c997" }}>
                View Cart →
              </Link>
            </div>
          )}

          {error && !selectedSize && (
            <div className="alert alert-danger py-2 small mb-3">{error}</div>
          )}

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
