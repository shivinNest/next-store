import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Customer Testimonials",
  description: "Read genuine reviews and testimonials from thousands of happy saaviya.in customers across India.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
