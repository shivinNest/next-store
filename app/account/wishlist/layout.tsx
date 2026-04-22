import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage items you've saved to your saaviya.in wishlist.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
