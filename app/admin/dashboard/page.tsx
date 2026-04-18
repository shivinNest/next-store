"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: string | number;
    createdAt: string;
    user: { name: string; email: string };
    items: { quantity: number; price: string | number }[];
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: "warning",
  VERIFIED: "info",
  PROCESSING: "primary",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "danger",
  REJECTED: "danger",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => d.success && setStats(d.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total Revenue", value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`, icon: "bi-currency-rupee", color: "success" },
        { label: "Total Orders", value: stats.totalOrders, icon: "bi-bag-check", color: "primary" },
        { label: "Pending Verification", value: stats.pendingOrders, icon: "bi-clock-history", color: "warning" },
        { label: "Total Products", value: stats.totalProducts, icon: "bi-box-seam", color: "info" },
        { label: "Registered Users", value: stats.totalUsers, icon: "bi-people", color: "secondary" },
      ]
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard</h4>
          <p className="text-muted small mb-0">Welcome back, Admin!</p>
        </div>
        <Link href="/admin/orders?status=PENDING_VERIFICATION" className="btn btn-primary btn-sm px-3">
          <i className="bi bi-clock me-1" />Review Payments
        </Link>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="row g-3 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="col-6 col-md-4 col-xl">
              <div className="skeleton" style={{ height: 100, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {cards.map((c) => (
            <div key={c.label} className="col-6 col-md-4 col-xl">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">{c.label}</p>
                      <h4 className="fw-bold mb-0">{c.value}</h4>
                    </div>
                    <div
                      className={`rounded-3 d-flex align-items-center justify-content-center bg-${c.color} bg-opacity-10`}
                      style={{ width: 44, height: 44 }}
                    >
                      <i className={`bi ${c.icon} text-${c.color} fs-5`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
          <h6 className="fw-bold mb-0">Recent Orders</h6>
          <Link href="/admin/orders" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center"><div className="spinner-border text-primary spinner-border-sm" /></div>
          ) : !stats?.recentOrders?.length ? (
            <p className="text-muted text-center py-4">No orders yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="small">Order #</th>
                    <th className="small">Customer</th>
                    <th className="small">Amount</th>
                    <th className="small">Status</th>
                    <th className="small">Date</th>
                    <th className="small">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="small fw-semibold">{o.orderNumber}</td>
                      <td className="small">{o.user.name}</td>
                      <td className="small fw-semibold">
                        ₹{Number(o.total).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge bg-${STATUS_COLORS[o.status] || "secondary"} bg-opacity-25 text-${STATUS_COLORS[o.status] || "secondary"} small`}>
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="small text-muted">{formatDate(o.createdAt)}</td>
                      <td>
                        <Link
                          href={`/admin/orders?id=${o.id}`}
                          className="btn btn-xs btn-outline-primary p-1 px-2 small"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="row g-3 mt-2">
        {[
          { label: "Add Product", href: "/admin/products/new", icon: "bi-plus-circle", color: "primary" },
          { label: "Add Category", href: "/admin/categories", icon: "bi-tag", color: "success" },
          { label: "Pending Orders", href: "/admin/orders?status=PENDING_VERIFICATION", icon: "bi-clock-history", color: "warning" },
          { label: "Write Blog", href: "/admin/blogs/new", icon: "bi-pencil", color: "info" },
        ].map((a) => (
          <div key={a.label} className="col-6 col-md-3">
            <Link href={a.href} className="text-decoration-none">
              <div className={`card border-0 shadow-sm text-center p-3 h-100 border-${a.color} border-opacity-25`}>
                <i className={`bi ${a.icon} fs-3 text-${a.color} mb-2 d-block`} />
                <p className={`small fw-semibold mb-0 text-${a.color}`}>{a.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
