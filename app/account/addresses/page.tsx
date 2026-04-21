"use client";
import { useEffect, useState } from "react";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const emptyForm = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    const data = await res.json();
    if (data.success) setAddresses(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});

    const url = editId ? `/api/addresses/${editId}` : "/api/addresses";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      await fetchAddresses();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    } else if (data.errors) {
      setFieldErrors(data.errors);
    }
    setSaving(false);
  };

  const handleEdit = (a: Address) => {
    setEditId(a.id);
    setForm({
      name: a.name,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2 || "",
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      isDefault: a.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
    "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 4 }}>Account</p>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111", letterSpacing: "-0.01em", margin: 0 }}>My Addresses</h2>
        </div>
        <button
          style={{ background: "#9f523a", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" }}
          onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(true); }}
        >
          + Add Address
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
          <div style={{ background: "#fff", border: "1px solid #ece9e4", borderRadius: 12, padding: "28px 32px", marginBottom: 20 }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9f523a", marginBottom: 6 }}>{editId ? "Edit" : "New"} Address</p>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", marginBottom: 20 }}>
              {editId ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Full Name *</label>
                  <input
                    className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Phone *</label>
                  <input
                    className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                  {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
                </div>
                <div className="col-12">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Address Line 1 *</label>
                  <input
                    className={`form-control ${fieldErrors.line1 ? "is-invalid" : ""}`}
                    placeholder="House/flat no., street name"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    required
                  />
                  {fieldErrors.line1 && <div className="invalid-feedback">{fieldErrors.line1}</div>}
                </div>
                <div className="col-12">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Address Line 2</label>
                  <input
                    className="form-control"
                    placeholder="Area, landmark (optional)"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>City *</label>
                  <input
                    className={`form-control ${fieldErrors.city ? "is-invalid" : ""}`}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>State *</label>
                  <select
                    className={`form-select ${fieldErrors.state ? "is-invalid" : ""}`}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>Pincode *</label>
                  <input
                    className={`form-control ${fieldErrors.pincode ? "is-invalid" : ""}`}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                  {fieldErrors.pincode && <div className="invalid-feedback">{fieldErrors.pincode}</div>}
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDefault"
                      checked={form.isDefault}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="isDefault">
                      Set as default address
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={saving} style={{ background: "#9f523a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving…" : editId ? "Update Address" : "Add Address"}
                </button>
                <button type="button" style={{ background: "#fff", color: "#555", border: "1px solid #ddd", padding: "10px 24px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setShowForm(false); setEditId(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
      )}

      {/* Address List */}
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : addresses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px", background: "#fff", border: "1px solid #ece9e4", borderRadius: 12 }}>
          <p style={{ fontSize: "2.4rem", marginBottom: 12 }}>&#128205;</p>
          <p style={{ fontWeight: 600, color: "#555", fontSize: "0.975rem" }}>No addresses saved yet</p>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map((a) => (
            <div key={a.id} className="col-md-6">
              <div style={{ border: a.isDefault ? "2px solid #9f523a" : "1px solid #ece9e4", borderRadius: 12, padding: "20px 22px", height: "100%", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.925rem", color: "#111" }}>{a.name}</span>
                  {a.isDefault && <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9f523a", background: "#fdf3ef", padding: "3px 8px", borderRadius: 4 }}>Default</span>}
                </div>
                <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: 4 }}>
                  {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: 4 }}>
                  {a.city}, {a.state} &ndash; {a.pincode}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: 18 }}>{a.phone}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ background: "#fff", border: "1px solid #ddd", padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, color: "#555", cursor: "pointer" }} onClick={() => handleEdit(a)}>Edit</button>
                  <button style={{ background: "#fff", border: "1px solid #fecaca", padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, color: "#b91c1c", cursor: "pointer" }} onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
