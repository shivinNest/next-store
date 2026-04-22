import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({
    where: { slug: category },
    select: { name: true, description: true },
  });
  if (!cat) {
    const label = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { title: label };
  }
  return {
    title: cat.name,
    description: cat.description?.substring(0, 160) ?? `Shop ${cat.name} at saaviya.in – latest styles & best prices.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
