import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with dstore.in. We're here to help with orders, returns, and anything else.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
