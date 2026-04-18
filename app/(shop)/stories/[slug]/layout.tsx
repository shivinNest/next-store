import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!blog) return { title: "Story" };
  return {
    title: blog.title,
    description: blog.excerpt?.substring(0, 160) ?? undefined,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
