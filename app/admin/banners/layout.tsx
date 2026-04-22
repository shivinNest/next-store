import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Banners – Admin",
  description: "Manage promotional banners displayed on saaviya.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
