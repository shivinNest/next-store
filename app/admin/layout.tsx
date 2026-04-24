"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Login page doesn't need the check — its own layout renders it directly
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || d.data?.role !== "ADMIN") {
          router.replace("/admin/login");
        } else {
          setChecked(true);
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [pathname, router]);

  // While checking, render nothing so the sidebar never flashes
  if (!checked) return null;

  // Login page uses its own plain layout — just render children
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="admin-content p-4 flex-grow-1">
        {children}
      </div>
    </div>
  );
}
