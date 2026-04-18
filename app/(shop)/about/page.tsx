"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              marginBottom: "20px",
              animation: isLoaded
                ? "slideDown 0.8s ease-out"
                : "none",
            }}
          >
            Our Story
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: 0.95,
              animation: isLoaded
                ? "fadeIn 0.8s ease-out 0.2s forwards"
                : "opacity: 0",
            }}
          >
            At Saaviya, we believe in quality, authenticity, and meaningful
            connections
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "60px 20px" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div
                style={{
                  background: "white",
                  padding: "40px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(159, 82, 58, 0.1)",
                  border: "1px solid rgba(159, 82, 58, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 25px rgba(159, 82, 58, 0.2)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 15px rgba(159, 82, 58, 0.1)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <h2 style={{ color: "#9f523a", marginBottom: "15px" }}>
                  Our Mission
                </h2>
                <p style={{ color: "#555", lineHeight: "1.8" }}>
                  To deliver exceptional products and experiences that enrich
                  our customers' lives. We are committed to sourcing the finest
                  quality items and providing outstanding customer service that
                  exceeds expectations.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div
                style={{
                  background: "white",
                  padding: "40px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(159, 82, 58, 0.1)",
                  border: "1px solid rgba(159, 82, 58, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 25px rgba(159, 82, 58, 0.2)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 15px rgba(159, 82, 58, 0.1)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <h2 style={{ color: "#9f523a", marginBottom: "15px" }}>
                  Our Vision
                </h2>
                <p style={{ color: "#555", lineHeight: "1.8" }}>
                  To become the most trusted online destination for premium
                  products. We envision a community where customers feel valued,
                  inspired, and confident in every purchase they make with
                  Saaviya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: "60px 20px", background: "white" }}>
        <div className="container">
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.2rem",
              color: "#9f523a",
              marginBottom: "50px",
              fontWeight: "700",
            }}
          >
            Our Core Values
          </h2>

          <div className="row g-4">
            {[
              {
                icon: "✨",
                title: "Quality",
                desc: "Every product is carefully selected to ensure excellence and durability",
              },
              {
                icon: "🤝",
                title: "Trust",
                desc: "We build lasting relationships with our customers through transparency and integrity",
              },
              {
                icon: "💚",
                title: "Sustainability",
                desc: "We are committed to environmentally responsible practices and sourcing",
              },
              {
                icon: "🚀",
                title: "Innovation",
                desc: "We continuously evolve to bring you the latest products and best experiences",
              },
            ].map((value, idx) => (
              <div key={idx} className="col-sm-6 col-lg-3">
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    borderRadius: "12px",
                    background: "#fafafa",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-8px)";
                    (e.currentTarget as HTMLElement).style.background =
                      "linear-gradient(135deg, rgba(159, 82, 58, 0.05) 0%, rgba(159, 82, 58, 0.02) 100%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLElement).style.background = "#fafafa";
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "15px",
                    }}
                  >
                    {value.icon}
                  </div>
                  <h3 style={{ color: "#9f523a", marginBottom: "10px" }}>
                    {value.title}
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.95rem" }}>
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "60px 20px", background: "#fafafa" }}>
        <div className="container">
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.2rem",
              color: "#9f523a",
              marginBottom: "50px",
              fontWeight: "700",
            }}
          >
            Why Choose Saaviya?
          </h2>

          <div className="row g-4">
            {[
              {
                title: "Premium Selection",
                desc: "Handpicked products from trusted suppliers worldwide",
              },
              {
                title: "Exceptional Service",
                desc: "Dedicated support team available to assist you anytime",
              },
              {
                title: "Fast Shipping",
                desc: "Reliable and prompt delivery to your doorstep",
              },
              {
                title: "Secure Shopping",
                desc: "Safe transactions with encrypted payment processing",
              },
              {
                title: "Easy Returns",
                desc: "Hassle-free return and exchange policy",
              },
              {
                title: "Best Prices",
                desc: "Competitive pricing without compromising quality",
              },
            ].map((item, idx) => (
              <div key={idx} className="col-sm-6 col-lg-4">
                <div
                  style={{
                    padding: "25px",
                    background: "white",
                    borderRadius: "10px",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#9f523a";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 20px rgba(159, 82, 58, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <h3 style={{ color: "#9f523a", marginBottom: "10px" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "0" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: "20px", fontSize: "2rem" }}>
            Join the Saaviya Community
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "30px", opacity: 0.95 }}>
            Experience the difference quality and service can make
          </p>
          <a
            href="/products"
            style={{
              display: "inline-block",
              background: "#20c997",
              color: "white",
              padding: "12px 35px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "all 0.3s ease",
              fontSize: "1rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1aa179";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#20c997";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Explore Products
          </a>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
