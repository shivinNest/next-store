"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// CSS imported at top level so it's included in the bundle (SSR-safe)
// react-quill-new module loaded client-side only to avoid SSR window errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="form-control" style={{ minHeight: 200, background: "#f8f9fa", borderRadius: 6 }} />,
}) as React.ComponentType<{
  theme?: string;
  value?: string;
  onChange?: (value: string) => void;
  modules?: Record<string, unknown>;
  formats?: string[];
  style?: React.CSSProperties;
  placeholder?: string;
}>;

interface Category {
  id: string;
  name: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface SizeStock {
  size: string;
  stock: number;
  enabled: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
}

export default function ProductFormPage({ mode }: ProductFormProps) {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string | undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    isFeatured: false,
    isTrending: false,
    isOffer: false,
    isActive: true,
    tags: "",
  });

  const [sizes, setSizes] = useState<SizeStock[]>(
    SIZES.map((s) => ({ size: s, stock: 0, enabled: false }))
  );

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const imagesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => d.success && setCategories(d.data));

    if (mode === "edit" && productId) {
      fetch(`/api/admin/products/${productId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            const p = d.data;
            setForm({
              name: p.name,
              shortDescription: p.shortDescription || "",
              description: p.description || "",
              price: String(p.price),
              comparePrice: p.comparePrice ? String(p.comparePrice) : "",
              categoryId: p.categoryId,
              isFeatured: p.isFeatured,
              isTrending: p.isTrending,
              isOffer: p.isOffer,
              isActive: p.isActive,
              tags: p.tags.join(", "),
            });
            setExistingImages(p.images || []);
            setSizes(
              SIZES.map((s) => {
                const found = p.sizes.find((ps: { size: string; stock: number }) => ps.size === s);
                return { size: s, stock: found?.stock || 0, enabled: !!found };
              })
            );
          }
        })
        .finally(() => setLoading(false));
    }
  }, [mode, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));

    const enabledSizes = sizes
      .filter((s) => s.enabled)
      .map(({ size, stock }) => ({ size, stock }));
    formData.append("sizes", JSON.stringify(enabledSizes));

    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    newImageFiles.forEach((f) => formData.append("images", f));

    const url =
      mode === "edit"
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        setError(data.error || JSON.stringify(data.errors) || "Failed to save");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link href="/admin/products" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1" />Back
        </Link>
        <h4 className="fw-bold mb-0">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h4>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left */}
          <div className="col-lg-8">
            {/* Basic Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Basic Information</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Product Name *</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Short Description
                      <span className="text-muted fw-normal ms-2" style={{ fontSize: "0.78rem" }}>
                        Used for SEO meta description (max 160 characters)
                      </span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      maxLength={160}
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      placeholder="Brief product summary shown in search results..."
                    />
                    <div className="text-end mt-1">
                      <span className={`small ${form.shortDescription.length > 140 ? "text-warning" : "text-muted"}`}>
                        {form.shortDescription.length}/160
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Full Description
                      <span className="text-muted fw-normal ms-2" style={{ fontSize: "0.78rem" }}>
                        Supports rich text formatting
                      </span>
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={form.description}
                      onChange={(val) => setForm({ ...form, description: val })}
                      modules={{
                        toolbar: [
                          [{ header: [2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["blockquote", "clean"],
                        ],
                      }}
                      formats={["header", "bold", "italic", "underline", "strike", "list", "blockquote"]}
                      style={{ background: "white" }}
                      placeholder="Detailed product description with formatting..."
                    />
                    <style>{`
                      .ql-container { font-size: 0.9rem; min-height: 160px; }
                      .ql-editor { min-height: 160px; }
                      .ql-toolbar { border-top-left-radius: 6px; border-top-right-radius: 6px; }
                      .ql-container { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
                    `}</style>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      Compare Price (₹) <span className="text-muted">(optional, for strike-through)</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.comparePrice}
                      onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Tags <span className="text-muted">(comma-separated)</span></label>
                    <input
                      className="form-control"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="casual, summer, cotton"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Sizes & Stock</h6>
                <div className="row g-2">
                  {sizes.map((s, idx) => (
                    <div key={s.size} className="col-4 col-md-2">
                      <div
                        className={`p-3 rounded-3 text-center border ${
                          s.enabled ? "border-primary bg-primary bg-opacity-10" : "border-light bg-light"
                        }`}
                      >
                        <div className="form-check d-flex justify-content-center mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={s.enabled}
                            onChange={() =>
                              setSizes((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, enabled: !x.enabled } : x
                                )
                              )
                            }
                          />
                        </div>
                        <div className="fw-bold mb-1 small">{s.size}</div>
                        {s.enabled && (
                          <input
                            type="number"
                            className="form-control form-control-sm text-center p-1"
                            min="0"
                            value={s.stock}
                            onChange={(e) =>
                              setSizes((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, stock: parseInt(e.target.value) || 0 }
                                    : x
                                )
                              )
                            }
                            placeholder="Stock"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Product Images</h6>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {existingImages.map((img) => (
                      <div key={img} className="position-relative">
                        <Image
                          src={img}
                          alt=""
                          width={80}
                          height={100}
                          className="rounded border object-fit-cover"
                          style={{ height: 100, objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 rounded-circle"
                          style={{ width: 22, height: 22 }}
                          onClick={() =>
                            setExistingImages((prev) => prev.filter((i) => i !== img))
                          }
                        >
                          <i className="bi bi-x small" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New images */}
                {newImagePreviews.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {newImagePreviews.map((src, i) => (
                      <div key={i} className="position-relative">
                        <Image
                          src={src}
                          alt=""
                          width={80}
                          height={100}
                          className="rounded border object-fit-cover"
                          style={{ height: 100, objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 rounded-circle"
                          style={{ width: 22, height: 22 }}
                          onClick={() => {
                            setNewImageFiles((prev) => prev.filter((_, j) => j !== i));
                            setNewImagePreviews((prev) => prev.filter((_, j) => j !== i));
                          }}
                        >
                          <i className="bi bi-x small" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => imagesRef.current?.click()}
                >
                  <i className="bi bi-cloud-upload me-2" />Upload Images
                </button>
                <input
                  ref={imagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  onChange={handleImageChange}
                />
                <p className="text-muted small mt-2">Upload multiple images. First image is the main image.</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-lg-4">
            {/* Category */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Category *</h6>
                <select
                  className="form-select"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product flags */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Product Flags</h6>
                {[
                  { key: "isActive", label: "Active (visible in store)" },
                  { key: "isFeatured", label: "Featured ⭐" },
                  { key: "isTrending", label: "Trending 🔥" },
                  { key: "isOffer", label: "On Sale 🏷️" },
                ].map((f) => (
                  <div key={f.key} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={f.key}
                      checked={form[f.key as keyof typeof form] as boolean}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.checked })
                      }
                    />
                    <label className="form-check-label small" htmlFor={f.key}>
                      {f.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg"
              disabled={saving}
            >
              {saving ? (
                <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
              ) : mode === "edit" ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
            <Link href="/admin/products" className="btn btn-outline-secondary w-100 mt-2">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
