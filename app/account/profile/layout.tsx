import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your dstore.in account details and preferences.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
