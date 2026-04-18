import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review the items in your cart and proceed to checkout.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
