"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Hero — full bleed image + overlay text */}
      <section style={{ position: "relative", height: "90vh", minHeight: 520, overflow: "hidden" }}>
        <Image
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=900&fit=crop"
          alt="Saaviya — Women's Fashion"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)"
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 20px"
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
            Our Story
          </p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20, maxWidth: 700 }}>
            Crafting Fashion for the Modern Indian Woman
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.75, margin: 0 }}>
            Saaviya was born from a love of ethnic craftsmanship and a desire to make it accessible for every occasion.
          </p>
        </div>
      </section>

      {/* Story — image left with badges, text right */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Image stack */}
            <div className="col-lg-6">
              <div className={styles.imgStack} style={{ paddingBottom: 44, paddingRight: 24 }}>
                <div className={styles.imgMain}>
                  <Image
                    src="/assets/mahimayadav0-ethnic-4762352_1920.jpg"
                    alt="Saaviya — Fashion that speaks for you"
                    fill
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.38) 100%)",
                    borderRadius: "inherit",
                  }} />
                  <div style={{ position: "absolute", bottom: 18, left: 18, color: "white" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>Saaviya</p>
                    <p style={{ fontSize: "0.78rem", letterSpacing: "0.06em", margin: 0, opacity: 0.85, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Fashion that speaks for you</p>
                  </div>
                </div>
                {/* Bottom-right accent */}
                <div className={styles.imgAccentBadge}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-1px" }}>500+</div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: 4, lineHeight: 1.4 }}>Styles curated<br />every season</div>
                </div>
                {/* Top-left float badge */}
                <div className={styles.imgFloatBadge}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>10K+</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.85, marginTop: 4, lineHeight: 1.3 }}>Happy<br />Customers</div>
                </div>
              </div>
            </div>
            {/* Text */}
            <div className="col-lg-6">
              <span className={`${styles.badge} mb-4 d-inline-flex`}>
                <i className="bi bi-stars" />
                Who We Are
              </span>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#111", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 20 }}>
                Rooted in tradition,
                <span style={{ color: "#9f523a", display: "block" }}>designed for today.</span>
              </h2>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8, marginBottom: 16 }}>
                Founded in 2026, Saaviya is a women&apos;s ethnic fashion brand curated for the contemporary Indian woman. We work with skilled artisans across India to bring you handcrafted pieces that honour tradition while embracing modern silhouettes.
              </p>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8, marginBottom: 16 }}>
                From daily kurtas to celebration lehengas, every piece in our collection is chosen for its quality, craft, and timeless appeal.
              </p>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8, marginBottom: 28 }}>
                We believe that fashion is deeply personal — a reflection of culture, confidence, and self-expression. That&apos;s why every Saaviya piece is thoughtfully designed to help you feel as beautiful on the inside as you look on the outside.
              </p>
              {/* Inline trust row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
                {[
                  { icon: "bi-patch-check-fill", text: "100% Authentic Products" },
                  { icon: "bi-truck",            text: "Pan-India Shipping" },
                  { icon: "bi-arrow-repeat",     text: "7-Day Easy Returns" },
                ].map((t) => (
                  <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className={`bi ${t.icon}`} style={{ color: "#9f523a", fontSize: "0.95rem" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#444" }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
   
      {/* Mission & Vision */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 520, margin: "0 auto 60px" }}>
            <span className={`${styles.badge} mb-3 d-inline-flex`}>
              <i className="bi bi-compass" />
              Purpose &amp; Direction
            </span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 800, color: "#111", lineHeight: 1.2, letterSpacing: "-0.03em", margin: 0 }}>Our Mission &amp; Vision</h2>
          </div>
          <div className="row g-4">
            {/* Mission — dark card */}
            <div className="col-lg-6">
              <div style={{
                background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
                borderRadius: 20,
                padding: "52px 44px",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -24, right: -8, fontSize: "9rem", fontWeight: 900, color: "rgba(255,255,255,0.05)", lineHeight: 1, userSelect: "none" }}>01</div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#fff", marginBottom: 28 }}>
                  <i className="bi bi-bullseye" />
                </div>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>Mission</p>
                <h3 style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.65rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 18 }}>Deliver beauty, earn trust.</h3>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.85, margin: 0 }}>
                  To deliver exceptional ethnic fashion and experiences that enrich our customers&apos; lives. We are committed to sourcing the finest quality pieces and providing outstanding service that consistently exceeds expectations.
                </p>
              </div>
            </div>
            {/* Vision — light card */}
            <div className="col-lg-6">
              <div style={{
                background: "#faf9f7",
                border: "1px solid rgba(159,82,58,0.1)",
                borderRadius: 20,
                padding: "52px 44px",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -24, right: -8, fontSize: "9rem", fontWeight: 900, color: "rgba(159,82,58,0.04)", lineHeight: 1, userSelect: "none" }}>02</div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(159,82,58,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#9f523a", marginBottom: 28 }}>
                  <i className="bi bi-eye" />
                </div>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9f523a", marginBottom: 12 }}>Vision</p>
                <h3 style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.65rem)", fontWeight: 800, color: "#111", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 18 }}>The most trusted name in ethnic wear.</h3>
                <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.85, margin: 0 }}>
                  To become India&apos;s most trusted online destination for premium ethnic fashion — a community where every woman feels valued, inspired, and confident in who she is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed image break */}
      {/* Full-bleed image break */}
      <section style={{ position: "relative", height: "clamp(420px, 55vh, 580px)", overflow: "hidden" }}>
        {/* Photo */}
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=800&fit=crop"
          alt="Saaviya collection"
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Deep directional overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,5,0,0.72) 0%, rgba(90,30,10,0.48) 55%, rgba(0,0,0,0.25) 100%)",
        }} />
        {/* Subtle warm vignette on edges */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }} />
        {/* Ghost watermark text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", overflow: "hidden",
        }}>
          <span style={{
            fontSize: "clamp(5rem, 18vw, 14rem)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.04)",
            letterSpacing: "-0.05em",
            userSelect: "none",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>SAAVIYA</span>
        </div>
        {/* Content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", textAlign: "center", padding: "0 20px",
        }}>
          {/* Decorative line */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              Since 2024
            </span>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.4)" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 10,
            maxWidth: 680,
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
          }}>
            Where every thread
          </h2>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
            fontWeight: 900,
            color: "#c87a5a",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 28,
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            tells a story.
          </h2>
          <Link href="/products" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "14px 36px",
            borderRadius: 100,
            fontWeight: 700,
            fontSize: "0.88rem",
            textDecoration: "none",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.28)",
            transition: "background 0.2s",
          }}>
            Shop the Collection
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 520, margin: "0 auto 60px" }}>
            <span className={`${styles.badge} mb-3 d-inline-flex`}>
              <i className="bi bi-stars" />
              Why Saaviya
            </span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 800, color: "#111", lineHeight: 1.2, letterSpacing: "-0.03em", margin: 0 }}>The Saaviya Difference</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "bi-gem",          title: "Handpicked Selection",     desc: "Every product is individually curated — no generic bulk listings. Only pieces we genuinely stand behind." },
              { icon: "bi-people",       title: "Artisan Partnerships",     desc: "We work directly with weavers and craftspeople across India, supporting livelihoods and preserving heritage." },
              { icon: "bi-truck",        title: "Fast & Reliable Shipping", desc: "Orders dispatched within 24 hours with real-time tracking so you always know where your order is." },
              { icon: "bi-arrow-repeat", title: "Effortless Returns",       desc: "Changed your mind? Our 7-day hassle-free return policy has you covered." },
              { icon: "bi-shield-check", title: "Secure Payments",          desc: "All transactions are encrypted and processed through trusted payment gateways." },
              { icon: "bi-headset",      title: "Real Customer Support",    desc: "Talk to a real person — not a bot. Our team is here Mon–Sat 9 AM to 6 PM." },
            ].map((item, i) => (
              <div key={item.title} className="col-sm-6 col-lg-4">
                <div style={{
                  background: "#faf9f7",
                  border: "1px solid rgba(159,82,58,0.08)",
                  borderRadius: 16,
                  padding: "36px 28px 32px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(159,82,58,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(159,82,58,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(159,82,58,0.08)"; }}
                >
                  {/* Ghost number */}
                  <div style={{ position: "absolute", top: -14, right: 12, fontSize: "5rem", fontWeight: 900, color: "rgba(159,82,58,0.04)", lineHeight: 1, userSelect: "none" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #9f523a, #7a3f2c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: "#fff", marginBottom: 22, boxShadow: "0 6px 18px rgba(159,82,58,0.28)" }}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#111", marginBottom: 10, letterSpacing: "-0.01em" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "#777", lineHeight: 1.72, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: "96px 0", background: "#faf9f7" }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 520, margin: "0 auto 60px" }}>
            <span className={`${styles.badge} mb-3 d-inline-flex`}>
              <i className="bi bi-person-heart" />
              Meet the Founder
            </span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 800, color: "#111", lineHeight: 1.2, letterSpacing: "-0.03em", margin: 0 }}>The person behind Saaviya</h2>
          </div>
          <div className="row g-5 align-items-center justify-content-center">
            {/* Founder image */}
            <div className="col-lg-4 col-md-5 col-10 mx-auto">
              <div className={styles.founderImgWrap}>
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=720&fit=crop&crop=face"
                  alt="Snaha Satheesan — Founder, Saaviya"
                  fill
                  sizes="(max-width: 768px) 80vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className={styles.founderImgOverlay} />
              </div>
            </div>
            {/* Founder text */}
            <div className="col-lg-6 col-md-7">
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9f523a", marginBottom: 14 }}>Founder, Saaviya</p>
              <h3 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: "#111", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20 }}>
                Snaha Satheesan
              </h3>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.85, marginBottom: 16 }}>
                Snaha Satheesan is a passionate fashion enthusiast who has been deeply involved in the world of style and ethnic wear since 2020. With years of hands-on experience understanding what modern Indian women truly want to wear, she turned her passion into purpose.
              </p>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.85, marginBottom: 28 }}>
                In 2026, she founded Saaviya — a brand built on the belief that every woman deserves fashion that is authentic, beautiful, and made for her. From carefully curated kurtas to celebration-ready lehengas, Saaviya reflects Snaha&apos;s vision of fashion that honours Indian craft while speaking to the contemporary woman.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 1.5, background: "#9f523a", borderRadius: 2 }} />
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#9f523a", fontStyle: "italic", letterSpacing: "0.02em" }}>Snaha Satheesan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0d0d0d", padding: "80px 20px", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 16 }}>Join Us</p>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Become part of the Saaviya community.
          </h2>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: 36, lineHeight: 1.7 }}>
            Thousands of women across India trust Saaviya for their most important moments. We&apos;d love to be part of yours.
          </p>
          <a href="https://www.instagram.com/saa.viya" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#9f523a",
            color: "#fff",
            padding: "14px 44px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.9rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}>
            <i className="bi bi-instagram" style={{ marginRight: 8 }} />
            Follow Us on Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
