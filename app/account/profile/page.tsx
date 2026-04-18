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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUser(d.data);
          setForm({ name: d.data.name, phone: d.data.phone || "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    if (avatarRef.current?.files?.[0]) {
      formData.append("avatar", avatarRef.current.files[0]);
    }

    try {
      const res = await fetch("/api/account/profile", { method: "PUT", body: formData });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
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

  if (loading) {
    return (
      <div className="card border-0 shadow-sm p-4">
        <div className="skeleton mb-3" style={{ height: 80, width: 80, borderRadius: "50%" }} />
        <div className="skeleton mb-2" style={{ height: 20, width: "50%" }} />
        <div className="skeleton" style={{ height: 40 }} />
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">My Profile</h5>

        {success && (
          <div className="alert alert-success py-2 small mb-3">
            <i className="bi bi-check2 me-2" />Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2 small mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="d-flex align-items-center gap-4 mb-4">
            <div
              className="rounded-circle overflow-hidden flex-shrink-0"
              style={{ width: 80, height: 80, background: "#f8f9fa", position: "relative" }}
            >
              {avatarPreview || user?.avatar ? (
                <Image
                  src={avatarPreview || user!.avatar!}
                  alt="Avatar"
                  fill
                  className="object-fit-cover"
                />
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary rounded-circle">
                  <span className="text-white fw-bold fs-3">
                    {user?.name[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => avatarRef.current?.click()}
              >
                <i className="bi bi-camera me-2" />Change Photo
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setAvatarPreview(URL.createObjectURL(f));
                }}
              />
              <p className="text-muted small mt-1 mb-0">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Email</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ""}
                disabled
              />
              <p className="text-muted small mt-1">Email cannot be changed</p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4 px-4" disabled={saving}>
            {saving ? (
              <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
