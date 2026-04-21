"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  author: string;
  tags: string[];
  publishedAt?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?limit=12")
      .then((r) => r.json())
      .then((d) => d.success && setBlogs(d.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#faf9f7", minHeight: "100vh", paddingTop: "60px", paddingBottom: "80px" }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-5" style={{ maxWidth: 560, margin: "0 auto 56px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9f523a", marginBottom: "12px" }}>
            Journal
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "16px" }}>
            Our Stories
          </h1>
          <p style={{ fontSize: "1rem", color: "#777", lineHeight: 1.7, margin: 0 }}>
            Fashion tips, style guides, and trend reports to inspire your wardrobe.
          </p>
        </div>

        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-sm-6 col-lg-4">
                <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                  <div className="skeleton" style={{ height: 240 }} />
                  <div style={{ padding: "20px" }}>
                    <div className="skeleton mb-2" style={{ height: 14, width: "40%" }} />
                    <div className="skeleton mb-2" style={{ height: 20, width: "85%" }} />
                    <div className="skeleton" style={{ height: 14, width: "60%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: "1rem", color: "#999" }}>No stories published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-sm-6 col-lg-4">
                <Link href={`/stories/${blog.slug}`} className="text-decoration-none d-block h-100"
                  style={{ color: "inherit" }}>
                  <article
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #ece9e4",
                      transition: "box-shadow 0.25s, transform 0.25s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.10)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="(max-width:576px) 100vw, 33vw"
                          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.transform = "scale(1.04)")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.transform = "scale(1)")}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #e8ddd7, #c9b4a8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "2rem", opacity: 0.4 }}>&#10022;</span>
                        </div>
                      )}

                      {/* Tags overlay */}
                      {blog.tags.length > 0 && (
                        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
                          {blog.tags.slice(0, 2).map((t) => (
                            <span key={t} style={{
                              background: "rgba(255,255,255,0.92)",
                              color: "#9f523a",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: 4,
                            }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "20px 22px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                      {/* Meta */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "linear-gradient(135deg, #9f523a, #7a3f2c)",
                          color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                        }}>
                          {blog.author[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>{blog.author}</span>
                        {blog.publishedAt && (
                          <>
                            <span style={{ color: "#ddd", fontSize: "0.75rem" }}>&middot;</span>
                            <span style={{ fontSize: "0.78rem", color: "#aaa" }}>{formatDate(blog.publishedAt)}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1.35,
                        marginBottom: 10,
                        letterSpacing: "-0.01em",
                      }}>
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p style={{
                          fontSize: "0.875rem",
                          color: "#666",
                          lineHeight: 1.65,
                          flex: 1,
                          margin: "0 0 18px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Read more */}
                      <span style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#9f523a",
                        letterSpacing: "0.04em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}>
                        Read Story
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
