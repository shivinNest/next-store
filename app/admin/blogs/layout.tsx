import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Stories – Admin",
  description: "Manage blog/stories posts on saaviya.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
