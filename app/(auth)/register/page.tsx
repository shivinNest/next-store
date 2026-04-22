"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) {
      errs.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (!form.confirm) {
      errs.confirm = "Please confirm your password.";
    } else if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match.";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-100 text-center" style={{ maxWidth: 420 }}>
        <div className="card border-0 shadow-sm rounded-4 p-5">
          <div
            className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 72, height: 72, background: "#d4edda" }}
          >
            <i className="bi bi-envelope-check text-success fs-2" />
          </div>
          <h2 className="h4 fw-bold mb-2">Check your email!</h2>
          <p className="text-muted mb-4">
            We&apos;ve sent a verification link to <strong>{form.email}</strong>.
            Please verify your email before logging in.
          </p>
          <Link href="/login" className="btn btn-primary w-100">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="h5 fw-semibold mt-3">Create account</h2>
          <p className="text-muted small">Join saaviya.in today</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Full Name</label>
            <input
              type="text"
              className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
            {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Email address</label>
            <input
              type="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${fieldErrors.confirm ? "is-invalid" : ""}`}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
            {fieldErrors.confirm && <div className="invalid-feedback">{fieldErrors.confirm}</div>}
          </div>

          <p className="text-muted small mb-3">
            By creating an account, you agree to our{" "}
            <Link href="/terms-of-service" className="text-decoration-none fw-semibold" style={{ color: "#9f523a" }}>Terms of Service</Link> and{"\ "}
            <Link href="/privacy-policy" className="text-decoration-none fw-semibold" style={{ color: "#9f523a" }}>Privacy Policy</Link>.
          </p>

          <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account?{" "}
          <Link href="/login" className="fw-semibold text-decoration-none" style={{ color: "#9f523a" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
