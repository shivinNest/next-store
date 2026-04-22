import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage all your saaviya.in orders.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
