"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  createdAt: string;
  paymentScreenshot?: string;
  adminNote?: string;
  user: { name: string; email: string };
  address: {
    name: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    id: string;
    name: string;
    image?: string;
    size: string;
    quantity: number;
    price: string | number;
  }[];
}

const ALL_STATUSES = [
  "PENDING_VERIFICATION",
  "VERIFIED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
];

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
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page) });
    if (filterStatus) sp.set("status", filterStatus);

    const res = await fetch(`/api/admin/orders?${sp}`);
    const data = await res.json();
    if (data.success) {
      setOrders(data.data);
      setTotalPages(data.pagination.pages);
    }
    setLoading(false);
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleViewOrder = async (order: Order) => {
    // Fetch full order with all details
    const res = await fetch(`/api/admin/orders/${order.id}`);
    const data = await res.json();
    if (data.success) {
      setSelectedOrder(data.data);
      setNewStatus(data.data.status);
      setAdminNote(data.data.adminNote || "");
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);

    const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, adminNote }),
    });
    const data = await res.json();

    if (data.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus, adminNote } : o
        )
      );
      setSelectedOrder({ ...selectedOrder, status: newStatus, adminNote });
    }
    setUpdating(false);
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Orders</h4>

      {/* Filter */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <button
          className={`btn btn-sm ${filterStatus === "" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => { setFilterStatus(""); setPage(1); }}
        >
          All
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => { setFilterStatus(s); setPage(1); }}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {/* Order list */}
        <div className={selectedOrder ? "col-lg-6" : "col-12"}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
              ) : orders.length === 0 ? (
                <p className="text-center py-5 text-muted">No orders found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="small ps-4">Order #</th>
                        <th className="small">Customer</th>
                        <th className="small">Amount</th>
                        <th className="small">Status</th>
                        <th className="small">Date</th>
                        <th className="small">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className={selectedOrder?.id === order.id ? "table-active" : ""}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleViewOrder(order)}
                        >
                          <td className="ps-4 small fw-semibold">{order.orderNumber}</td>
                          <td className="small">{order.user.name}</td>
                          <td className="small fw-bold">
                            ₹{Number(order.total).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <span className={`badge bg-${STATUS_COLORS[order.status] || "secondary"} bg-opacity-25 text-${STATUS_COLORS[order.status] || "secondary"} small`}>
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="small text-muted">{formatDate(order.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary px-2 py-1 small"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <div className="d-flex justify-content-center py-3">
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                          <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
                <h6 className="fw-bold mb-0">Order #{selectedOrder.orderNumber}</h6>
                <button
                  className="btn-close btn-sm"
                  onClick={() => setSelectedOrder(null)}
                />
              </div>
              <div className="card-body">
                {/* Customer & Address */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Customer</p>
                    <p className="mb-0 small fw-semibold">{selectedOrder.user.name}</p>
                    <p className="mb-0 small text-muted">{selectedOrder.user.email}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Ship to</p>
                    <p className="mb-0 small">{selectedOrder.address.line1}</p>
                    <p className="mb-0 small text-muted">
                      {selectedOrder.address.city}, {selectedOrder.address.state} – {selectedOrder.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-muted small mb-2 text-uppercase fw-semibold">Items</p>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-2 mb-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{ width: 40, height: 52, objectFit: "cover" }}
                        />
                      ) : (
                        <div className="rounded bg-light" style={{ width: 40, height: 52 }} />
                      )}
                      <div className="flex-grow-1">
                        <p className="mb-0 small fw-semibold">{item.name}</p>
                        <p className="mb-0 small text-muted">
                          {item.size} × {item.quantity} = ₹
                          {(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-top pt-2 mt-2 d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{Number(selectedOrder.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Payment screenshot */}
                {selectedOrder.paymentScreenshot && (
                  <div className="mb-4">
                    <p className="text-muted small mb-2 text-uppercase fw-semibold">Payment Screenshot</p>
                    <a
                      href={selectedOrder.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={selectedOrder.paymentScreenshot}
                        alt="Payment screenshot"
                        width={200}
                        height={150}
                        className="rounded border"
                        style={{ objectFit: "cover", maxWidth: "100%" }}
                      />
                    </a>
                  </div>
                )}

                {/* Update status */}
                <div className="border-top pt-3">
                  <p className="text-muted small mb-2 text-uppercase fw-semibold">Update Status</p>
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    {["VERIFIED", "PROCESSING", "SHIPPED", "DELIVERED", "REJECTED"].map((s) => (
                      <button
                        key={s}
                        className={`btn btn-sm ${newStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setNewStatus(s)}
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="form-control form-control-sm mb-2"
                    rows={2}
                    placeholder="Admin note (optional)"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={handleUpdateOrder}
                    disabled={updating}
                  >
                    {updating ? <span className="spinner-border spinner-border-sm" /> : "Update Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
