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

        <div style={{ padding: "36px 40px 40px" }}>
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
            {forgotMode ? (
              <>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111", marginTop: 16, marginBottom: 4, letterSpacing: "-0.02em" }}>Reset password</h2>
                <p style={{ fontSize: "0.83rem", color: "#999", margin: 0 }}>We&apos;ll send a reset link to your email</p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111", marginTop: 16, marginBottom: 4, letterSpacing: "-0.02em" }}>Welcome back</h2>
                <p style={{ fontSize: "0.83rem", color: "#999", margin: 0 }}>Sign in to your account</p>
              </>
            )}
          </div>

          {/* LOGIN FORM */}
          {!forgotMode && (
            <>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", color: "#b91c1c", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="bi bi-exclamation-circle-fill" style={{ flexShrink: 0 }} />{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="auth-label">Email address</label>
                  <input
                    type="email"
                    className={`auth-input ${fieldErrors.email ? "auth-input-error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoFocus
                  />
                  {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="auth-label mb-0">Password</label>
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => { setForgotMode(true); setForgotEmail(form.email); setForgotError(""); setForgotSent(false); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`auth-input ${fieldErrors.password ? "auth-input-error" : ""}`}
                      style={{ paddingRight: 44 }}
                      placeholder="Your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="auth-eye-btn">
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                  </div>
                  {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm" style={{ borderWidth: "2px" }} /> Signing in…</>
                    : "Sign in"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#aaa", marginTop: 24, marginBottom: 0 }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-decoration-none" style={{ color: "#9f523a", fontWeight: 700 }}>Sign up free</Link>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {forgotMode && (
            <>
              {forgotSent ? (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 16px", fontSize: "0.85rem", color: "#15803d", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="bi bi-check-circle-fill" style={{ flexShrink: 0 }} /> Check your inbox — a reset link has been sent.
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
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", color: "#b91c1c", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="bi bi-exclamation-circle-fill" style={{ flexShrink: 0 }} />{forgotError}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="auth-label">Email address</label>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="auth-submit-btn">
                    {forgotLoading ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              )}

              <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#aaa", marginTop: 24, marginBottom: 0 }}>
                <button
                  type="button"
                  className="auth-link-btn"
                  style={{ fontSize: "0.82rem" }}
                  onClick={() => setForgotMode(false)}
                >
                  <i className="bi bi-arrow-left" style={{ fontSize: "0.75rem" }} /> Back to login
                </button>
              </p>
            </>
          )}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
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
  .auth-link-btn {
    background: none;
    border: none;
    color: #9f523a;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
  }
  .auth-link-btn:hover { text-decoration: underline; }
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
