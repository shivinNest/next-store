"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  size: string;
  quantity: number;
  price: string | number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  createdAt: string;
  items: OrderItem[];
  address: {
    name: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PENDING_VERIFICATION: { label: "Pending Verification", bg: "#fff7ed", color: "#c2410c" },
  VERIFIED:             { label: "Verified",             bg: "#ecfdf5", color: "#065f46" },
  PROCESSING:           { label: "Processing",           bg: "#eff6ff", color: "#1d4ed8" },
  SHIPPED:              { label: "Shipped",              bg: "#f3e8ff", color: "#6d28d9" },
  DELIVERED:            { label: "Delivered",            bg: "#f0fdf4", color: "#15803d" },
  CANCELLED:            { label: "Cancelled",            bg: "#fef2f2", color: "#b91c1c" },
  REJECTED:             { label: "Rejected",             bg: "#fef2f2", color: "#b91c1c" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(d => d.success && setOrders(d.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 6 }}>
        Account
      </p>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111", letterSpacing: "-0.01em", marginBottom: 28 }}>
        My Orders
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="spinner-border" style={{ color: "#9f523a" }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px", background: "#fff", border: "1px solid #ece9e4", borderRadius: 12 }}>
          <p style={{ fontSize: "2.4rem", marginBottom: 12 }}>&#128230;</p>
          <p style={{ fontWeight: 600, color: "#555", marginBottom: 20, fontSize: "0.975rem" }}>No orders yet</p>
          <Link href="/products" style={{ background: "#9f523a", color: "#fff", padding: "11px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map(order => {
            const st = STATUS_CONFIG[order.status] || { label: order.status, bg: "#f3f4f6", color: "#374151" };
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} style={{ border: "1px solid #ece9e4", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                {/* Card header */}
                <div
                  style={{ padding: "18px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.925rem", color: "#111", marginBottom: 4 }}>
                      #{order.orderNumber}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#999", margin: 0 }}>
                      {formatDate(order.createdAt)} &nbsp;&middot;&nbsp; {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, fontSize: "0.975rem", color: "#9f523a", marginBottom: 6 }}>
                        &#8377;{Number(order.total).toLocaleString("en-IN")}
                      </p>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20,
                        fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.03em",
                        background: st.bg, color: st.color,
                      }}>
                        {st.label}
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #ece9e4", padding: "20px 24px", background: "#faf9f7" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9f523a", marginBottom: 14 }}>Items</p>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "center" }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: 50, height: 62, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 50, height: 62, borderRadius: 6, background: "#ece9e4", flexShrink: 0 }} />
                        )}
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: 3, color: "#111" }}>{item.name}</p>
                          <p style={{ fontSize: "0.78rem", color: "#999", marginBottom: 3 }}>Size: {item.size} &times; {item.quantity}</p>
                          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9f523a", margin: 0 }}>
                            &#8377;{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #ece9e4", paddingTop: 16, marginTop: 4 }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9f523a", marginBottom: 8 }}>Delivered to</p>
                      <p style={{ fontSize: "0.875rem", color: "#555", margin: 0 }}>
                        {order.address.name} &mdash; {order.address.city}, {order.address.state} &ndash; {order.address.pincode}
                      </p>
                    </div>
                    {order.status === "PENDING_VERIFICATION" && (
                      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 16px", fontSize: "0.8rem", color: "#c2410c", marginTop: 16 }}>
                        Your payment screenshot is under review. We&apos;ll update you shortly.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
