"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  link: "",
  position: "home",
  sortOrder: "0",
  isActive: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    if (data.success) setBanners(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setImagePreview("");
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (b: Banner) => {
    setEditId(b.id);
    setForm({
      title: b.title,
      link: b.link || "",
      position: b.position,
      sortOrder: String(b.sortOrder),
      isActive: b.isActive,
    });
    setImagePreview(b.image);
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("link", form.link);
    fd.append("position", form.position);
    fd.append("sortOrder", form.sortOrder);
    fd.append("isActive", String(form.isActive));
    if (imageRef.current?.files?.[0]) fd.append("image", imageRef.current.files[0]);

    const url = editId ? `/api/admin/banners/${editId}` : "/api/admin/banners";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, body: fd });
    const data = await res.json();

    if (data.success) {
      await fetchBanners();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      setImagePreview("");
    } else {
      setError(data.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleActive = async (b: Banner) => {
    const fd = new FormData();
    fd.append("title", b.title);
    fd.append("link", b.link || "");
    fd.append("position", b.position);
    fd.append("sortOrder", String(b.sortOrder));
    fd.append("isActive", String(!b.isActive));
    await fetch(`/api/admin/banners/${b.id}`, { method: "PUT", body: fd });
    setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Banners</h4>
          <p className="text-muted small mb-0">Manage promotional banners shown on the home page</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="bi bi-plus me-1" />Add Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editId ? "Edit Banner" : "New Banner"}</h6>
            {error && <div className="alert alert-danger small py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Title *</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Summer Sale"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Link URL</label>
                  <input
                    className="form-control"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/products/dresses"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Position</label>
                  <select
                    className="form-select"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  >
                    <option value="home">Home Page</option>
                    <option value="home_bottom">Home Bottom</option>
                    <option value="category">Category Page</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Sort Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    min={0}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="bannerActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="bannerActive">Active</label>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Banner Image</label>
                  <div className="d-flex align-items-center gap-3">
                    {imagePreview && (
                      <div className="position-relative rounded overflow-hidden border" style={{ width: 160, height: 80 }}>
                        <Image src={imagePreview} alt="" fill className="object-fit-cover" />
                      </div>
                    )}
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => imageRef.current?.click()}
                      >
                        <i className="bi bi-upload me-1" />Upload Image
                      </button>
                      <p className="text-muted small mb-0 mt-1">Recommended: 1200×400px</p>
                    </div>
                  </div>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setImagePreview(URL.createObjectURL(f));
                    }}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : editId ? "Update" : "Add Banner"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners Grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : banners.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-image fs-1 text-muted d-block mb-3" />
            <p className="text-muted mb-3">No banners yet</p>
            <button className="btn btn-primary" onClick={openNew}>Add First Banner</button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {banners.map((b) => (
            <div key={b.id} className="col-md-6">
              <div className={`card border-0 shadow-sm h-100 ${!b.isActive ? "opacity-50" : ""}`}>
                <div className="position-relative" style={{ height: 160 }}>
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    className="object-fit-cover rounded-top"
                  />
                  <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                    <span className={`badge ${b.isActive ? "bg-success" : "bg-secondary"}`}>
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="badge bg-dark bg-opacity-75">{b.position}</span>
                  </div>
                </div>
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="min-w-0">
                      <p className="fw-semibold mb-1 text-truncate">{b.title}</p>
                      {b.link && (
                        <p className="text-muted small mb-0 text-truncate">
                          <i className="bi bi-link-45deg me-1" />{b.link}
                        </p>
                      )}
                    </div>
                    <div className="d-flex gap-1 ms-2">
                      <button
                        className="btn btn-sm btn-outline-secondary px-2"
                        title={b.isActive ? "Deactivate" : "Activate"}
                        onClick={() => toggleActive(b)}
                      >
                        <i className={`bi ${b.isActive ? "bi-eye-slash" : "bi-eye"} small`} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary px-2"
                        onClick={() => openEdit(b)}
                      >
                        <i className="bi bi-pencil small" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger px-2"
                        onClick={() => handleDelete(b.id)}
                      >
                        <i className="bi bi-trash small" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted small">Sort order: {b.sortOrder}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
