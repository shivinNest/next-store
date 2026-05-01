"use client";
import { useEffect, useState } from "react";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "AMOUNT";
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  maxUsesPerUser: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const emptyForm = {
  code: "",
  description: "",
  discountType: "PERCENTAGE" as "PERCENTAGE" | "AMOUNT",
  discountValue: "",
  minOrderAmount: "",
  maxUses: "",
  maxUsesPerUser: "1",
  isActive: true,
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    const r = await fetch("/api/admin/coupons");
    const d = await r.json();
    if (d.success) setCoupons(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({
      code: c.code,
      description: c.description || "",
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: c.minOrderAmount ? String(c.minOrderAmount) : "",
      maxUses: c.maxUses ? String(c.maxUses) : "",
      maxUsesPerUser: String(c.maxUsesPerUser),
      isActive: c.isActive,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 16) : "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      code: form.code,
      description: form.description || null,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      maxUsesPerUser: parseInt(form.maxUsesPerUser) || 1,
      isActive: form.isActive,
      expiresAt: form.expiresAt || null,
    };
    const url = editId ? `/api/admin/coupons/${editId}` : "/api/admin/coupons";
    const method = editId ? "PUT" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.success) {
      await fetchAll();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    } else {
      setError(d.error || "Failed to save coupon");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleActive = async (c: Coupon) => {
    const r = await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, isActive: !c.isActive }),
    });
    const d = await r.json();
    if (d.success) setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x)));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Coupons</h4>
          <p className="text-muted small mb-0">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="bi bi-plus-lg me-2" />New Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-ticket-perforated" style={{ fontSize: "3rem", display: "block", marginBottom: 12 }} />
          No coupons yet. Create one to get started.
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Uses</th>
                  <th>Per User</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.95rem", color: "#9f523a" }}>{c.code}</span>
                      {c.description && <p className="text-muted small mb-0">{c.description}</p>}
                    </td>
                    <td>
                      {c.discountType === "PERCENTAGE"
                        ? <span className="badge" style={{ background: "rgba(159,82,58,0.12)", color: "#9f523a" }}>{c.discountValue}%</span>
                        : <span className="badge" style={{ background: "rgba(32,201,151,0.12)", color: "#15803d" }}>₹{Number(c.discountValue).toLocaleString("en-IN")}</span>}
                    </td>
                    <td>{c.minOrderAmount ? `₹${Number(c.minOrderAmount).toLocaleString("en-IN")}` : <span className="text-muted">—</span>}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.usedCount}</span>
                      {c.maxUses && <span className="text-muted"> / {c.maxUses}</span>}
                    </td>
                    <td>{c.maxUsesPerUser}</td>
                    <td>
                      {c.expiresAt
                        ? <span style={{ fontSize: "0.82rem" }}>{new Date(c.expiresAt).toLocaleDateString("en-IN")}</span>
                        : <span className="text-muted">Never</span>}
                    </td>
                    <td>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={c.isActive}
                          onChange={() => toggleActive(c)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(c)}>
                          <i className="bi bi-pencil" />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-in Form Panel */}
      {showForm && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1040 }}
            onClick={() => setShowForm(false)}
          />
          <div style={{
            position: "fixed", top: 0, right: 0, height: "100%",
            width: "min(480px,100vw)", background: "#fff", zIndex: 1050,
            display: "flex", flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both",
          }}>
            <div style={{ padding: "24px 24px 0", borderBottom: "1px solid #f0ebe6", paddingBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 className="fw-bold mb-0">{editId ? "Edit Coupon" : "New Coupon"}</h5>
              <button
                style={{ background: "none", border: "1.5px solid #e8e0da", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setShowForm(false)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {error && (
                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-exclamation-circle me-2" />{error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small">Coupon Code *</label>
                <input
                  className="form-control"
                  style={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  disabled={!!editId}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Description</label>
                <input
                  className="form-control"
                  placeholder="e.g. Welcome offer"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Discount Type *</label>
                <select
                  className="form-select"
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as "PERCENTAGE" | "AMOUNT" })}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="AMOUNT">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Discount Value * {form.discountType === "PERCENTAGE" ? "(0–100%)" : "(₹)"}
                </label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                  step="0.01"
                  placeholder={form.discountType === "PERCENTAGE" ? "20" : "100"}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Minimum Order Amount (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  placeholder="Leave blank for no minimum"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                />
              </div>

              <div className="row mb-3 g-3">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Total Max Uses</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold small">Max Uses Per User</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={form.maxUsesPerUser}
                    onChange={(e) => setForm({ ...form, maxUsesPerUser: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Expiry Date &amp; Time</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="couponActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="couponActive">
                    Active
                  </label>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : editId ? "Update Coupon" : "Create Coupon"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
