"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const screenshotRef = useRef<HTMLInputElement>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=address, 2=payment, 3=success
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
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

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setScreenshot(f);
      setScreenshotPreview(URL.createObjectURL(f));
    }
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    if (!screenshot) {
      setError("Please upload the payment screenshot");
      return;
    }

    setPlacing(true);
    setError("");

    const formData = new FormData();
    formData.append("addressId", selectedAddress);
    formData.append("paymentScreenshot", screenshot);
    if (couponApplied) {
      formData.append("couponCode", couponApplied.code);
    }

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.data.orderNumber);
        setStep(3);
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
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
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
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

              <div style={{ background: "#f8f9fa", padding: "18px 20px", borderRadius: "10px", marginBottom: "28px", border: "1px solid rgba(159,82,58,0.1)", textAlign: "left" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Order Status</p>
                <p style={{ color: "#9f523a", fontSize: "1rem", fontWeight: "700", marginBottom: 4 }}>Pending Payment Verification</p>
                <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: 0 }}>We&apos;ll notify you once your payment is verified.</p>
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
                  <Link
                    href="/account/addresses?returnTo=/checkout"
                    style={{
                      display: "inline-block",
                      background: "#9f523a",
                      color: "white",
                      padding: "10px 25px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#7a3f2c";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#9f523a";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    <i className="bi bi-plus-circle me-2" />Add Address
                  </Link>
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

                  <Link
                    href="/account/addresses?returnTo=/checkout"
                    style={{
                      display: "inline-block",
                      color: "#9f523a",
                      textDecoration: "none",
                      fontWeight: "600",
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
                    <i className="bi bi-plus-circle me-1" />Add New Address
                  </Link>
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

              {/* UPI QR Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(159, 82, 58, 0.05) 0%, rgba(159, 82, 58, 0.02) 100%)",
                padding: "35px",
                borderRadius: "12px",
                border: "1px solid rgba(159, 82, 58, 0.1)",
                textAlign: "center",
                marginBottom: "35px"
              }}>
                <p style={{ color: "#666", fontWeight: "700", fontSize: "1.05rem", marginBottom: "20px" }}>
                  <i className="bi bi-qr-code me-2" style={{ color: "#9f523a" }} />
                  Scan UPI QR Code to Pay
                </p>

                <div style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "12px",
                  background: "white",
                  border: "2px solid rgba(159, 82, 58, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 25px",
                  boxShadow: "0 4px 12px rgba(159, 82, 58, 0.1)",
                  overflow: "hidden",
                  padding: "6px"
                }}>
                  <Image
                    src="/assets/qr22309612024.png"
                    alt="UPI QR Code"
                    width={208}
                    height={208}
                    style={{ objectFit: "contain", borderRadius: "8px" }}
                  />
                </div>

                <p style={{ color: "#666", marginBottom: "15px" }}>
                  <strong>UPI ID:</strong> <span style={{ fontFamily: "monospace", color: "#9f523a" }}>snehasatheesan91-1@okicici</span>
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
                  Pay ₹{total.toLocaleString("en-IN")}
                </div>              </div>

              {/* Screenshot Upload */}
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontWeight: "700", color: "#333", marginBottom: "12px", fontSize: "0.95rem" }}>
                  Upload Payment Screenshot *
                </label>
                <div
                  onClick={() => screenshotRef.current?.click()}
                  style={{
                    border: screenshotPreview ? "2px solid #20c997" : "2px dashed #9f523a",
                    borderRadius: "12px",
                    padding: "35px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: screenshotPreview ? "rgba(32, 201, 151, 0.03)" : "rgba(159, 82, 58, 0.02)"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(159, 82, 58, 0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#9f523a";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = screenshotPreview ? "rgba(32, 201, 151, 0.03)" : "rgba(159, 82, 58, 0.02)";
                    (e.currentTarget as HTMLElement).style.borderColor = screenshotPreview ? "#20c997" : "#9f523a";
                  }}
                >
                  {screenshotPreview ? (
                    <div>
                      <Image
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        width={200}
                        height={150}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          maxHeight: "150px",
                          marginBottom: "12px"
                        }}
                      />
                      <p style={{ color: "#20c997", fontWeight: "600", marginBottom: "0" }}>
                        <i className="bi bi-check-circle me-2" />
                        {screenshot?.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i className="bi bi-cloud-upload" style={{ fontSize: "2.5rem", color: "#9f523a", display: "block", marginBottom: "12px" }} />
                      <p style={{ color: "#666", fontWeight: "600", marginBottom: "5px" }}>Click to upload payment screenshot</p>
                      <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "0" }}>PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={screenshotRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleScreenshotChange}
                />
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
                onClick={handlePlaceOrder}
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
                    Placing Order...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check me-2" />
                    Place Order
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
    </div>
  );
}
