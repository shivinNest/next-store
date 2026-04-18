import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your dstore.in account.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
