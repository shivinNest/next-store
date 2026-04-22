"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Forgot password
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: 520 }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <Link href="/" className="text-decoration-none d-inline-block">
            <Image
              src="/assets/saaviya_logo_2026.png"
              alt="Saaviya Logo"
              width={130}
              height={50}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <h2 className="h5 fw-semibold mt-3">Welcome back</h2>
          <p className="text-muted small">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email address</label>
            <input
              type="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoFocus
            />
            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-semibold small mb-0">Password</label>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none"
                style={{ fontSize: "0.8rem", color: "#9f523a" }}
                onClick={() => { setForgotMode(true); setForgotEmail(form.email); setForgotError(""); setForgotSent(false); }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {fieldErrors.password && <div className="invalid-feedback d-block">{fieldErrors.password}</div>}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Forgot password inline panel */}
        {forgotMode && (
          <div style={{ marginTop: 20, background: "#faf9f7", border: "1px solid #ece9e4", borderRadius: 10, padding: "20px 22px" }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111", marginBottom: 4 }}>Reset your password</p>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 14 }}>Enter your email and we&apos;ll send you a reset link.</p>
            {forgotSent ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", color: "#15803d" }}>
                Check your inbox — a reset link has been sent.
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setForgotLoading(true); setForgotError("");
                try {
                  const res = await fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: forgotEmail }),
                  });
                  const data = await res.json();
                  if (data.success) setForgotSent(true);
                  else setForgotError(data.error || "Something went wrong");
                } catch { setForgotError("Network error"); }
                finally { setForgotLoading(false); }
              }}>
                {forgotError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, padding: "8px 12px", fontSize: "0.8rem", color: "#b91c1c", marginBottom: 10 }}>
                    {forgotError}
                  </div>
                )}
                <input
                  type="email"
                  className="form-control form-control-sm mb-3"
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" disabled={forgotLoading}
                    style={{ background: "#9f523a", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 7, fontSize: "0.85rem", fontWeight: 700, cursor: forgotLoading ? "not-allowed" : "pointer", opacity: forgotLoading ? 0.7 : 1 }}>
                    {forgotLoading ? "Sending\u2026" : "Send reset link"}
                  </button>
                  <button type="button" onClick={() => setForgotMode(false)}
                    style={{ background: "#fff", color: "#555", border: "1px solid #ddd", padding: "8px 16px", borderRadius: 7, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <p className="text-center text-muted small mt-4 mb-0">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="fw-semibold text-decoration-none" style={{ color: "#9f523a" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
