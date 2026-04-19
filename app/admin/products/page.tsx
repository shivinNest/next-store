"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string | number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isOffer: boolean;
  category?: { name: string };
  _count?: { orderItems: number };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) sp.set("search", search);

    const res = await fetch(`/api/admin/products?${sp}`);
    const data = await res.json();
    if (data.success) {
      setProducts(data.data);
      setTotalPages(data.pagination.pages);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = async (id: string, field: string, value: boolean) => {
    const body = new FormData();
    body.append(field, String(!value));
    const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", body });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: !value } : p))
      );
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Products</h4>
        <Link href="/admin/products/new" className="btn btn-primary">
          <i className="bi bi-plus me-1" />Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="input-group" style={{ maxWidth: 400 }}>
            <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-bag-x fs-1 text-muted" />
              <p className="text-muted mt-2">No products found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="small ps-4">Product</th>
                    <th className="small">Category</th>
                    <th className="small">Price</th>
                    <th className="small">Status</th>
                    <th className="small">Flags</th>
                    <th className="small">Sales</th>
                    <th className="small">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded overflow-hidden flex-shrink-0"
                            style={{ width: 44, height: 56, position: "relative" }}
                          >
                            {p.images[0] ? (
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-fit-cover"
                              />
                            ) : (
                              <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                <i className="bi bi-image text-muted small" />
                              </div>
                            )}
                          </div>
                          <span className="small fw-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td className="small text-muted">{p.category?.name || "–"}</td>
                      <td className="small fw-bold">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${p.isActive ? "bg-success" : "bg-secondary"} bg-opacity-25 text-${p.isActive ? "success" : "secondary"} small`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {p.isFeatured && <span className="badge bg-warning text-dark small">⭐</span>}
                          {p.isTrending && <span className="badge bg-info text-dark small">🔥</span>}
                          {p.isOffer && <span className="badge bg-danger small">Sale</span>}
                        </div>
                      </td>
                      <td className="small text-muted">{p._count?.orderItems || 0}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="btn btn-sm btn-outline-primary px-2 py-1"
                            title="Edit"
                          >
                            <i className="bi bi-pencil small" />
                          </Link>
                          <button
                            className={`btn btn-sm px-2 py-1 ${p.isActive ? "btn-outline-warning" : "btn-outline-success"}`}
                            onClick={() => handleToggle(p.id, "isActive", p.isActive)}
                            title={p.isActive ? "Deactivate" : "Activate"}
                          >
                            <i className={`bi ${p.isActive ? "bi-eye-slash small" : "bi-eye small"}`} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger px-2 py-1"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete"
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

          {/* Pagination */}
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
  );
}
