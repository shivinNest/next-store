import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hero Slides – Admin",
  description: "Manage hero carousel slides displayed on the home page.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
