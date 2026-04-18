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

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING_VERIFICATION: { label: "Pending Verification", cls: "status-PENDING_VERIFICATION" },
  VERIFIED: { label: "Verified", cls: "status-VERIFIED" },
  PROCESSING: { label: "Processing", cls: "status-PROCESSING" },
  SHIPPED: { label: "Shipped", cls: "status-SHIPPED" },
  DELIVERED: { label: "Delivered", cls: "status-DELIVERED" },
  CANCELLED: { label: "Cancelled", cls: "status-CANCELLED" },
  REJECTED: { label: "Rejected", cls: "status-REJECTED" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => d.success && setOrders(d.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h5 className="fw-bold mb-4">My Orders</h5>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box fs-1 text-muted" />
          <h6 className="mt-3 text-muted">No orders yet</h6>
          <Link href="/products/all" className="btn btn-primary mt-3">Shop Now</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => {
            const st = STATUS_LABELS[order.status] || { label: order.status, cls: "" };
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="card border-0 shadow-sm">
                <div
                  className="card-body"
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                      <p className="fw-bold mb-1">#{order.orderNumber}</p>
                      <p className="text-muted small mb-0">
                        {formatDate(order.createdAt)} • {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold text-primary mb-1">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </p>
                      <span className={`badge ${st.cls} px-2 py-1`}>{st.label}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 border-top pt-3">
                      {/* Items */}
                      <h6 className="fw-semibold mb-3 small text-muted text-uppercase">Items</h6>
                      {order.items.map((item) => (
                        <div key={item.id} className="d-flex gap-3 mb-3 align-items-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded"
                              style={{ width: 52, height: 64, objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="rounded bg-light d-flex align-items-center justify-content-center"
                              style={{ width: 52, height: 64 }}
                            >
                              <i className="bi bi-image text-muted" />
                            </div>
                          )}
                          <div>
                            <p className="fw-semibold mb-0 small">{item.name}</p>
                            <p className="text-muted small mb-0">
                              Size: {item.size} × {item.quantity}
                            </p>
                            <p className="text-primary small fw-bold mb-0">
                              ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Address */}
                      <div className="border-top pt-3 mt-2">
                        <h6 className="fw-semibold mb-1 small text-muted text-uppercase">Delivered to</h6>
                        <p className="small mb-0">
                          {order.address.name} • {order.address.city}, {order.address.state} – {order.address.pincode}
                        </p>
                      </div>

                      {/* Payment screenshot status */}
                      {order.status === "PENDING_VERIFICATION" && (
                        <div className="alert alert-warning small mt-3 py-2 mb-0">
                          <i className="bi bi-clock me-2" />
                          Your payment screenshot is under review. We'll update you soon.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
