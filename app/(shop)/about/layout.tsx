import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Saaviya | Premium Products & Stories",
  description:
    "Learn about Saaviya - our mission, values, and commitment to quality products and exceptional customer experience.",
  keywords: "about saaviya, our story, mission, values, premium products",
  openGraph: {
    title: "About Saaviya",
    description:
      "Learn about Saaviya - our mission, values, and commitment to quality products.",
    url: "https://saaviya.in/about",
    type: "website",
    images: [
      {
        url: "https://saaviya.in/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
