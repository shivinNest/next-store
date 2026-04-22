import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance — Saaviya",
  description: "We are performing scheduled maintenance. We'll be back shortly.",
};

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #fdf8f6;
          min-height: 100vh;
        }

        .maintenance-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(159, 82, 58, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(159, 82, 58, 0.04) 0%, transparent 60%),
            #fdf8f6;
          position: relative;
          overflow: hidden;
        }

        /* Decorative blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: rgba(159, 82, 58, 0.07);
          top: -120px; left: -150px;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: rgba(159, 82, 58, 0.05);
          bottom: -100px; right: -100px;
        }

        .card {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 24px;
          padding: 3.5rem 3rem;
          max-width: 560px;
          width: 100%;
          text-align: center;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 32px rgba(159, 82, 58, 0.08),
            0 24px 64px rgba(0,0,0,0.06);
          border: 1px solid rgba(159, 82, 58, 0.08);
        }

        .logo-wrap {
          display: inline-block;
          margin-bottom: 2.5rem;
        }

        .icon-ring {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(159,82,58,0.12) 0%, rgba(159,82,58,0.06) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.75rem;
          position: relative;
        }
        .icon-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px dashed rgba(159,82,58,0.2);
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .icon-ring svg {
          width: 36px; height: 36px;
          color: #9f523a;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(159,82,58,0.08);
          color: #9f523a;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 1.25rem;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #9f523a;
          border-radius: 50%;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        h1 {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.25;
          margin-bottom: 0.75rem;
          letter-spacing: -0.3px;
        }

        .subtitle {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.65;
          margin-bottom: 2rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(159,82,58,0.15), transparent);
          margin: 2rem 0;
        }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #9f523a;
          font-weight: 500;
          margin-bottom: 2rem;
        }
        .status-bar {
          display: flex;
          gap: 3px;
        }
        .status-bar span {
          display: block;
          width: 28px; height: 4px;
          border-radius: 2px;
          background: rgba(159,82,58,0.2);
          overflow: hidden;
          position: relative;
        }
        .status-bar span::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #9f523a;
          border-radius: 2px;
          animation: fill 3s ease-in-out infinite;
        }
        .status-bar span:nth-child(2)::after { animation-delay: 0.4s; }
        .status-bar span:nth-child(3)::after { animation-delay: 0.8s; }
        @keyframes fill {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        .contact-box {
          background: #fdf8f6;
          border: 1px solid rgba(159,82,58,0.1);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.6;
        }
        .contact-box a {
          color: #9f523a;
          font-weight: 600;
          text-decoration: none;
        }
        .contact-box a:hover {
          text-decoration: underline;
        }

        .footer-note {
          margin-top: 2.5rem;
          font-size: 0.78rem;
          color: #aaa;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 600px) {
          .card { padding: 2.5rem 1.5rem; }
          h1 { font-size: 1.5rem; }
        }
      `}</style>

      <div className="maintenance-page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="card">
          {/* Logo */}
          <div className="logo-wrap">
            <Image
              src="/assets/saaviya_logo_2026.png"
              alt="Saaviya"
              width={130}
              height={50}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          {/* Spinning icon */}
          <div className="icon-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>


          {/* Heading */}
          <h1>We&rsquo;ll be back<br />very soon</h1>

          {/* Subtitle */}
          <p className="subtitle">
            We&rsquo;re currently performing some improvements to give you a better experience.
            Thank you for your patience — we&rsquo;ll be up and running shortly.
          </p>

          {/* Progress */}
          <div className="status-row">
            <div className="status-bar">
              <span /><span /><span />
            </div>
            Work in progress
          </div>

          <div className="divider" />

          {/* Contact */}
          <div className="contact-box">
            Need urgent help? Reach us at{" "}
            <a href="mailto:support@saaviya.in">support@saaviya.in</a>
            {" "}or WhatsApp us — we&rsquo;re happy to assist.
          </div>
        </div>

        <p className="footer-note">
          &copy; {new Date().getFullYear()} Saaviya. All rights reserved.
        </p>
      </div>
    </>
  );
}
