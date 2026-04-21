"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center">
          <p style={{ fontSize: "2rem", marginBottom: 12 }}>&#128274;</p>
          <h2 className="h5 fw-semibold mb-2">Invalid Link</h2>
          <p className="text-muted small mb-4">This reset link is missing or invalid.</p>
          <Link href="/login" className="btn btn-primary">Back to Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: 420 }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <Link href="/" className="text-decoration-none d-inline-block">
            <Image
              src="/assets/saaviya_logo_2026.png"
              alt="Saaviya"
              width={130}
              height={50}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <h2 className="h5 fw-semibold mt-3">Set new password</h2>
          <p className="text-muted small">Choose a strong password for your account.</p>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 16px", fontSize: "0.875rem", color: "#15803d", marginBottom: 16 }}>
              Password updated! Redirecting you to sign in&hellip;
            </div>
            <Link href="/login" className="btn btn-primary mt-2">Sign In Now</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                <i className="bi bi-exclamation-circle me-2" />{error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold small">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(v => !v)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Repeat new password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 btn-lg"
              disabled={loading}
              style={{ background: "#9f523a", borderColor: "#9f523a" }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Updating&hellip;</>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-muted small mt-4 mb-0">
          Remember your password?{" "}
          <Link href="/login" className="fw-semibold text-decoration-none" style={{ color: "#9f523a" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
