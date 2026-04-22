"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success && data.data?.role === "ADMIN") {
      router.push("/admin/dashboard");
      router.refresh();
    } else if (data.success && data.data?.role !== "ADMIN") {
      setError("Access denied. Admin account required.");
      // Logout the non-admin login
      await fetch("/api/auth/logout", { method: "POST" });
    } else {
      setError(data.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#1a1a2e" }}
    >
      <div className="w-100" style={{ maxWidth: 400 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold text-white fs-2">saaviya.in</h1>
          <p className="text-secondary">Admin Dashboard</p>
        </div>
        <div className="card border-0 rounded-4 p-4">
          <h5 className="fw-bold mb-4">Sign in to Admin</h5>

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link href="/" className="text-muted small text-decoration-none">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
