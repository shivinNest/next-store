import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Testimonials – Admin",
  description: "Manage customer testimonials shown on dstore.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
