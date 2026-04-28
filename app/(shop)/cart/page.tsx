"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  size: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images: string[];
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        // User not logged in - try to load from localStorage
        setIsGuest(true);
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          setItems(JSON.parse(guestCart));
        }
      } else {
        const data = await res.json();
        if (data.success) {
          setItems(data.data);
          setIsGuest(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (isGuest) {
      // Update guest cart in localStorage
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      localStorage.setItem("guestCart", JSON.stringify(updatedItems));
    } else {
      // Update user cart via API
      const res = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    }
  };

  const removeItem = async (id: string) => {
    if (isGuest) {
      // Remove from guest cart
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      localStorage.setItem("guestCart", JSON.stringify(updatedItems));
    } else {
      // Remove from user cart via API
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const shippingFee = parseInt(process.env.NEXT_PUBLIC_SHIPPING_CHARGE || "50", 10);
  const freeThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "999", 10);
  const shipping = subtotal >= freeThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container py-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="d-flex gap-3 mb-3">
            <div className="skeleton rounded" style={{ width: 80, height: 100 }} />
            <div className="flex-grow-1">
              <div className="skeleton mb-2" style={{ height: 20, width: "60%" }} />
              <div className="skeleton" style={{ height: 16, width: "30%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-bag display-1 text-muted" />
        <h2 className="mt-3 mb-2">Your cart is empty</h2>
        <p className="text-muted">Add some products to your cart to get started!</p>
        <Link href="/products" className="btn btn-primary btn-lg mt-3 px-5">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light py-4 py-md-5">
      <style>{`
        .cart-item {
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 0;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
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
        .text-primary {
          color: #9f523a !important;
        }
        .btn-primary {
          background-color: #9f523a;
          border-color: #9f523a;
        }
        .btn-primary:hover {
          background-color: #7a3f2c;
          border-color: #7a3f2c;
        }
        .guest-notice {
          background-color: #cfe2ff;
          border-left: 4px solid #9f523a;
          color: #333;
        }
      `}</style>

      <div className="container">
        {isGuest && (
          <div className="alert guest-notice mb-4">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Shopping as Guest</strong> - You can continue shopping and proceed to checkout. Log in anytime to save your cart.
          </div>
        )}

        <h1 className="h3 fw-bold mb-4">Shopping Cart ({items.length} items)</h1>
        <div className="row g-4">
          {/* Cart items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="cart-item px-4 d-flex gap-3 align-items-start"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product.slug}`}>
                      <div
                        className="rounded overflow-hidden flex-shrink-0"
                        style={{ width: 88, height: 112, position: "relative" }}
                      >
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-fit-cover"
                          />
                        ) : (
                          <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                            <i className="bi bi-image text-muted" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        <h6 className="fw-semibold mb-1">{item.product.name}</h6>
                      </Link>
                      <p className="text-muted small mb-2">Size: {item.size}</p>

                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="fw-bold">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="fw-bold text-primary">
                          ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: "80px" }}>
              <div className="card-body">
                <h5 className="fw-bold mb-4">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className={shipping === 0 ? "text-success" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {subtotal < 999 && (
                  <div className="alert alert-info py-2 small mb-2">
                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping!
                  </div>
                )}

                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <Link href="/checkout" className="btn btn-primary w-100 btn-lg">
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="btn btn-outline-secondary w-100 mt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
