import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Users – Admin",
  description: "Manage registered customers on saaviya.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
