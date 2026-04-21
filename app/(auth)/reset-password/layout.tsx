import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reset Password | Saaviya",
  description: "Set a new password for your Saaviya account.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
