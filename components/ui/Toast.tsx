"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type = "success", visible, onHide }: ToastProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setAnimating(true);
      const t = setTimeout(() => {
        setAnimating(false);
        setTimeout(onHide, 300);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible && !animating) return null;

  const isSuccess = type === "success";

  return (
    <>
      <style>{`
        @keyframes toastIn  { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastOut { from { opacity: 1; transform: translateX(0); }   to { opacity: 0; transform: translateX(60px); } }
      `}</style>
      <div style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        background: "#fff",
        border: `1px solid ${isSuccess ? "rgba(32,201,151,0.3)" : "rgba(220,53,69,0.3)"}`,
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 260,
        maxWidth: 340,
        animation: `${animating ? "toastIn" : "toastOut"} 0.3s ease forwards`,
      }}>
        <i
          className={`bi ${isSuccess ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}
          style={{ color: isSuccess ? "#20c997" : "#dc3545", fontSize: "1.2rem", flexShrink: 0 }}
        />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a", flex: 1 }}>{message}</span>
        <button
          onClick={() => { setAnimating(false); onHide(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 0, lineHeight: 1, flexShrink: 0 }}
        >
          <i className="bi bi-x" style={{ fontSize: "1rem" }} />
        </button>
      </div>
    </>
  );
}
