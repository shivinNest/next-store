import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "saaviya.in admin dashboard – overview of orders, products, and revenue.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
