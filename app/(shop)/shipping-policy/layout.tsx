import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about dstore.in's delivery timelines, charges, and shipping partners.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
