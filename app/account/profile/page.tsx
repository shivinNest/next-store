"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#aaa",
  marginBottom: 5,
};

const VALUE: React.CSSProperties = {
  fontSize: "0.975rem",
  color: "#111",
  fontWeight: 500,
};

const MUTED: React.CSSProperties = {
  fontSize: "0.975rem",
  color: "#bbb",
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Change password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwEditing, setPwEditing] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setUser(d.data);
          setForm({ name: d.data.name, phone: d.data.phone || "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setForm({ name: user?.name || "", phone: user?.phone || "" });
    setError("");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setAvatarPreview("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    if (avatarRef.current?.files?.[0]) fd.append("avatar", avatarRef.current.files[0]);
    try {
      const res = await fetch("/api/account/profile", { method: "PUT", body: fd });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setEditing(false);
        setAvatarPreview("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ background: "#fff", border: "1px solid #ece9e4", borderRadius: 12, padding: 36 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0ede8", marginBottom: 24 }} />
      <div style={{ height: 14, width: "40%", background: "#f0ede8", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 40, background: "#f0ede8", borderRadius: 8 }} />
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1px solid #ece9e4", borderRadius: 12 }}>
      {/* Card header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #ece9e4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 3 }}>Account</p>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#111", letterSpacing: "-0.01em", margin: 0 }}>My Profile</h2>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 20px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: "#444", cursor: "pointer" }}
          >
            Edit
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "28px 32px" }}>
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: "0.875rem", color: "#15803d", marginBottom: 20 }}>
            Profile updated successfully.
          </div>
        )}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", fontSize: "0.875rem", color: "#b91c1c", marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #ece9e4" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative", background: "#f0ede8" }}>
            {avatarPreview || user?.avatar ? (
              <Image src={avatarPreview || user!.avatar!} alt="Avatar" fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#9f523a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1.5rem" }}>
                {user?.name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.975rem", color: "#111", marginBottom: 2 }}>{user?.name}</p>
            <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: editing ? 10 : 0 }}>{user?.email}</p>
            {editing && (
              <>
                <button
                  type="button"
                  style={{ background: "#fff", border: "1px solid #ddd", padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", color: "#555" }}
                  onClick={() => avatarRef.current?.click()}
                >
                  Change Photo
                </button>
                <input
                  ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) setAvatarPreview(URL.createObjectURL(f)); }}
                />
                <p style={{ fontSize: "0.7rem", color: "#bbb", marginTop: 5, marginBottom: 0 }}>JPG or PNG, up to 5 MB</p>
              </>
            )}
          </div>
        </div>

        {/* Fields */}
        {editing ? (
          <form onSubmit={handleSave}>
            <div className="row g-4">
              <div className="col-md-6">
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                  style={{ borderRadius: 8 }}
                />
              </div>
              <div className="col-md-6">
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                  style={{ borderRadius: 8, background: "#fafafa", color: "#bbb" }}
                />
                <p style={{ fontSize: "0.7rem", color: "#ccc", marginTop: 5, marginBottom: 0 }}>Email cannot be changed</p>
              </div>
              <div className="col-md-6">
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  style={{ borderRadius: 8 }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ background: "#9f523a", color: "#fff", border: "none", padding: "10px 26px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving\u2026" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ background: "#fff", color: "#555", border: "1px solid #ddd", padding: "10px 22px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="row g-4">
            <div className="col-md-6">
              <p style={LABEL}>Full Name</p>
              <p style={VALUE}>{user?.name}</p>
            </div>
            <div className="col-md-6">
              <p style={LABEL}>Email</p>
              <p style={VALUE}>{user?.email}</p>
            </div>
            <div className="col-md-6">
              <p style={LABEL}>Phone Number</p>
              {user?.phone
                ? <p style={VALUE}>{user.phone}</p>
                : <p style={MUTED}>Not added</p>
              }
            </div>
            <div className="col-md-6">
              <p style={LABEL}>Account Type</p>
              <p style={VALUE}>{user?.role === "ADMIN" ? "Administrator" : "Customer"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div style={{ borderTop: "1px solid #ece9e4" }}>
        <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 3 }}>Security</p>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", margin: 0 }}>Change Password</h3>
          </div>
          {!pwEditing && (
            <button
              onClick={() => { setPwEditing(true); setPwError(""); setPwForm({ current: "", next: "", confirm: "" }); }}
              style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 20px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: "#444", cursor: "pointer" }}
            >
              Change
            </button>
          )}
        </div>

        {pwEditing && (
          <div style={{ padding: "0 32px 28px" }}>
            {pwSuccess && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: "0.875rem", color: "#15803d", marginBottom: 16 }}>
                Password changed successfully.
              </div>
            )}
            {pwError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", fontSize: "0.875rem", color: "#b91c1c", marginBottom: 16 }}>
                {pwError}
              </div>
            )}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setPwError("");
              if (pwForm.next !== pwForm.confirm) { setPwError("New passwords do not match"); return; }
              if (pwForm.next.length < 8) { setPwError("New password must be at least 8 characters"); return; }
              setPwSaving(true);
              try {
                const res = await fetch("/api/account/change-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
                });
                const data = await res.json();
                if (data.success) {
                  setPwEditing(false);
                  setPwForm({ current: "", next: "", confirm: "" });
                  setPwSuccess(true);
                  setTimeout(() => setPwSuccess(false), 3000);
                } else {
                  setPwError(data.error || "Failed to change password");
                }
              } catch { setPwError("Network error"); }
              finally { setPwSaving(false); }
            }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Current Password *</label>
                  <input type="password" className="form-control" value={pwForm.current} autoFocus
                    onChange={e => setPwForm({ ...pwForm, current: e.target.value })} required style={{ borderRadius: 8 }} />
                </div>
                <div className="col-md-6" />
                <div className="col-md-6">
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>New Password *</label>
                  <input type="password" className="form-control" value={pwForm.next} placeholder="Min. 8 characters"
                    onChange={e => setPwForm({ ...pwForm, next: e.target.value })} required style={{ borderRadius: 8 }} />
                </div>
                <div className="col-md-6">
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Confirm New Password *</label>
                  <input type="password" className="form-control" value={pwForm.confirm} placeholder="Repeat new password"
                    onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required style={{ borderRadius: 8 }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={pwSaving}
                  style={{ background: "#9f523a", color: "#fff", border: "none", padding: "10px 26px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: pwSaving ? "not-allowed" : "pointer", opacity: pwSaving ? 0.7 : 1 }}>
                  {pwSaving ? "Saving\u2026" : "Update Password"}
                </button>
                <button type="button" onClick={() => { setPwEditing(false); setPwError(""); }}
                  style={{ background: "#fff", color: "#555", border: "1px solid #ddd", padding: "10px 22px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
