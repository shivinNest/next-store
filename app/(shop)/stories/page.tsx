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
    <div className="bg-light py-5">
      <style>{`
        .story-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          transition: all 0.3s ease;
          height: 100%;
        }
        .story-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .story-card .card-img-top {
          transition: transform 0.3s ease;
        }
        .story-card:hover .card-img-top {
          transform: scale(1.05);
        }
        .badge-tag {
          background-color: #f0f0f0 !important;
          color: #9f523a !important;
          font-weight: 600;
          border-color: #9f523a !important;
          font-size: 0.75rem;
        }
        .author-avatar {
          background: linear-gradient(135deg, #9f523a, #7a3f2c) !important;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .read-more-link {
          color: #9f523a;
          font-weight: 600;
          text-decoration: none;
        }
        .read-more-link:hover {
          color: #7a3f2c;
          text-decoration: underline;
        }
        .meta-date {
          color: #9f523a;
          font-weight: 600;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-5 fw-bold mb-3">Our Stories</h1>
            <p className="lead text-muted">Fashion tips, style guides, and trend reports to inspire your wardrobe</p>
          </div>
        </div>

        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-sm-6 col-lg-4">
                <div className="card border-0 story-card">
                  <div className="skeleton" style={{ height: 220, borderRadius: "0.375rem 0.375rem 0 0" }} />
                  <div className="card-body">
                    <div className="skeleton mb-2" style={{ height: 20, width: "70%" }} />
                    <div className="skeleton mb-2" style={{ height: 16, width: "100%" }} />
                    <div className="skeleton" style={{ height: 16, width: "60%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="row">
            <div className="col-lg-8 mx-auto text-center py-5">
              <i className="bi bi-journal" style={{ fontSize: "3rem", color: "#9f523a" }} />
              <h5 className="mt-3 text-muted">No stories published yet</h5>
              <p className="text-muted">Check back soon for amazing fashion stories and tips</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-sm-6 col-lg-4">
                <Link href={`/stories/${blog.slug}`} className="text-decoration-none text-dark">
                  <div className="card border-0 story-card h-100">
                    {/* Image */}
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={400}
                        height={220}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: 220 }}
                      />
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center"
                        style={{
                          height: 220,
                          background: "linear-gradient(135deg, #9f523a 0%, #7a3f2c 100%)",
                        }}
                      >
                        <i className="bi bi-image text-white" style={{ fontSize: "2.5rem" }} />
                      </div>
                    )}

                    {/* Body */}
                    <div className="card-body d-flex flex-column">
                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                          {blog.tags.slice(0, 2).map((t) => (
                            <span key={t} className="badge badge-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h5 className="fw-bold mb-2" style={{ color: "#1a1a1a", lineHeight: 1.4 }}>
                        {blog.title}
                      </h5>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p
                          className="text-muted small mb-3"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1,
                          }}
                        >
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Read More */}
                      <span className="read-more-link mb-3">
                        Read More →
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-white border-top border-light-subtle d-flex justify-content-between align-items-center py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center author-avatar text-white"
                          style={{ width: 32, height: 32, fontSize: "0.9rem" }}
                        >
                          {blog.author[0]}
                        </div>
                        <small className="text-muted">{blog.author}</small>
                      </div>
                      {blog.publishedAt && (
                        <small className="meta-date">
                          <i className="bi bi-calendar me-1"></i>
                          {formatDate(blog.publishedAt)}
                        </small>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
