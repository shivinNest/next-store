"use client";
import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _count?: { orders: number };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page) });
    if (search) sp.set("search", search);

    const res = await fetch(`/api/admin/users?${sp}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Users ({total})</h4>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="input-group" style={{ maxWidth: 400 }}>
            <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name or email..."
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
          ) : users.length === 0 ? (
            <p className="text-center py-5 text-muted">No users found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="small ps-4">Name</th>
                    <th className="small">Email</th>
                    <th className="small">Role</th>
                    <th className="small">Verified</th>
                    <th className="small">Orders</th>
                    <th className="small">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 small fw-semibold">{u.name}</td>
                      <td className="small text-muted">{u.email}</td>
                      <td>
                        <span className={`badge small ${u.role === "ADMIN" ? "bg-danger" : "bg-light text-dark border"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.isVerified ? (
                          <i className="bi bi-check-circle-fill text-success" />
                        ) : (
                          <i className="bi bi-x-circle-fill text-muted" />
                        )}
                      </td>
                      <td className="small">{u._count?.orders || 0}</td>
                      <td className="small text-muted">{formatDate(u.createdAt)}</td>
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
  );
}
