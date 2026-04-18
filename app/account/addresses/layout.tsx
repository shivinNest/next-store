import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Addresses",
  description: "Manage your saved delivery addresses on dstore.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
