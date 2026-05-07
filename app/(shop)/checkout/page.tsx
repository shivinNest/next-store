"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface CartItem {
  id: string;
  size: string;
  quantity: number;
  product: { name: string; price: string | number; images: string[] };
}

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

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=address, 2=payment, 3=success
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
    "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
  ];

  const handleAddressModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressErrors({});
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (data.success) {
        const newAddr: Address = data.data;
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddress(newAddr.id);
        setShowAddressModal(false);
        setAddressForm({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });
      } else if (data.errors) {
        setAddressErrors(data.errors);
      } else {
        setAddressErrors({ general: data.error || "Failed to save address" });
      }
    } catch {
      setAddressErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setAddressSaving(false);
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{
    code: string; discountAmount: number; description: string | null; discountType: string; discountValue: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const [cartRes, addrRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/addresses"),
      ]);

      if (cartRes.status === 401) {
        router.push("/login?redirect=/checkout&from=checkout");
        return;
      }

      const [cartData, addrData] = await Promise.all([cartRes.json(), addrRes.json()]);

      if (cartData.success) {
        if (!cartData.data.length) {
          router.push("/cart");
          return;
        }
        setCartItems(cartData.data);
      }
      if (addrData.success) {
        setAddresses(addrData.data);
        const def = addrData.data.find((a: Address) => a.isDefault);
        if (def) setSelectedAddress(def.id);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== "undefined") return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponApplied(data.data);
      } else {
        setCouponError(data.error || "Invalid coupon");
        setCouponApplied(null);
      }
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Please try again.");
        setPlacing(false);
        return;
      }

      // Create Razorpay order on server
      const createRes = await fetch("/api/orders/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          couponCode: couponApplied?.code ?? null,
        }),
      });
      const createData = await createRes.json();
      if (!createData.success) {
        setError(createData.error || "Failed to initiate payment");
        setPlacing(false);
        return;
      }

      const { orderId, amount, currency } = createData.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Saaviya",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment and create order
          const verifyRes = await fetch("/api/orders/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId: selectedAddress,
              couponCode: couponApplied?.code ?? null,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setOrderNumber(verifyData.data.orderNumber);
            setStep(3);
          } else {
            setError(verifyData.error || "Payment verification failed");
          }
          setPlacing(false);
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddress)?.name ?? "",
          contact: addresses.find((a) => a.id === selectedAddress)?.phone ?? "",
        },
        theme: { color: "#9f523a" },
        modal: {
          ondismiss: () => {
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity,
    0
  );
  const shippingFee = parseInt(process.env.NEXT_PUBLIC_SHIPPING_CHARGE || "50", 10);
  const freeThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "999", 10);
  const shipping = subtotal >= freeThreshold ? 0 : shippingFee;
  const couponDiscount = couponApplied?.discountAmount ?? 0;
  const total = subtotal + shipping - couponDiscount;

  if (loading) {
    return (
      <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: "40px", paddingBottom: "60px" }}>
        <style>{`
          @keyframes shimmer {
            0%   { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .sk {
            background: linear-gradient(90deg, #ece9e4 25%, #f5f2ef 50%, #ece9e4 75%);
            background-size: 600px 100%;
            animation: shimmer 1.4s infinite linear;
            border-radius: 6px;
          }
        `}</style>
        <div className="container">
          {/* Header skeleton */}
          <div style={{ marginBottom: "40px" }}>
            <div className="sk" style={{ height: 38, width: 200, marginBottom: 12 }} />
            <div className="sk" style={{ height: 16, width: 260 }} />
          </div>

          {/* Progress steps skeleton */}
          <div style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px", alignItems: "center" }}>
            {[1, 2, 3].map((n, i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                <div className="sk" style={{ width: 50, height: 50, borderRadius: "50%", flexShrink: 0 }} />
                <div>
                  <div className="sk" style={{ height: 11, width: 40, marginBottom: 6 }} />
                  <div className="sk" style={{ height: 14, width: 70 }} />
                </div>
                {i < 2 && <div className="sk" style={{ flex: 1, height: 2, minWidth: 20 }} />}
              </div>
            ))}
          </div>

          <div className="row g-4">
            {/* Main panel skeleton */}
            <div className="col-lg-7">
              <div style={{ background: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                {/* Section title */}
                <div className="sk" style={{ height: 24, width: 200, marginBottom: 8 }} />
                <div className="sk" style={{ height: 14, width: 280, marginBottom: 28 }} />
                {/* Address cards */}
                {[1, 2].map((n) => (
                  <div key={n} style={{ border: "2px solid #e9ecef", borderRadius: "10px", padding: "20px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div className="sk" style={{ height: 16, width: 140, marginBottom: 10 }} />
                        <div className="sk" style={{ height: 13, width: 220, marginBottom: 8 }} />
                        <div className="sk" style={{ height: 13, width: 170, marginBottom: 8 }} />
                        <div className="sk" style={{ height: 13, width: 110 }} />
                      </div>
                      <div className="sk" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
                {/* Button */}
                <div className="sk" style={{ height: 48, width: "100%", borderRadius: "8px", marginTop: "30px" }} />
              </div>
            </div>

            {/* Order summary sidebar skeleton */}
            <div className="col-lg-5">
              <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                <div className="sk" style={{ height: 20, width: 150, marginBottom: 8 }} />
                <div className="sk" style={{ height: 13, width: 80, marginBottom: 24 }} />
                {/* Items */}
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                    <div className="sk" style={{ width: 60, height: 75, borderRadius: "8px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="sk" style={{ height: 14, width: "80%", marginBottom: 8 }} />
                      <div className="sk" style={{ height: 12, width: "50%", marginBottom: 8 }} />
                      <div className="sk" style={{ height: 14, width: 60 }} />
                    </div>
                  </div>
                ))}
                {/* Totals */}
                <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "20px" }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div className="sk" style={{ height: 14, width: 80 }} />
                      <div className="sk" style={{ height: 14, width: 60 }} />
                    </div>
                  ))}
                  <div className="sk" style={{ height: 48, width: "100%", borderRadius: "8px", marginTop: "8px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: "40px", paddingBottom: "60px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ color: "#9f523a", fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px" }}>Checkout</h1>
          <p style={{ color: "#999", fontSize: "1rem", marginBottom: "0" }}>Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
          gap: "12px",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          {[
            { n: 1, label: "Address", icon: "geo-alt" },
            { n: 2, label: "Payment", icon: "credit-card" },
            { n: 3, label: "Order Placed", icon: "bag-check" },
          ].map(({ n, label, icon }, idx) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: step === 3 && n === 3
                    ? "linear-gradient(135deg, #20c997 0%, #17a2b8 100%)"
                    : step >= n ? "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)" : "#e9ecef",
                  color: step >= n ? "white" : "#999",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                  cursor: n < step && step < 3 ? "pointer" : "default",
                  boxShadow: step >= n ? "0 4px 12px rgba(159, 82, 58, 0.3)" : "none"
                }}
                onClick={() => n < step && step < 3 && setStep(n as 1 | 2)}
                title={label}
              >
                {step >= n && n < 3 ? <i className="bi bi-check2" /> : step === 3 && n === 3 ? <i className="bi bi-check2" /> : <i className={`bi bi-${icon}`} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.85rem", color: "#999" }}>Step {n}</span>
                <span style={{ fontWeight: "600", color: step >= n ? (n === 3 && step === 3 ? "#20c997" : "#9f523a") : "#999" }}>{label}</span>
              </div>
              {idx < 2 && (
                <div style={{
                  flex: 1,
                  height: "2px",
                  background: step > n ? "linear-gradient(90deg, #9f523a, #7a3f2c)" : "#e9ecef",
                  transition: "all 0.3s ease",
                  minWidth: "20px"
                }} />
              )}
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-7">{step === 3 ? (
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "48px 40px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(32,201,151,0.2)",
              textAlign: "center",
              animation: "slideIn 0.4s ease-out"
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #20c997 0%, #17a2b8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both",
                  boxShadow: "0 8px 24px rgba(32,201,151,0.35)"
                }}>
                  <i className="bi bi-check2" style={{ fontSize: "2.2rem", color: "white" }} />
                </div>
              </div>

              <h2 style={{ color: "#1a1a1a", fontSize: "1.6rem", fontWeight: "800", marginBottom: "8px" }}>Order Placed!</h2>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "24px" }}>
                Your order <strong style={{ color: "#9f523a" }}>#{orderNumber}</strong> has been successfully created.
              </p>

              <div style={{ background: "#f8f9fa", padding: "18px 20px", borderRadius: "10px", marginBottom: "28px", border: "1px solid rgba(32,201,151,0.2)", textAlign: "left" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Payment Status</p>
                <p style={{ color: "#20c997", fontSize: "1rem", fontWeight: "700", marginBottom: 4 }}>Payment Successful</p>
                <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: 0 }}>Your payment has been confirmed. We&apos;ll start processing your order soon.</p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                <Link
                  href="/account/orders"
                  style={{ display: "block", background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)", color: "white", padding: "13px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "0.95rem" }}
                >
                  <i className="bi bi-bag-check me-2" />View Your Orders
                </Link>
                <Link
                  href="/"
                  style={{ display: "block", background: "transparent", color: "#9f523a", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "0.95rem", border: "2px solid #9f523a" }}
                >
                  <i className="bi bi-arrow-left me-2" />Continue Shopping
                </Link>
              </div>
            </div>
          ) : step === 1 && (
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(159, 82, 58, 0.1)",
              animation: "slideIn 0.4s ease-out"
            }}>
              <h2 style={{ color: "#333", fontSize: "1.5rem", fontWeight: "700", marginBottom: "5px" }}>
                <i className="bi bi-geo-alt me-2" style={{ color: "#9f523a" }} />
                Delivery Address
              </h2>
              <p style={{ color: "#999", marginBottom: "25px" }}>Select where we should deliver your order</p>

              {addresses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#f8f9fa", borderRadius: "10px" }}>
                  <i className="bi bi-inbox" style={{ fontSize: "2.5rem", color: "#ccc", display: "block", marginBottom: "15px" }} />
                  <p style={{ color: "#999", marginBottom: "20px" }}>No delivery addresses saved yet</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    style={{
                      background: "#9f523a",
                      color: "white",
                      border: "none",
                      padding: "10px 25px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-plus-circle me-2" />Add Address
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: "15px", marginBottom: "25px" }}>
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        style={{
                          padding: "20px",
                          borderRadius: "10px",
                          border: selectedAddress === address.id ? "2px solid #9f523a" : "2px solid #e9ecef",
                          background: selectedAddress === address.id ? "rgba(159, 82, 58, 0.03)" : "white",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: selectedAddress === address.id ? "0 4px 12px rgba(159, 82, 58, 0.15)" : "none"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAddress !== address.id) {
                            (e.currentTarget as HTMLElement).style.borderColor = "#9f523a";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(159, 82, 58, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAddress !== address.id) {
                            (e.currentTarget as HTMLElement).style.borderColor = "#e9ecef";
                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                          }
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                              <p style={{ fontWeight: "700", color: "#333", marginBottom: "0", fontSize: "1.05rem" }}>{address.name}</p>
                              {address.isDefault && (
                                <span style={{
                                  background: "#20c997",
                                  color: "white",
                                  padding: "3px 10px",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600"
                                }}>Default</span>
                              )}
                            </div>
                            <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "8px" }}>
                              <i className="bi bi-geo-alt me-2" style={{ color: "#9f523a" }} />
                              {address.line1}
                              {address.line2 ? `, ${address.line2}` : ""}
                            </p>
                            <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "8px" }}>
                              {address.city}, {address.state} – {address.pincode}
                            </p>
                            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "0" }}>
                              <i className="bi bi-telephone me-2" />{address.phone}
                            </p>
                          </div>
                          <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: selectedAddress === address.id ? "3px solid #9f523a" : "2px solid #ddd",
                            background: selectedAddress === address.id ? "#9f523a" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.3s ease"
                          }}>
                            {selectedAddress === address.id && (
                              <i className="bi bi-check" style={{ color: "white", fontSize: "0.7rem", fontWeight: "bold" }} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#9f523a",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <i className="bi bi-plus-circle me-1" />Add New Address
                  </button>
                </>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedAddress}
                style={{
                  width: "100%",
                  background: selectedAddress ? "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)" : "#ccc",
                  color: "white",
                  border: "none",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  marginTop: "30px",
                  cursor: selectedAddress ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: selectedAddress ? "0 4px 12px rgba(159, 82, 58, 0.3)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (selectedAddress) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(159, 82, 58, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAddress) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(159, 82, 58, 0.3)";
                  }
                }}
              >
                Continue to Payment <i className="bi bi-arrow-right ms-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(159, 82, 58, 0.1)",
              animation: "slideIn 0.4s ease-out"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ color: "#333", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0" }}>
                  <i className="bi bi-credit-card me-2" style={{ color: "#9f523a" }} />
                  Payment Details
                </h2>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#9f523a",
                    cursor: "pointer",
                    fontWeight: "600",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  <i className="bi bi-arrow-left me-1" />Change Address
                </button>
              </div>

              {/* Razorpay Payment Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(159, 82, 58, 0.05) 0%, rgba(159, 82, 58, 0.02) 100%)",
                padding: "35px",
                borderRadius: "12px",
                border: "1px solid rgba(159, 82, 58, 0.1)",
                textAlign: "center",
                marginBottom: "35px"
              }}>
                <i className="bi bi-shield-lock" style={{ fontSize: "2.5rem", color: "#9f523a", display: "block", marginBottom: "16px" }} />
                <p style={{ color: "#333", fontWeight: "700", fontSize: "1.1rem", marginBottom: "8px" }}>
                  Secure Online Payment
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "20px" }}>
                  Pay safely using UPI, Cards, Net Banking, or Wallets via Razorpay
                </p>
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
                  color: "white",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1.1rem"
                }}>
                  Total: ₹{total.toLocaleString("en-IN")}
                </div>
              </div>

              {error && (
                <div style={{
                  background: "#f8d7da",
                  border: "1px solid #f5c6cb",
                  color: "#721c24",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  marginBottom: "25px",
                  fontSize: "0.9rem"
                }}>
                  <i className="bi bi-exclamation-triangle me-2" />
                  {error}
                </div>
              )}

              <button
                onClick={handleRazorpayPayment}
                disabled={placing}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
                  color: "white",
                  border: "none",
                  padding: "16px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  cursor: placing ? "not-allowed" : "pointer",
                  opacity: placing ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(159, 82, 58, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!placing) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(159, 82, 58, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!placing) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(159, 82, 58, 0.3)";
                  }
                }}
              >
                {placing ? (
                  <>
                    <span style={{ display: "inline-block", marginRight: "8px" }}>
                      <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                    </span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-credit-card me-2" />
                    Pay ₹{total.toLocaleString("en-IN")} with Razorpay
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                style={{
                  width: "100%",
                  background: "white",
                  color: "#9f523a",
                  border: "2px solid #9f523a",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  marginTop: "12px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(159, 82, 58, 0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "white";
                }}
              >
                <i className="bi bi-arrow-left me-2" />Back to Address
              </button>
            </div>
          )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 3 && <div className="col-lg-5">
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(159, 82, 58, 0.1)",
              position: "sticky",
              top: "80px"
            }}>
              <h3 style={{ color: "#333", fontWeight: "700", marginBottom: "5px" }}>Order Summary</h3>
              <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "25px" }}>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</p>

              {/* Items */}
              <div style={{ maxHeight: "350px", overflowY: "auto", marginBottom: "20px", paddingRight: "10px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #f0f0f0"
                  }}>
                    <div
                      style={{
                        width: "60px",
                        height: "75px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f0f0f0",
                        position: "relative"
                      }}
                    >
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#e9ecef" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600", color: "#333", fontSize: "0.9rem", marginBottom: "4px", lineHeight: "1.3" }}>
                        {item.product.name}
                      </p>
                      <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "6px" }}>
                        Size: <strong>{item.size}</strong> × {item.quantity}
                      </p>
                      <p style={{ color: "#9f523a", fontWeight: "700", fontSize: "0.95rem", marginBottom: "0" }}>
                        ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "20px" }}>
                {/* Coupon Input */}
                <div style={{ marginBottom: "18px" }}>
                  {couponApplied ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(32,201,151,0.08)", border: "1px solid rgba(32,201,151,0.3)", borderRadius: "8px", padding: "10px 14px" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#15803d" }}>
                          <i className="bi bi-check-circle-fill me-2" />
                          {couponApplied.code}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>
                          {couponApplied.discountType === "PERCENTAGE"
                            ? `${couponApplied.discountValue}% off`
                            : `₹${couponApplied.discountValue} off`}
                          {couponApplied.description ? ` · ${couponApplied.description}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          style={{ flex: 1, border: "1.5px solid #e5e0da", borderRadius: "8px", padding: "9px 12px", fontSize: "0.85rem", outline: "none", fontFamily: "monospace", letterSpacing: "0.05em" }}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          style={{ background: "#9f523a", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, fontSize: "0.82rem", cursor: couponLoading || !couponCode.trim() ? "not-allowed" : "pointer", opacity: couponLoading || !couponCode.trim() ? 0.65 : 1 }}
                        >
                          {couponLoading ? "…" : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "#b91c1c" }}>
                          <i className="bi bi-exclamation-circle me-1" />{couponError}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#666", fontSize: "0.95rem" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#666", fontSize: "0.95rem" }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#20c997" : "#333", fontWeight: shipping === 0 ? "600" : "400" }}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {couponApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#15803d", fontSize: "0.95rem", fontWeight: 600 }}>
                    <span><i className="bi bi-tag me-1" />Coupon ({couponApplied.code})</span>
                    <span>−₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "linear-gradient(135deg, rgba(159, 82, 58, 0.08) 0%, rgba(159, 82, 58, 0.03) 100%)",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  color: "#9f523a"
                }}>
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Info Banner */}
              <div style={{
                background: "rgba(32, 201, 151, 0.08)",
                border: "1px solid rgba(32, 201, 151, 0.2)",
                padding: "12px 15px",
                borderRadius: "8px",
                marginTop: "20px",
                fontSize: "0.85rem",
                color: "#1a7a5a"
              }}>
                <i className="bi bi-shield-check me-2" style={{ color: "#20c997" }} />
                <strong>Secure Payment</strong> - Your payment information is encrypted
              </div>
            </div>
          </div>}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddressModal(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 1050,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: "14px",
            width: "100%",
            maxWidth: "680px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px 0" }}>
              <h5 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111", margin: 0 }}>
                <i className="bi bi-geo-alt me-2" style={{ color: "#9f523a" }} />
                Add Delivery Address
              </h5>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.3rem", color: "#999", cursor: "pointer", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleAddressModalSubmit} style={{ padding: "20px 28px 28px" }}>
              {addressErrors.general && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
                  {addressErrors.general}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Full Name *</label>
                  <input
                    type="text" required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Recipient name"
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.name ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                  {addressErrors.name && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Phone *</label>
                  <input
                    type="tel" required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.phone ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                  {addressErrors.phone && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.phone}</p>}
                </div>

                {/* Address Line 1 */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Address Line 1 *</label>
                  <input
                    type="text" required
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm(f => ({ ...f, line1: e.target.value }))}
                    placeholder="House no., Street, Area"
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.line1 ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                  {addressErrors.line1 && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.line1}</p>}
                </div>

                {/* Address Line 2 */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Address Line 2 <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span></label>
                  <input
                    type="text"
                    value={addressForm.line2}
                    onChange={(e) => setAddressForm(f => ({ ...f, line2: e.target.value }))}
                    placeholder="Landmark, Apartment, etc."
                    style={{ width: "100%", border: "1.5px solid #e5e0da", borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                {/* City */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>City *</label>
                  <input
                    type="text" required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City"
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.city ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                  {addressErrors.city && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.city}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Pincode *</label>
                  <input
                    type="text" required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm(f => ({ ...f, pincode: e.target.value }))}
                    placeholder="6-digit pincode"
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.pincode ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                  {addressErrors.pincode && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.pincode}</p>}
                </div>

                {/* State */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>State *</label>
                  <select
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(f => ({ ...f, state: e.target.value }))}
                    style={{ width: "100%", border: `1.5px solid ${addressErrors.state ? "#f87171" : "#e5e0da"}`, borderRadius: 8, padding: "9px 12px", fontSize: "0.9rem", outline: "none", background: "#fff", boxSizing: "border-box" }}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {addressErrors.state && <p style={{ color: "#b91c1c", fontSize: "0.75rem", margin: "4px 0 0" }}>{addressErrors.state}</p>}
                </div>

                {/* Set as default */}
                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    id="modal-isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm(f => ({ ...f, isDefault: e.target.checked }))}
                    style={{ width: 16, height: 16, accentColor: "#9f523a", cursor: "pointer" }}
                  />
                  <label htmlFor="modal-isDefault" style={{ fontSize: "0.875rem", color: "#555", cursor: "pointer", margin: 0 }}>Set as default address</label>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  style={{ flex: 1, background: "#fff", border: "1.5px solid #e5e0da", borderRadius: 8, padding: "11px", fontWeight: 600, color: "#555", cursor: "pointer", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  style={{ flex: 2, background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)", border: "none", borderRadius: 8, padding: "11px", fontWeight: 700, color: "#fff", cursor: addressSaving ? "not-allowed" : "pointer", opacity: addressSaving ? 0.75 : 1, fontSize: "0.9rem" }}
                >
                  {addressSaving ? "Saving…" : "Save & Use This Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
