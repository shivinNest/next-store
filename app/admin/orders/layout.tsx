import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Orders – Admin",
  description: "View and manage customer orders on dstore.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
