"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStatus("success");
          setMessage(d.message);
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(d.error || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token, router]);

  return (
    <div className="w-100 text-center" style={{ maxWidth: 420 }}>
      <div className="card border-0 shadow-sm rounded-4 p-5">
        {status === "loading" && (
          <>
            <div className="spinner-border text-primary mx-auto mb-4" />
            <h2 className="h4 fw-bold mb-2">Verifying your email...</h2>
            <p className="text-muted">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div
              className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 72, height: 72, background: "#d4edda" }}
            >
              <i className="bi bi-check2-circle text-success fs-1" />
            </div>
            <h2 className="h4 fw-bold mb-2">Email Verified!</h2>
            <p className="text-muted mb-4">{message}</p>
            <p className="text-muted small">Redirecting to login...</p>
            <Link href="/login" className="btn btn-primary w-100 mt-2">
              Login Now
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div
              className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 72, height: 72, background: "#f8d7da" }}
            >
              <i className="bi bi-x-circle text-danger fs-1" />
            </div>
            <h2 className="h4 fw-bold mb-2">Verification Failed</h2>
            <p className="text-muted mb-4">{message}</p>
            <Link href="/register" className="btn btn-primary w-100">
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
