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
      <div className="w-100 text-center" style={{ maxWidth: 460 }}>
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(159,82,58,0.1)", boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(159,82,58,0.08)", overflow: "hidden" }}>
          <div style={{ height: 3, background: "linear-gradient(90deg, #9f523a, #c87a5a, #9f523a)" }} />
          <div style={{ padding: "48px 40px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #9f523a, #7a3f2c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <i className="bi bi-envelope-check" style={{ color: "#fff", fontSize: "1.6rem" }} />
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111", marginBottom: 8, letterSpacing: "-0.02em" }}>Check your email!</h2>
            <p style={{ fontSize: "0.87rem", color: "#888", lineHeight: 1.7, marginBottom: 28 }}>
              We&apos;ve sent a verification link to <strong style={{ color: "#111" }}>{form.email}</strong>.<br />
              Please verify your email before logging in.
            </p>
            <Link href="/login" className="auth-submit-btn" style={{ display: "inline-flex", textDecoration: "none" }}>Go to Sign in</Link>
          </div>
        </div>
        <style>{authStyles}</style>
      </div>
    );
  }

  return (
    <div className="w-100" style={{ maxWidth: 550 }}>
      {/* Back to store */}
      <div className="text-center mb-3">
        <Link href="/" className="text-decoration-none d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem", color: "#9f523a", fontWeight: 600 }}>
          <i className="bi bi-arrow-left" style={{ fontSize: "0.7rem" }} /> Back to store
        </Link>
      </div>

      <div style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid rgba(159,82,58,0.1)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(159,82,58,0.08)",
        overflow: "hidden",
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #9f523a, #c87a5a, #9f523a)" }} />

        <div style={{ padding: "32px 40px 40px" }}>
          <div className="text-center mb-4">
            <Link href="/" className="text-decoration-none d-inline-block">
              <Image
                src="/assets/saaviya_logo_2026.png"
                alt="Saaviya Logo"
                width={130}
                height={50}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111", marginTop: 16, marginBottom: 4, letterSpacing: "-0.02em" }}>Create your account</h2>
            <p style={{ fontSize: "0.83rem", color: "#999", margin: 0 }}>Join Saaviya and explore ethnic fashion</p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", color: "#b91c1c", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="bi bi-exclamation-circle-fill" style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="auth-label">Full name</label>
              <input
                type="text"
                className={`auth-input ${fieldErrors.name ? "auth-input-error" : ""}`}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
              {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
            </div>

            <div className="mb-3">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                className={`auth-input ${fieldErrors.email ? "auth-input-error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
            </div>

            <div className="mb-3">
              <label className="auth-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`auth-input ${fieldErrors.password ? "auth-input-error" : ""}`}
                  style={{ paddingRight: 44 }}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="auth-eye-btn">
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
              </div>
              {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
            </div>

            <div className="mb-3">
              <label className="auth-label">Confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={`auth-input ${fieldErrors.confirm ? "auth-input-error" : ""}`}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              {fieldErrors.confirm && <p className="auth-field-error">{fieldErrors.confirm}</p>}
            </div>

            <p style={{ fontSize: "0.74rem", color: "#aaa", marginBottom: 16, lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <Link href="/terms-of-service" style={{ color: "#9f523a", fontWeight: 600, textDecoration: "none" }}>Terms</Link>
              {" "}and{" "}
              <Link href="/privacy-policy" style={{ color: "#9f523a", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>.
            </p>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ borderWidth: "2px" }} /> Creating account…</>
                : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#aaa", marginTop: 22, marginBottom: 0 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#9f523a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Footer links */}
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px", marginBottom: 10 }}>
          {[
            { label: "Contact Us", href: "/contact" },
            { label: "Shipping Policy", href: "/shipping-policy" },
            { label: "Refund Policy", href: "/refund-policy" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-decoration-none" style={{ fontSize: "0.74rem", color: "#aaa", transition: "color 0.15s" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <p style={{ fontSize: "0.71rem", color: "#ccc", margin: 0 }}>
          &copy; {new Date().getFullYear()} Saaviya. All rights reserved.
        </p>
      </div>

      <style>{authStyles}</style>
    </div>
  );
}

const authStyles = `
  .auth-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }
  .auth-input {
    display: block;
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e5e0da;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }
  .auth-input:focus {
    border-color: #9f523a;
    box-shadow: 0 0 0 3px rgba(159,82,58,0.12);
  }
  .auth-input-error { border-color: #ef4444 !important; }
  .auth-field-error {
    font-size: 0.74rem;
    color: #ef4444;
    margin: 5px 0 0;
  }
  .auth-eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #bbb;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    line-height: 1;
  }
  .auth-eye-btn:hover { color: #9f523a; }
  .auth-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.18s;
  }
  .auth-submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
`;
