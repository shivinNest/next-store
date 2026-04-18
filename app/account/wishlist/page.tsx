"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    comparePrice?: string | number | null;
    images: string[];
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => d.success && setItems(d.data))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (id: string) => {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h5 className="fw-bold mb-4">My Wishlist ({items.length} items)</h5>

      {loading ? (
        <div className="row g-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-6 col-md-4">
              <div className="skeleton" style={{ height: 240, borderRadius: 8 }} />
              <div className="skeleton mt-2" style={{ height: 16, width: "70%" }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart fs-1 text-muted" />
          <h6 className="mt-3 text-muted">Your wishlist is empty</h6>
          <Link href="/products/all" className="btn btn-primary mt-3">Browse Products</Link>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const p = item.product;
            return (
              <div key={item.id} className="col-6 col-md-4">
                <div className="card border-0 shadow-sm h-100 product-card">
                  <div className="product-img-wrap">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <i className="bi bi-image text-muted fs-1" />
                      </div>
                    )}
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-1 lh-1"
                      style={{ width: 28, height: 28 }}
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      <i className="bi bi-x" />
                    </button>
                  </div>
                  <div className="card-body p-2">
                    <Link href={`/product/${p.slug}`} className="text-decoration-none text-dark">
                      <p className="mb-1 small fw-semibold text-truncate">{p.name}</p>
                      <span className="fw-bold text-primary small">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </span>
                    </Link>
                    <Link
                      href={`/product/${p.slug}`}
                      className="btn btn-primary btn-sm w-100 mt-2"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
