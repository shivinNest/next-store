export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f5ede8 0%, #faf9f7 50%, #f0ece8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "60px 16px 60px",
          position: "relative",
        }}
      >
        {/* Subtle decorative circles */}
        <div style={{ position: "fixed", top: "-80px", right: "-80px", width: 320, height: 320, borderRadius: "50%", background: "rgba(159,82,58,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-60px", left: "-60px", width: 240, height: 240, borderRadius: "50%", background: "rgba(159,82,58,0.05)", pointerEvents: "none" }} />
        {children}
      </div>
    </>
  );
}
