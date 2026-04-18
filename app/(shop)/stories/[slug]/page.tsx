"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  tags: string[];
  publishedAt?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBlog(d.data);
        else router.replace("/stories");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) {
    return (
      <div className="bg-light py-5">
        <div className="container">
          <div className="skeleton mb-4" style={{ height: 360, borderRadius: "0.375rem" }} />
          <div className="skeleton mb-3" style={{ height: 32, width: "70%" }} />
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-light py-5">
      <style>{`
        .blog-detail-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .breadcrumb-link {
          color: #9f523a;
          text-decoration: none;
        }
        .breadcrumb-link:hover {
          color: #7a3f2c;
          text-decoration: underline;
        }
        .badge-tag {
          background-color: #f0f0f0 !important;
          color: #9f523a !important;
          font-weight: 600;
          border-color: #9f523a !important;
          font-size: 0.75rem;
        }
        .blog-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .blog-meta {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #dee2e6;
        }
        .blog-meta .author-avatar {
          background: linear-gradient(135deg, #9f523a, #7a3f2c) !important;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .blog-meta .meta-date {
          color: #9f523a;
          font-weight: 600;
        }
        .blog-image-wrapper {
          border-radius: 0.375rem;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .blog-image-wrapper img {
          transition: transform 0.3s ease;
        }
        .blog-content {
          color: #555;
          line-height: 1.85;
          font-size: 1.05rem;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content h2,
        .blog-content h3 {
          color: #1a1a1a;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
        }
        .blog-content h2 {
          font-size: 1.8rem;
        }
        .blog-content h3 {
          font-size: 1.4rem;
        }
        .blog-content strong {
          color: #9f523a;
          font-weight: 700;
        }
        .blog-content a {
          color: #9f523a;
          text-decoration: none;
          font-weight: 600;
        }
        .blog-content a:hover {
          color: #7a3f2c;
          text-decoration: underline;
        }
        .blog-content blockquote {
          border-left: 4px solid #9f523a;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #666;
        }
        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1.5rem;
          margin-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .back-button {
          color: #9f523a;
          border-color: #9f523a;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .back-button:hover {
          background-color: #9f523a;
          color: white;
        }
      `}</style>

      <div className="container">
        <article className="blog-detail-container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/" className="breadcrumb-link">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/stories" className="breadcrumb-link">Stories</Link>
              </li>
              <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 300 }}>
                {blog.title}
              </li>
            </ol>
          </nav>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {blog.tags.map((t) => (
                <span key={t} className="badge badge-tag">{t}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="blog-title">{blog.title}</h1>

          {/* Meta Information */}
          <div className="blog-meta d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center author-avatar text-white"
                style={{ width: 40, height: 40 }}
              >
                {blog.author[0]}
              </div>
              <div>
                <div className="fw-600" style={{ color: "#1a1a1a" }}>{blog.author}</div>
                {blog.publishedAt && (
                  <div className="meta-date small">
                    <i className="bi bi-calendar3 me-1" />
                    {formatDate(blog.publishedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="blog-image-wrapper" style={{ height: 400 }}>
              <Image
                src={blog.image}
                alt={blog.title}
                width={800}
                height={400}
                className="w-100"
                style={{ objectFit: "cover", height: "100%" }}
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Back Link */}
          <div className="mt-5 pt-4 border-top">
            <Link href="/stories" className="btn back-button btn-outline-primary">
              <i className="bi bi-arrow-left me-2" />Back to Stories
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
