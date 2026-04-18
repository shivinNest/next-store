import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Products – Admin",
  description: "Manage product listings on dstore.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
