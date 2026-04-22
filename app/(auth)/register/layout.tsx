import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account",
  description: "Join saaviya.in – create your free account to shop the latest women's fashion.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
