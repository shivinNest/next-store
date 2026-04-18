import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the dstore.in admin panel.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
