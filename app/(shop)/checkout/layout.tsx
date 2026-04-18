import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely. Fast delivery across India.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
