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
      <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 6 }}>Account</p>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111", letterSpacing: "-0.01em", marginBottom: 28 }}>
        Wishlist <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#aaa" }}>({items.length})</span>
      </h2>

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
        <div style={{ textAlign: "center", padding: "64px 20px", background: "#fff", border: "1px solid #ece9e4", borderRadius: 12 }}>
          <p style={{ fontSize: "2.4rem", marginBottom: 12 }}>&#10084;</p>
          <p style={{ fontWeight: 600, color: "#555", marginBottom: 20, fontSize: "0.975rem" }}>Your wishlist is empty</p>
          <Link href="/products/all" style={{ background: "#9f523a", color: "#fff", padding: "11px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const p = item.product;
            return (
              <div key={item.id} className="col-6 col-md-4">
                <div style={{ border: "1px solid #ece9e4", borderRadius: 10, overflow: "hidden", background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="product-img-wrap" style={{ position: "relative" }}>
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <span style={{ fontSize: "2rem", color: "#ccc" }}>&#128444;</span>
                      </div>
                    )}
                    <button
                      style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "1px solid #ece9e4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem", color: "#b91c1c", lineHeight: 1 }}
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                  <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#9f523a", margin: 0 }}>
                        &#8377;{Number(p.price).toLocaleString("en-IN")}
                      </p>
                    </Link>
                    <Link href={`/product/${p.slug}`} style={{ display: "block", marginTop: 10, background: "#9f523a", color: "#fff", textAlign: "center", padding: "8px", borderRadius: 7, textDecoration: "none", fontSize: "0.8rem", fontWeight: 700 }}>
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
