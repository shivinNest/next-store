import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Understand saaviya.in's hassle-free return and refund process.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
