"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

const emptyForm = {
  name: "",
  description: "",
  sortOrder: "0",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
    if (imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (data.success) {
      await fetchCategories();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      setImagePreview("");
    } else {
      setError(data.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleEdit = (c: Category) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      description: c.description || "",
      sortOrder: String(c.sortOrder),
      isActive: c.isActive,
    });
    setImagePreview(c.image || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Categories</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setImagePreview("");
            setShowForm(true);
          }}
        >
          <i className="bi bi-plus me-1" />Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editId ? "Edit Category" : "Add Category"}</h6>
            {error && <div className="alert alert-danger small py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Name *</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Sort Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Image</label>
                  <div className="d-flex align-items-center gap-2">
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded border object-fit-cover"
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => imageRef.current?.click()}
                    >
                      Upload
                    </button>
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
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="catActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="catActive">Active</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : editId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : categories.length === 0 ? (
            <p className="text-center py-5 text-muted">No categories yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="small ps-4">Category</th>
                    <th className="small">Slug</th>
                    <th className="small">Products</th>
                    <th className="small">Order</th>
                    <th className="small">Status</th>
                    <th className="small">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          {c.image && (
                            <Image
                              src={c.image}
                              alt={c.name}
                              width={36}
                              height={36}
                              className="rounded object-fit-cover"
                            />
                          )}
                          <span className="fw-semibold small">{c.name}</span>
                        </div>
                      </td>
                      <td className="small text-muted">{c.slug}</td>
                      <td className="small">{c._count?.products || 0}</td>
                      <td className="small">{c.sortOrder}</td>
                      <td>
                        <span className={`badge ${c.isActive ? "bg-success" : "bg-secondary"} bg-opacity-25 text-${c.isActive ? "success" : "secondary"} small`}>
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary px-2 py-1"
                            onClick={() => handleEdit(c)}
                          >
                            <i className="bi bi-pencil small" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger px-2 py-1"
                            onClick={() => handleDelete(c.id, c.name)}
                          >
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
