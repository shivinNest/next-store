import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Stories",
  description: "Fashion tips, style guides, and trend reports from the saaviya.in team.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
