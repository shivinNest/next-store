import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;

  if (!slug || slug === "all") {
    return { title: "All Products" };
  }

  const cat = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!cat) {
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { title: label };
  }

  return {
    title: cat.name,
    description: cat.description?.substring(0, 160) ?? `Shop ${cat.name} at saaviya.in — latest styles & best prices.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
