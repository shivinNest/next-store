import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your saaviya.in account details and preferences.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
