import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage all your dstore.in orders.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
