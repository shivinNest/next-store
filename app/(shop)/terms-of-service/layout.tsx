import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions governing your use of saaviya.in.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
