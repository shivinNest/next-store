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
                Founded in 2024, Saaviya is a women&apos;s ethnic fashion brand curated for the contemporary Indian woman. We work with skilled artisans across India to bring you handcrafted pieces that honour tradition while embracing modern silhouettes.
              </p>
              <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8 }}>
                From daily kurtas to celebration lehengas, every piece in our collection is chosen for its quality, craft, and timeless appeal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className={styles.statStrip}>
        <div className="container">
          <div className="row g-0">
            {[
              { number: "10", suffix: "K+", label: "Happy Customers" },
              { number: "500", suffix: "+", label: "Styles Available" },
              { number: "100", suffix: "%", label: "Authentic Products" },
              { number: "7", suffix: "-Day", label: "Easy Returns" },
            ].map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <div className={styles.statItem}>
                  <div>
                    <span className={styles.statNumber}>{s.number}</span>
                    <span className={styles.statSuffix}>{s.suffix}</span>
                  </div>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision — two columns */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div style={{ borderLeft: "3px solid #9f523a", paddingLeft: 28 }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 12 }}>Mission</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111", marginBottom: 16, lineHeight: 1.3 }}>Deliver beauty, earn trust.</h3>
                <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
                  To deliver exceptional ethnic fashion and experiences that enrich our customers&apos; lives. We are committed to sourcing the finest quality pieces and providing outstanding service that consistently exceeds expectations.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ borderLeft: "3px solid #c9b4a8", paddingLeft: 28 }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 12 }}>Vision</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111", marginBottom: 16, lineHeight: 1.3 }}>The most trusted name in ethnic wear.</h3>
                <p style={{ fontSize: "0.975rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
                  To become India&apos;s most trusted online destination for premium ethnic fashion — a community where every woman feels valued, inspired, and confident in who she is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — editorial grid */}
      <section style={{ padding: "80px 0", background: "#faf9f7" }}>
        <div className="container">
          <div className="text-center mb-5" style={{ maxWidth: 480, margin: "0 auto 52px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 12 }}>What We Stand For</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#111", lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0 }}>Our Core Values</h2>
          </div>
          <div className="row g-4">
            {[
              { label: "Quality", text: "Every piece is carefully selected for its craftsmanship, fabric quality, and durability. We never compromise." },
              { label: "Trust", text: "We build lasting relationships through transparency, honest pricing, and reliable delivery on every promise." },
              { label: "Sustainability", text: "We work with artisans who use responsible, low-impact processes — honouring both people and planet." },
              { label: "Community", text: "Saaviya is more than a store. We celebrate Indian women and the stories they wear every day." },
            ].map((v, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className={styles.valueCard}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9f523a", marginBottom: 14 }}>0{i + 1}</p>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#111", marginBottom: 12 }}>{v.label}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: 1.75, margin: 0 }}>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed image break */}
      <section style={{ position: "relative", height: 420, overflow: "hidden" }}>
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=600&fit=crop"
          alt="Saaviya collection"
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "0 20px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 16, maxWidth: 600 }}>
            Where every thread tells a story.
          </h2>
          <Link href="/products/all" style={{
            display: "inline-block",
            background: "#fff",
            color: "#9f523a",
            padding: "12px 36px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.9rem",
            textDecoration: "none",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <div className="text-center mb-5" style={{ maxWidth: 480, margin: "0 auto 52px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9f523a", marginBottom: 12 }}>Why Saaviya</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#111", lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0 }}>The Saaviya Difference</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "bi-gem",          title: "Handpicked Selection",    desc: "Every product is individually curated — no generic bulk listings. Only pieces we genuinely stand behind." },
              { icon: "bi-people",       title: "Artisan Partnerships",    desc: "We work directly with weavers and craftspeople across India, supporting livelihoods and preserving heritage." },
              { icon: "bi-truck",        title: "Fast & Reliable Shipping", desc: "Orders dispatched within 24 hours with real-time tracking so you always know where your order is." },
              { icon: "bi-arrow-repeat", title: "Effortless Returns",      desc: "Changed your mind? Our 7-day hassle-free return policy has you covered." },
              { icon: "bi-shield-check", title: "Secure Payments",         desc: "All transactions are encrypted and processed through trusted payment gateways." },
              { icon: "bi-headset",      title: "Real Customer Support",   desc: "Talk to a real person — not a bot. Our team is here Mon–Sat 9 AM to 6 PM." },
            ].map((item) => (
              <div key={item.title} className="col-sm-6 col-lg-4">
                <div className={styles.pillar}>
                  <div className={styles.pillarIcon}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "#777", lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section style={{
        background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
        padding: "72px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 15% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container position-relative text-center text-white" style={{ maxWidth: 600 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            backdropFilter: "blur(4px)",
            fontSize: "2rem",
          }}>
            <i className="bi bi-instagram" />
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            marginBottom: 20,
          }}>
            @saaviya.in
          </span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Follow us on Instagram
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 460 }}>
            Get daily style inspiration, new arrivals, behind-the-scenes peeks, and exclusive offers — straight to your feed.
          </p>
          <a
            href="https://www.instagram.com/saaviya.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#fff", color: "#c13584",
              padding: "14px 36px", borderRadius: 10,
              fontWeight: 800, fontSize: "0.95rem",
              textDecoration: "none", letterSpacing: "0.02em",
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            }}
          >
            <i className="bi bi-instagram" style={{ fontSize: "1.1rem" }} />
            Follow @saaviya.in
          </a>
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
          <Link href="/products/all" style={{
            display: "inline-block",
            background: "#9f523a",
            color: "#fff",
            padding: "14px 44px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.9rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Explore Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
