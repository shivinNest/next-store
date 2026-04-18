import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Categories – Admin",
  description: "Manage product categories on dstore.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
