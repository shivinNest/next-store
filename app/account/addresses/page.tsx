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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">My Addresses</h5>
        <button
          className="btn btn-primary btn-sm px-3"
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <i className="bi bi-plus me-1" />Add Address
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">
              {editId ? "Edit Address" : "Add New Address"}
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone *</label>
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
                  <label className="form-label small fw-semibold">Address Line 1 *</label>
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
                  <label className="form-label small fw-semibold">Address Line 2</label>
                  <input
                    className="form-control"
                    placeholder="Area, landmark (optional)"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">City *</label>
                  <input
                    className={`form-control ${fieldErrors.city ? "is-invalid" : ""}`}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">State *</label>
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
                  <label className="form-label small fw-semibold">Pincode *</label>
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
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : saving ? "" : editId ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowForm(false); setEditId(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-geo-alt fs-1 text-muted" />
          <h6 className="mt-3 text-muted">No addresses saved</h6>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map((a) => (
            <div key={a.id} className="col-md-6">
              <div className={`card h-100 ${a.isDefault ? "border-primary border-2" : "border-0 shadow-sm"}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">{a.name}</span>
                    {a.isDefault && <span className="badge bg-primary">Default</span>}
                  </div>
                  <p className="text-muted small mb-1">
                    {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                  </p>
                  <p className="text-muted small mb-1">
                    {a.city}, {a.state} – {a.pincode}
                  </p>
                  <p className="text-muted small mb-3">📞 {a.phone}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(a)}
                    >
                      <i className="bi bi-pencil me-1" />Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(a.id)}
                    >
                      <i className="bi bi-trash me-1" />Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
