"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  author: string;
  publishedAt?: string;
  createdAt: string;
}

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "Admin",
  isPublished: false,
  tags: "",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
    if (imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    const url = editId ? `/api/admin/blogs/${editId}` : "/api/admin/blogs";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (data.success) {
      await fetchBlogs();
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
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Stories</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setImagePreview("");
            setShowForm(true);
          }}
        >
          <i className="bi bi-plus me-1" />Write Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editId ? "Edit Story" : "New Story"}</h6>
            {error && <div className="alert alert-danger small py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold">Title *</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Author</label>
                  <input
                    className="form-control"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Excerpt</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short summary..."
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Content * (HTML supported)</label>
                  <textarea
                    className="form-control"
                    rows={8}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    placeholder="Blog content..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Tags (comma-separated)</label>
                  <input
                    className="form-control"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="fashion, style, tips"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Cover Image</label>
                  <div className="d-flex align-items-center gap-2">
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt=""
                        width={52}
                        height={36}
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
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="blogPublished"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="blogPublished">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : editId ? "Update" : "Publish"}
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

      {/* Blog list */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : blogs.length === 0 ? (
            <p className="text-center py-5 text-muted">No blog posts yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="small ps-4">Title</th>
                    <th className="small">Author</th>
                    <th className="small">Status</th>
                    <th className="small">Date</th>
                    <th className="small">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => (
                    <tr key={b.id}>
                      <td className="ps-4 small fw-semibold">{b.title}</td>
                      <td className="small text-muted">{b.author}</td>
                      <td>
                        <span className={`badge small ${b.isPublished ? "bg-success bg-opacity-25 text-success" : "bg-secondary bg-opacity-25 text-secondary"}`}>
                          {b.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="small text-muted">{formatDate(b.createdAt)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary px-2 py-1"
                            onClick={() => {
                              // For edit, fetch full blog
                              fetch(`/api/admin/blogs`)
                                .then((r) => r.json())
                                .then((d) => {
                                  const full = d.data?.find((x: { id: string }) => x.id === b.id);
                                  if (full) {
                                    setEditId(b.id);
                                    setForm({
                                      title: full.title,
                                      excerpt: full.excerpt || "",
                                      content: full.content,
                                      author: full.author,
                                      isPublished: full.isPublished,
                                      tags: full.tags.join(", "),
                                    });
                                    setImagePreview(full.image || "");
                                    setShowForm(true);
                                  }
                                });
                            }}
                          >
                            <i className="bi bi-pencil small" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger px-2 py-1"
                            onClick={() => handleDelete(b.id)}
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
