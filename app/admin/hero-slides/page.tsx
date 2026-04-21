"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  subtitle: "",
  link: "",
  sortOrder: "0",
  isActive: true,
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    const res = await fetch("/api/admin/hero-slides");
    const data = await res.json();
    if (data.success) setSlides(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setImagePreview("");
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (s: HeroSlide) => {
    setEditId(s.id);
    setForm({
      title: s.title,
      subtitle: s.subtitle || "",
      link: s.link || "",
      sortOrder: String(s.sortOrder),
      isActive: s.isActive,
    });
    setImagePreview(s.image);
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
    fd.append("subtitle", form.subtitle);
    fd.append("link", form.link);
    fd.append("sortOrder", form.sortOrder);
    fd.append("isActive", String(form.isActive));
    if (imageRef.current?.files?.[0]) fd.append("image", imageRef.current.files[0]);

    const url = editId ? `/api/admin/hero-slides/${editId}` : "/api/admin/hero-slides";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, body: fd });
    const data = await res.json();

    if (data.success) {
      await fetchSlides();
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
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleActive = async (s: HeroSlide) => {
    const fd = new FormData();
    fd.append("title", s.title);
    fd.append("subtitle", s.subtitle || "");
    fd.append("link", s.link || "");
    fd.append("sortOrder", String(s.sortOrder));
    fd.append("isActive", String(!s.isActive));
    await fetch(`/api/admin/hero-slides/${s.id}`, { method: "PUT", body: fd });
    setSlides((prev) => prev.map((x) => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Hero Slides</h4>
          <p className="text-muted small mb-0">Manage the full-width hero carousel shown at the top of the home page</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="bi bi-plus me-1" />Add Slide
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editId ? "Edit Slide" : "New Slide"}</h6>
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
                    placeholder="New Season Collection"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Subtitle</label>
                  <input
                    className="form-control"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Shop the latest trends in women's fashion"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Link URL</label>
                  <input
                    className="form-control"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/products/all"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Sort Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    min={0}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="slideActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="slideActive">Active</label>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Slide Image {!editId && <span className="text-danger">*</span>}
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    {imagePreview && (
                      <div className="position-relative rounded overflow-hidden border" style={{ width: 240, height: 90 }}>
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
                      <p className="text-muted small mb-0 mt-1">Recommended: 1920×600px (wide landscape)</p>
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
                  {saving ? <span className="spinner-border spinner-border-sm" /> : editId ? "Update" : "Add Slide"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : slides.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-images fs-1 text-muted d-block mb-3" />
            <p className="text-muted mb-3">No slides yet</p>
            <button className="btn btn-primary" onClick={openNew}>Add First Slide</button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {slides.map((s) => (
            <div key={s.id} className={`card border-0 shadow-sm ${!s.isActive ? "opacity-50" : ""}`}>
              <div className="card-body p-0 d-flex align-items-stretch" style={{ minHeight: 100 }}>
                {/* Thumbnail */}
                <div className="position-relative flex-shrink-0" style={{ width: 200, minHeight: 100 }}>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-fit-cover rounded-start"
                  />
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-dark bg-opacity-70">#{s.sortOrder}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-grow-1 px-4 py-3 d-flex flex-column justify-content-center">
                  <p className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>{s.title}</p>
                  {s.subtitle && <p className="text-muted small mb-1">{s.subtitle}</p>}
                  {s.link && (
                    <p className="small mb-0">
                      <i className="bi bi-link-45deg me-1 text-muted" />
                      <span className="text-muted">{s.link}</span>
                    </p>
                  )}
                </div>
                {/* Actions */}
                <div className="d-flex flex-column align-items-center justify-content-center gap-2 pe-3">
                  <span className={`badge ${s.isActive ? "bg-success bg-opacity-25 text-success" : "bg-secondary bg-opacity-25 text-secondary"}`}>
                    {s.isActive ? "Active" : "Hidden"}
                  </span>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-secondary px-2 py-1" title={s.isActive ? "Hide" : "Show"} onClick={() => toggleActive(s)}>
                      <i className={`bi ${s.isActive ? "bi-eye-slash" : "bi-eye"} small`} />
                    </button>
                    <button className="btn btn-sm btn-outline-primary px-2 py-1" onClick={() => openEdit(s)}>
                      <i className="bi bi-pencil small" />
                    </button>
                    <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(s.id)}>
                      <i className="bi bi-trash small" />
                    </button>
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
