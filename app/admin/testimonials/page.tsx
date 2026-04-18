"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string | null;
  rating: number;
  review: string;
  isActive: boolean;
  sortOrder: number;
}

const empty = { name: "", location: "", review: "", rating: "5", sortOrder: "0", isActive: true };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    const r = await fetch("/api/admin/testimonials");
    const d = await r.json();
    if (d.success) setItems(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openNew = () => {
    setEditId(null); setForm(empty); setAvatarPreview(""); setError(""); setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({ name: t.name, location: t.location, review: t.review, rating: String(t.rating), sortOrder: String(t.sortOrder), isActive: t.isActive });
    setAvatarPreview(t.avatar || "");
    setError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (fileRef.current?.files?.[0]) fd.append("avatar", fileRef.current.files[0]);
    const url = editId ? `/api/admin/testimonials/${editId}` : "/api/admin/testimonials";
    const method = editId ? "PUT" : "POST";
    const r = await fetch(url, { method, body: fd });
    const d = await r.json();
    if (d.success) { await fetchAll(); setShowForm(false); setEditId(null); setForm(empty); setAvatarPreview(""); }
    else setError(d.error || "Failed to save");
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleActive = async (t: Testimonial) => {
    const fd = new FormData();
    fd.append("name", t.name); fd.append("location", t.location);
    fd.append("review", t.review); fd.append("rating", String(t.rating));
    fd.append("sortOrder", String(t.sortOrder)); fd.append("isActive", String(!t.isActive));
    await fetch(`/api/admin/testimonials/${t.id}`, { method: "PUT", body: fd });
    setItems((prev) => prev.map((x) => x.id === t.id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Testimonials</h4>
          <p className="text-muted small mb-0">Manage customer reviews shown on the Testimonials page</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="bi bi-plus me-1" />Add Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editId ? "Edit Testimonial" : "New Testimonial"}</h6>
            {error && <div className="alert alert-danger small py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Customer Name *</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Priya Sharma" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Location *</label>
                  <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="Mumbai, Maharashtra" />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Rating</label>
                  <select className="form-select" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Sort Order</label>
                  <input type="number" className="form-control" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} min={0} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Review *</label>
                  <textarea className="form-control" rows={3} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required placeholder="Customer's review..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Profile Photo</label>
                  <div className="d-flex align-items-center gap-3">
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="" width={48} height={48} className="rounded-circle object-fit-cover border" style={{ width: 48, height: 48 }} />
                    ) : (
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white flex-shrink-0" style={{ width: 48, height: 48 }}>
                        <i className="bi bi-person" />
                      </div>
                    )}
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                      <i className="bi bi-upload me-1" />Upload Photo
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={(e) => { const f = e.target.files?.[0]; if (f) setAvatarPreview(URL.createObjectURL(f)); }} />
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input type="checkbox" className="form-check-input" id="tActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    <label className="form-check-label small" htmlFor="tActive">Active (visible on site)</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : editId ? "Update" : "Add"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : items.length === 0 ? (
            <p className="text-center py-5 text-muted">No testimonials yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="small ps-4">Customer</th>
                    <th className="small">Location</th>
                    <th className="small">Rating</th>
                    <th className="small">Review</th>
                    <th className="small">Status</th>
                    <th className="small">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          {t.avatar ? (
                            <Image src={t.avatar} alt={t.name} width={36} height={36} className="rounded-circle object-fit-cover" style={{ width: 36, height: 36 }} />
                          ) : (
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: 36, height: 36, background: "linear-gradient(135deg,#e91e63,#9c27b0)", fontSize: 14 }}>
                              {t.name.charAt(0)}
                            </div>
                          )}
                          <span className="small fw-semibold">{t.name}</span>
                        </div>
                      </td>
                      <td className="small text-muted">{t.location}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {[1,2,3,4,5].map((s) => <i key={s} className={`bi ${s <= t.rating ? "bi-star-fill" : "bi-star"}`} style={{ color: "#f59e0b", fontSize: 12 }} />)}
                        </div>
                      </td>
                      <td className="small text-muted" style={{ maxWidth: 220 }}>
                        <span className="text-truncate d-block">{t.review}</span>
                      </td>
                      <td>
                        <span className={`badge small ${t.isActive ? "bg-success bg-opacity-25 text-success" : "bg-secondary bg-opacity-25 text-secondary"}`}>
                          {t.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary px-2 py-1" title={t.isActive ? "Hide" : "Show"} onClick={() => toggleActive(t)}>
                            <i className={`bi ${t.isActive ? "bi-eye-slash" : "bi-eye"} small`} />
                          </button>
                          <button className="btn btn-sm btn-outline-primary px-2 py-1" onClick={() => openEdit(t)}>
                            <i className="bi bi-pencil small" />
                          </button>
                          <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(t.id)}>
                            <i className="bi bi-trash small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
